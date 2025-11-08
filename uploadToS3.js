import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from 'dotenv';
import query from './db.js';
import fs from 'fs';
dotenv.config();

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const filePath = 'D:\\Log_Stream App\\logstream-ingestion-service\\checkpoint.txt';
// Checks if the checkpoint file exists AND is not empty
const isCheckpointExist = fs.existsSync(filePath) && fs.statSync(filePath).size > 0;

const BATCH_SIZE = 25; 

const getData = async () => {
    try {
        // This array will hold ALL rows fetched in this run
        let allRows = [];
        
        const s3Key = `logs/data_export_${Date.now()}.json`;
        let c = 0;

        if (!isCheckpointExist) {
            // COLD START: 
            console.log('Starting COLD START fetch (all data)...');
            const res = await query(`SELECT COUNT(*) FROM logs`);
            const totalRows = parseInt(res.rows[0].count, 10);
            
            
            while (c < totalRows) {
                const response = await query(`SELECT * FROM logs LIMIT ${BATCH_SIZE} OFFSET ${c}`);
                allRows.push(...response.rows); // Aggregate data
                console.log(`... Fetched batch starting from offset ${c}. Total rows so far: ${allRows.length}`);
                c += BATCH_SIZE;
            }
            
            console.log(`Total rows fetched for cold start: ${allRows.length}`);

        } else {
            // INCREMENTAL UPDATE: Fetch new data in batches and aggregate
            console.log('Starting INCREMENTAL UPDATE fetch...');
            const curr_TimeStamp = fs.readFileSync(filePath, 'utf-8');

            const countRes = await query(`SELECT COUNT(*) FROM logs WHERE timestamp > '${curr_TimeStamp}'`);
            const totalRows = parseInt(countRes.rows[0].count, 10);
            

            while (c < totalRows) {
                const res = await query(
                    `SELECT * FROM logs WHERE timestamp > '${curr_TimeStamp}' LIMIT ${BATCH_SIZE} OFFSET ${c}`
                );

                if (res.rows.length === 0) break;

                allRows.push(...res.rows); // Aggregate data
                console.log(`... Fetched incremental batch . Total rows so far: ${allRows.length}`);
                c += BATCH_SIZE;
            }

            console.log(`Total rows fetched for incremental update: ${allRows.length}`);
        }

        // --- SINGLE S3 UPLOAD AFTER AGGREGATION ---
        if (allRows.length > 0) {
            // Create a single body string with JSON lines
            const bodyContent = allRows.map(r => JSON.stringify(r)).join('\n');
            
            const params = {
                Bucket: process.env.S3_BUCKET,
                Key: s3Key, 
                Body: bodyContent,
                ContentType: "application/json",
            };

            await s3.send(new PutObjectCommand(params));
            console.log(`\nSuccessfully uploaded all ${allRows.length} rows to ONE file at S3 Key: ${s3Key}`);
        } else {
             console.log('\nNo new rows were fetched to upload. S3 upload skipped.');
        }

        // Always update the checkpoint file if the process was successful
        fs.writeFileSync(filePath, new Date().toISOString(), 'utf-8');
        console.log(`Checkpoint updated to: ${new Date().toISOString()}`);


    } catch (err) {
        console.error('ERROR:', err);
    }
};

getData();