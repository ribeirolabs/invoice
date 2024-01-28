import { z } from "zod";

const requiredString = z.string().refine((value) => value.length > 0, {
  message: "Required",
});

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]),
  AUTH_SECRET: requiredString,
  GOOGLE_CLIENT_ID: requiredString,
  GOOGLE_CLIENT_SECRET: requiredString,
  PORT: z.string().refine((value) => parseInt(value), {
    message: "Invalid, expected numeric value",
  }),
  DOMAIN: z.string().url().optional(),
});

function buildEnv() {
  return envSchema.parse(process.env);
}

export const ENV = buildEnv();
