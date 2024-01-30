import d from "dotenv";
import { z } from "zod";

d.config();

const requiredString = z.string().refine((value) => value.length > 0, {
  message: "Required",
});

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]),
  AUTH_SECRET: requiredString,
  GOOGLE_CLIENT_ID: requiredString,
  GOOGLE_CLIENT_SECRET: requiredString,
  PORT: z
    .string()
    .optional()
    .refine((value) => (value ? parseInt(value) : true), {
      message: "Invalid, expected numeric value",
    }),
  SOCKET_PORT: z
    .string()
    .optional()
    .refine((value) => (value ? parseInt(value) : true), {
      message: "Invalid, expected numeric value",
    }),
  DOMAIN: z.string().url().optional(),
  BROWSERLESS_API_KEY: requiredString,
  DATABASE_URL: z.string().url(),
});

function buildEnv() {
  return envSchema.parse(process.env);
}

export const ENV = buildEnv();
