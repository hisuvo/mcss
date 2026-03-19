import "dotenv/config";
import { defineConfig } from "prisma/config";
import { envVars } from "./src/app/config/env";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // url: env("DATABASE_URL"),
    url: envVars.DATABASE_URL,
  },
});
