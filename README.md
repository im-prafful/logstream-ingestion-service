# LogStream Ingestion Service

The LogStream ingestion service is the entry point of the backend log pipeline. It is responsible for generating or accepting logs, pushing them into SQS, inserting them into PostgreSQL, creating processing batches, and triggering downstream ECS-based ML processing.

## What This Service Does

This repository is not just a single ingest endpoint. It contains the full ingestion-side pipeline.

Its job is to:

- create or receive raw logs
- publish those logs to Amazon SQS
- poll the queue and write logs into PostgreSQL
- store failed records separately
- group new logs into processing batches
- launch an ECS/Fargate task for downstream clustering and enrichment

In short, this repo moves logs from "incoming events" to "ready for ML processing."

## Main Flow

High-level pipeline:

`LogProducer -> SQS -> LogPipeline -> logs table -> ML_Batch_Processor -> ECS task -> processing service`

This repo handles everything up to the point where the processing-service container takes over.

## Repo Snapshot

The image below shows the current top-level layout of the ingestion service:

![Ingestion service repo snapshot](docs/diagrams/repo-snapshot.svg)

## Architecture At A Glance

There are 3 main parts in this repo:

- `LogProducer`
- `LogPipeline`
- `ML_Batch_Processor`

### 1. `LogProducer`

This component generates log objects and pushes them to SQS.

What it does:

- creates semantic test logs
- chooses a source, level, message, and parsed payload
- sends each log as a separate SQS message

So this is the "log creation / queue publish" stage.

### 2. `LogPipeline`

This component consumes SQS messages and writes them into PostgreSQL.

What it does:

- polls SQS
- parses each message body
- inserts valid logs into the `logs` table
- inserts failed records into `failedlogs`
- deletes processed messages from SQS

So this is the "queue consumer / DB writer" stage.

### 3. `ML_Batch_Processor`

This component watches the `logs` table and creates batches for downstream processing.

What it does:

- looks for unclustered `warning` and `error` logs
- groups them into batches of 500
- writes a row into `batch_order`
- marks the batch `PENDING`
- launches an ECS/Fargate task when the pipeline is free

So this is the "handoff to processing" stage.

## Detailed End-To-End Flow

### Step 1. Logs are generated or prepared

`LogProducer/app.mjs` creates log objects using the populator logic.

Each log includes fields like:

- `level`
- `mssg`
- `sourceMssg`
- `parsedData`

The producer then sends each log to SQS.

### Step 2. SQS acts as a buffer

The queue decouples log creation from database writing.

That means:

- the producer can stay fast
- database insertion can happen separately
- temporary downstream slowdowns do not block log creation immediately

### Step 3. The pipeline polls SQS

`LogPipeline/app.mjs` fetches messages from SQS in a polling cycle.

For each message:

- it tries to parse the JSON body
- valid records are collected for DB insertion
- malformed records are tracked as failed logs

### Step 4. Valid logs are inserted into PostgreSQL

The pipeline inserts records into the `logs` table.

Important current behavior:

- `cluster_id` is inserted as `NULL`
- that means the log is ingested but not yet clustered

This service is responsible for landing the raw log into the database.

### Step 5. Failed logs are stored separately

If parsing or insertion fails, the failed records are written into the `failedlogs` table.

This gives you a place to inspect bad or partially broken records without losing visibility.

### Step 6. The queue messages are deleted

After the cycle finishes, the pipeline deletes the processed SQS messages.

If deletion fails, SQS visibility timeout behavior allows the messages to reappear later.

### Step 7. Batch creation begins

`ML_Batch_Processor/app.mjs` checks the `logs` table for logs that are:

- `level IN ('error', 'warning')`
- `cluster_id IS NULL`

If it finds at least 500 matching logs, it creates a row in `batch_order` with:

- `startlogid`
- `endlogid`
- `status = 'PENDING'`

If there are fewer than 500 logs, it does nothing yet.

### Step 8. The bridge decides whether processing can start

`Bridge_Payload.js` checks whether another batch is already `PROCESSING`.

If yes:

- the new batch stays `PENDING`

If no:

- the oldest `PENDING` batch is selected
- its status is changed to `PROCESSING`
- ECS is asked to run the downstream task

### Step 9. ECS/Fargate task is launched

`ecs_task.js` calls ECS `RunTask` and starts the downstream processing container.

It passes these environment variables into the container:

- `BATCH_ID`
- `START_LOG_ID`
- `END_LOG_ID`

Those values tell the downstream processing service exactly which log range it should handle.

## What This Repo Does Not Do

This repo does not do the final ML clustering itself.

That happens in the downstream processing service after ECS launches the task.

This repo's responsibility ends at:

- batch creation
- batch status move to `PROCESSING`
- ECS task launch

The downstream processing service later marks the batch `COMPLETED`.

## Key AWS Pieces

This repo uses:

- AWS Lambda
- Amazon SQS
- AWS ECS Fargate
- AWS SAM
- PostgreSQL (RDS)

From `template.yaml`, the main deployed functions are:

- `LogProducerFunction`
- `LogPipelineFunction`
- `MLBatchProcessorFunction`

Important files:

- `LogProducer/app.mjs`: sends logs to SQS
- `LogPipeline/app.mjs`: polls SQS and writes to DB
- `ML_Batch_Processor/app.mjs`: creates `batch_order` entries
- `ML_Batch_Processor/Bridge_Payload.js`: moves batches to `PROCESSING`
- `ML_Batch_Processor/ecs_task.js`: launches ECS tasks
- `template.yaml`: SAM deployment template

## Tech Stack

- Node.js 20
- AWS Lambda
- Amazon SQS
- AWS ECS Fargate
- AWS SAM
- PostgreSQL
- pg
- AWS SDK for JavaScript

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- AWS SAM CLI
- access to the target PostgreSQL database
- access to the existing SQS queue
- ECS task definition for the downstream processing container

### Install dependencies

From the repository root:
npm install


If you are working inside subfolders independently, install there as needed as well.

### Build and deploy
sam build
sam deploy --guided


### Local notes

This repo includes local helper files such as:

- `local_env.json`
- `schedule-event.json`
- `LogPipeline/localpoller.js`
- `LogPipeline/localPopulator.js`

These are useful for local testing of the queue and DB flow.

## Batch Status Lifecycle

Within this repo, the batch lifecycle is:

- `PENDING`
- `PROCESSING`
- `FAILED` if ECS task launch fails

Important note:

- this repo does not mark a batch `COMPLETED`
- that happens later in the downstream processing service after the ECS task finishes successfully

## Known Gaps

- some infrastructure values and secrets are still hardcoded
- some SQL is built through string interpolation instead of parameterized queries


## README Scope

This README is meant to help someone opening the repo quickly understand:

- what the ingestion service really contains
- how logs move from producer to DB
- how batches are created
- how ECS handoff works

