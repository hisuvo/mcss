<div align="center">
  <h1 Mini Cloud Storage System (MCSS) API</h1>
  <p><i>A robust backend system for robust file uploading, tracking, and management.</i></p>

  ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
  ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
  ![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
  ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
  ![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
</div>

<br />

## Overview

The **Mini Cloud Storage System (MCSS)** is a backend RESTful API designed to let users upload, manage, and track files securely. It implements enterprise-level features like strict storage limits (500 MB per user by default), soft deletion for safe data recovery, and **content-based file deduplication** to optimize server storage space.

---

## Key Features

- **File Uploads & Storage Management:** Securely upload files with automatic enforcement of user storage limits.
- **Content-Based Deduplication:** Uses SHA-256 hashing to ensure identical files uploaded by different users are stored only once physically.
- **Soft Deletion & Recovery:** Deleted files are marked as inactive rather than physically removed, allowing audits and potential recovery.
- **Concurrency-Safe:** Utilizes atomic database transactions to guarantee consistent state, preventing race conditions when handling simultaneous uploads.
- **File & Storage Tracking:** Clean endpoints to fetch current active files and comprehensive storage usage summaries.
- **Scalable Architecture:** Modular design prepared for future growth to thousands of concurrent users.

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL (Compatible with MySQL)
- **ORM:** Prisma
- **File Handling:** Multer
- **Package Manager:** pnpm

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [pnpm](https://pnpm.io/) (`npm install -g pnpm`)
- PostgreSQL Server running locally or on the cloud

### 1. Installation

Clone the repository and install the dependencies:

```bash
git clone <repo-url>
cd mcss
pnpm install
```

### 2. Environment Setup

Create a `.env` file in the root directory and configure your database and port:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mcss_db?schema=public"
PORT=5000
```

### 3. Database Migration

Apply the Prisma schema to your database to create the necessary tables:

```bash
pnpm prisma migrate dev
pnpm prisma generate
```

### 4. Running the Application

**Development Mode (with Hot Reload):**
```bash
pnpm dev
# The server will start at http://localhost:5000
```

**Production Mode:**
```bash
pnpm build
pnpm start
```

---

## API Reference

### Upload a File
```http
POST /users/:user_id/files
```
**Body (Form-Data):**
- `file`: the binary file to upload.

### List User Files
```http
GET /users/:user_id/files
```
**Returns:** A list of all active files for the user (Name, Size, Upload Time).

### Get Storage Summary
```http
GET /users/:user_id/storage-summary
```
**Returns:** Total storage used, remaining storage, and total active file count.

### Delete a File
```http
DELETE /users/:user_id/files/:file_id
```
**Effect:** Soft deletes the file and frees up the user's allocated storage limit.

---

## Design Decisions & Architecture

1. **Storage Tracking:** Storage is rigorously tracked per user (`storageUsedMb`). 
2. **Deduplication Strategy:** The SHA-256 hash of every uploaded file is computed. If the hash already exists in the system, a new database record pointing to the identical physical file is created instead of storing duplicate bytes.
3. **Soft Deletes:** Records are explicitly flagged as active or inactive, leaving a paper trail of uploads and ensuring easy restoration interfaces if built out later.
4. **Concurrency Control:** Checking storage limits and inserting the record occur within a single database transaction. This ensures the total storage never exceeds the allowed limit, even if an aggressive bot attempts parallel uploads.

---

## Scalability Considerations (For 100K+ Users)

- **Horizontal Scaling:** The API is stateless and can be deployed behind a Load Balancer (e.g., Nginx, AWS ALB) alongside multiple app instances.
- **Storage Subsystem:** Transition file storage out of the local disk and into standard object storage formats like Amazon S3 or Google Cloud Storage (GCS). Pair with a CDN for distributed, high-speed downloads.
- **Database:** Shift read-heavy traffic (like file listings) to read-replicas. Ensure `user_id` and `file_hash` fields have optimal indices.
- **Background Jobs:** Offload hashing, deduplication logic, and hard-deletion cleanup to dedicated background worker queues (like RabbitMQ or BullMQ).

---

## Future Improvements

- [ ] JWT-based Authentication & Authorization.
- [ ] Directory / Folder hierarchy.
- [ ] Direct file sharing via secure, expiring URLs.
- [ ] Multipart/chunked uploads for massive files >1GB.
- [ ] Pre-upload virus scanning integrations.

---

<div align="center">
  <i>Built with 💡 using Node, TypeScript, and Prisma.</i>
</div>
