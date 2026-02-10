import query from "./db.js";
import { ECSClient, RunTaskCommand } from "@aws-sdk/client-ecs";

const ecsClient = new ECSClient({ region: "ap-south-1" });

export const handler = async (event) => {
    // 1. Log the incoming event to confirm we got the payload
    console.log("Bridge Received Event:", JSON.stringify(event, null, 2));

    const { batchid, startlogid, endlogid } = event;

    if (!batchid || !startlogid || !endlogid) {
        console.error("Missing required batch details in payload:", event);
        return { statusCode: 400, body: "Invalid Payload" };
    }

    try {
        console.log(`Processing Batch ${batchid}: Fetching logs from ${startlogid} to ${endlogid}...`);

        const runTaskCommand = new RunTaskCommand({
            cluster: process.env.ECS_CLUSTER_NAME,
            taskDefinition: process.env.ECS_TASK_DEF_ARN,
            launchType: "FARGATE",
            count: 1,
            networkConfiguration: {
                awsvpcConfiguration: {
                    subnets: process.env.ECS_SUBNET_IDS.split(","),      // Must be an array
                    securityGroups: process.env.ECS_SEC_GROUP_IDS.split(","), // Must be an array
                    assignPublicIp: "ENABLED" // Change to DISABLED if using NAT Gateway
                }
            },

            overrides: {
                containerOverrides: [
                    {
                        name: process.env.ECS_CONTAINER_NAME, // CRITICAL: Must match Task Def
                        environment: [
                            // We pass the "Pointers", not the "Data"
                            { name: "BATCH_ID", value: batchid.toString() },
                            { name: "START_LOG_ID", value: startlogid.toString() },
                            { name: "END_LOG_ID", value: endlogid.toString() },
                        ]
                    }
                ]
            }
        });

        //const ecsResponse = await ecsClient.send(runTaskCommand);
        //const taskArn = ecsResponse.tasks[0].taskArn;
        console.log(`✅ ECS Task Launched:`);

        return { statusCode: 200, status: "Success"};

    } catch (error) {
        console.error(` Error processing Batch ${batchid}:`, error);

        // Optional: Mark as FAILED so you can debug it in the DB later
        await query(`UPDATE batch_order SET status = 'FAILED' WHERE batchid = ${batchid}`);

        throw error; // Throwing ensures AWS Lambda marks this execution as an error in CloudWatch
    }
};