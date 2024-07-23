import { app, InvocationContext, Timer } from "@azure/functions";

export async function seedRddData(myTimer: Timer, context: InvocationContext): Promise<void> {
    context.log('Timer function processed request.');
}

app.timer('seedRddData', {
    schedule: '*/20 * * * * *',
    handler: seedRddData
});
