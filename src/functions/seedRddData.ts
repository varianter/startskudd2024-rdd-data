import { app, InvocationContext, Timer } from "@azure/functions";
import { SecretClient } from "@azure/keyvault-secrets";
import { DefaultAzureCredential } from "@azure/identity";
import { Client } from "@elastic/elasticsearch";

export async function seedRddData(
  myTimer: Timer,
  context: InvocationContext
): Promise<void> {
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

  context.log(resp);

  //   context.log("Secrets found.", secretUrl.value, secretApiKey.value);
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
