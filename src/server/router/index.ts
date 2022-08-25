// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { authRouter } from "./auth";
import { companyRouter } from "./company";
import { invoicePublicRouter, invoiceRouter } from "./invoice";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("auth.", authRouter)
  .merge("company.", companyRouter)
  .merge("invoice.", invoiceRouter)
  .merge("invoice.public.", invoicePublicRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
