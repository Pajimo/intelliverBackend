import { app, InvocationContext, Timer } from "@azure/functions";

export async function DailyUpdateFunction(myTimer: Timer, context: InvocationContext): Promise<void> {
    context.log('Timer function processed request.');
}

app.timer('DailyUpdateFunction', {
    schedule: '0 0 0 * * *',
    handler: DailyUpdateFunction
});
