import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  PORT: string;
  DATABASE_URL: string;
}

const loadEnvVeriables = (): EnvConfig => {
  const requireEnvVariables = ["PORT", "DATABASE_URL"];

  requireEnvVariables.forEach((variable) => {
    if (!process.env[variable]) {
      throw new Error("Variable not exist in .env file");
    }
  });

  return {
    PORT: process.env.PORT as string,
    DATABASE_URL: process.env.DATABASE_URL as string,
  };
};

export const envVars = loadEnvVeriables();
