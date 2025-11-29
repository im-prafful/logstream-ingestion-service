import { insertFnc } from "./populator.mjs"; 
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

// The SQSClient will automatically pick up region and credentials 
// from the Lambda's environment and IAM role.
const sqsClient = new SQSClient({}); 

// URL comes from the SAM template's Environment Variables
const QUEUE_URL = process.env.SQS_QUEUE_URL; 

export const handler = async (event) => {
    // Determine how many logs to send in this 1-minute execution window
    const logsToGenerate = 10; 
    let successCount = 0; //  counter for successful sends

    console.log(`Starting to generate and push ${logsToGenerate} logs sequentially...`);
    
    for (let i = 0; i < logsToGenerate; i++) {
        const log = insertFnc();

        if (!log.level || !log.mssg || !log.sourceMssg || !log.parsedData) {
            console.log("unsupported data type trying to be pushed in SQS");
            continue;
        }

        const command = new SendMessageCommand({
            QueueUrl: QUEUE_URL,
            MessageBody: JSON.stringify(log),
        });
        
        try {
            // Await ensures this SQS call completes before moving to the next iteration
            await sqsClient.send(command);
            successCount++;
            console.log(`[SQS SEND OK] Log ${i + 1} sent successfully.`);
        } catch (err) {
           
            console.error(`[SQS SEND FAILED] Log ${i + 1}:`, err.message);
        }
    }
    
    console.log(`Finished. Successfully sent ${successCount} messages.`);
    
    return {
        statusCode: 200,
        body: JSON.stringify({ message: `Sent ${successCount} messages to SQS.` }),
    };
};
