import { PrismaClient } from "@prisma/client";
import invariant from "tiny-invariant";
import { ENV } from "~/env.server";

declare global {
  let __prisma: any;
}

let prisma: PrismaClient;
// This is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
if (ENV.NODE_ENV === "production") {
  prisma = new PrismaClient();
  prisma.$connect();
} else {
  if (!(global as any).__prisma) {
    (global as any).__prisma = new PrismaClient();
    (global as any).__prisma.$connect();
  }
  prisma = (global as any).__prisma;
}

invariant(prisma, "Unable to setup prisma");

export default prisma;
