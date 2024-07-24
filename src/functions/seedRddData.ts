import { app, InvocationContext, Timer } from "@azure/functions";
import { SecretClient } from "@azure/keyvault-secrets";
import { DefaultAzureCredential } from "@azure/identity";
import { Client } from "@elastic/elasticsearch";
import { seedData } from "../sensorSeeding";

const INDEX_NAME = "sensor_readings";

export async function seedRddData(
  _myTimer: Timer,
  context: InvocationContext
): Promise<void> {
  const thresholdLikelyhood = process.env.THRESHOLD_LIKELYHOOD as
    | "high"
    | "low"
    | undefined;

  const vaultName = process.env["KeyVault_Name"];
  if (!vaultName) {
    throw new Error("KeyVault_Name is not set.");
  }
  const credential = new DefaultAzureCredential();

  const url = `https://${vaultName}.vault.azure.net/`;

  const client = new SecretClient(url, credential);
  const secretApiKey = await client.getSecret("ElasticSearchApiKey");
  const secretUrl = await client.getSecret("ElasticSearchUrl");

  if (!secretUrl.value || !secretApiKey.value) {
    throw new Error("Secrets not found.");
  }

  context.info(`Connecting to ${secretUrl.value}`);

  const elastic = new Client({
    node: secretUrl.value,
    auth: {
      apiKey: secretApiKey.value,
    },
  });

  const resp = await elastic.info();

  if (!resp.cluster_name) {
    throw new Error(
      "Could not connect to ElasticSearch. No cluster name found."
    );
  }

  context.info(`Connected to cluster ${resp.cluster_name}`);
  context.info(
    `Seeding with ${thresholdLikelyhood} likelyhood of breaking threshold.`
  );

  const datasource = seedData(thresholdLikelyhood ?? "low");

  if (!(await elastic.indices.exists({ index: INDEX_NAME }))) {
    // Index does not exist, create it with proper mappings
    context.log(`Creating index ${INDEX_NAME}.`);

    await elastic.indices.create({
      index: INDEX_NAME,
      body: {
        mappings: {
          properties: {
            sensorId: { type: "keyword" },
            sensor: {
              type: "nested",
              properties: {
                id: { type: "keyword" },
              },
            },
          },
        },
      },
    });
  }

  const result = await elastic.helpers.bulk({
    datasource,
    onDocument: (doc) => ({ index: { _index: INDEX_NAME } }),
  });

  context.log(
    `Indexed ${result.successful} documents. ${result.failed} failed.`
  );
}

app.timer("seedRddData", {
  schedule: "*/20 * * * * *",
  handler: seedRddData,
  retry: {
    strategy: "fixedDelay",
    maxRetryCount: 0,
    delayInterval: 1000,
  },
});
