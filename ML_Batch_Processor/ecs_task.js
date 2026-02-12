import { ECSClient, RunTaskCommand } from "@aws-sdk/client-ecs";

const ecsClient = new ECSClient({ region: "ap-south-1" });

export const launchEcsTask = async (batchid, startlogid, endlogid) => {
    console.log(`Processing Batch ${batchid}: Launching ECS Task for logs ${startlogid} to ${endlogid}...`);

    const runTaskCommand = new RunTaskCommand({
        cluster: process.env.ECS_CLUSTER_NAME,
        taskDefinition: process.env.ECS_TASK_DEF_ARN,
        launchType: "FARGATE",
        count: 1,
        networkConfiguration: {
            awsvpcConfiguration: {
                subnets: process.env.ECS_SUBNET_IDS.split(","),
                securityGroups: process.env.ECS_SEC_GROUP_IDS.split(","),
                assignPublicIp: "ENABLED"
            }
        },
        overrides: {
            containerOverrides: [
                {
                    name: process.env.ECS_CONTAINER_NAME,
                    environment: [
                        { name: "BATCH_ID", value: batchid.toString() },
                        { name: "START_LOG_ID", value: startlogid.toString() },
                        { name: "END_LOG_ID", value: endlogid.toString() },
                    ]
                }
            ]
        }
    });

    try {
        const ecsResponse = await ecsClient.send(runTaskCommand);
        const taskArn = ecsResponse.tasks[0]?.taskArn;
        console.log(` ECS Task Launched: ${taskArn}`);
        return taskArn;
    } catch (launchError) {
        console.error(`Failed to launch ECS Task for Batch ${batchid}:`, launchError);
        throw launchError;
    }
};
