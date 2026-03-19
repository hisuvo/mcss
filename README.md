# Mini Cloud Storage System (mcss)

A basic cloud storage service that allows users to upload, delete, and manage files.

## Features

- User file upload and tracking
- 500MB storage limits per user
- File deduplication by computing hashes
- Duplicate name blocking
- Storage summary and list files endpoints

## How to run locally

1. Run \`npm install\`
2. Configure \`DATABASE_URL\` in \`.env\`
3. Run \`npx prisma db push\` and \`npx prisma generate\`
4. Run \`npm run dev\`

## Endpoints
Base URL: \`/api/v1/users\`

- **POST** \`/:userId/files\`: Upload metadata \`{ name, mimeType, size, hash }\`
- **DELETE** \`/:userId/files/:fileId\`: Delete a file reference
- **GET** \`/:userId/files\`: List all files
- **GET** \`/:userId/storage-summary\`: Get active file counts and used storage

## Scaling to 100K Concurrent Uploads

To handle extreme concurrency dynamically, we utilize Prisma's raw execution to do conditional atomic updates directly within PostgreSQL.

\`UPDATE "User" SET "storageUsed" = "storageUsed" + ? WHERE id = ? AND "storageUsed" + ? <= 524288000\`

This avoids race conditions precisely. File Deduplication relies on the database unique constraint (\`PhysicalFile.hash\`), preventing redundant data insertions efficiently handling P2002 errors to reuse existing physical storage hashes.
