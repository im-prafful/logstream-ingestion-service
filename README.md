LogStream - Ingestion Service 📥

A high-throughput, lightweight NestJS microservice responsible for receiving, validating, and queuing raw log data for the LogStream platform.

This service acts as the primary, fault-tolerant entry point for all incoming log data. Its sole purpose is to accept log payloads via a secure API endpoint and immediately publish them to an SQS queue for asynchronous processing, ensuring zero data loss and minimal latency.

---

### Key Features

- **High Throughput**: Built with NestJS on Node.js for efficient, non-blocking I/O.
- **Secure Endpoint**: Validates incoming requests using API keys.
- **Resilient**: Utilizes AWS SQS to decouple ingestion from processing, guaranteeing data durability.
- **Containerized**: Fully containerized with Docker for consistent development and deployment.

### Tech Stack

- **Framework**: NestJS (TypeScript)
- **Containerization**: Docker
- **Deployment**: AWS Fargate
- **Queuing**: Amazon SQS

---

### Getting Started

_Instructions for local setup, environment variables, and running the service will be added here._

### API Documentation

_Details of the `/ingest` endpoint will be added here._
