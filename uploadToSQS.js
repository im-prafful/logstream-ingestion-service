import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import dotenv from "dotenv";
import express from "express";
import { insertFnc } from "./populator.js";

dotenv.config()

//--------------AWS SQS SETUP---------------
const sqsClient = new SQSClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});

const QUEUE_URL = 'https://sqs.ap-south-1.amazonaws.com/031415497613/SQS_LogIngestion'


//--------logic to push inside SQS----------
async function pushToSQS() {
    try {
        const log = insertFnc()

        if (!log.level || !log.mssg || !log.sourceMssg || !log.parsedData) {
            console.log('unsupported data type trying to be pushed in SQS')
        }

        const command = new SendMessageCommand({
            QueueUrl: QUEUE_URL,
            MessageBody: JSON.stringify(log)
        })

        const response = await sqsClient.send(command);
        console.log(`Message sent with ID: ${response.MessageId}`);
    } catch (err) {
        console.error(err)
    }

}

setInterval(()=>{
    pushToSQS()
},3000)