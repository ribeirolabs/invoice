import { z } from "zod";

if (process.env.NODE_ENV === "development") {
  const d = await import("dotenv");
  d.config();
}

const requiredString = z.string().refine((value) => value.length > 0, {
  message: "Required",
});

const DEFAULT_DOMAIN = "http://localhost";

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
  DOMAIN: z.string().url().optional().default(DEFAULT_DOMAIN),
  BROWSERLESS_API_KEY: requiredString,
  DATABASE_URL: z.string().url(),
});

function buildEnv() {
  const env = envSchema.parse(process.env);

  if (env.DOMAIN === DEFAULT_DOMAIN) {
    env.DOMAIN = [env.DOMAIN, env.PORT].filter(Boolean).join(":");
  }

  return env;
}

export const ENV = buildEnv();
