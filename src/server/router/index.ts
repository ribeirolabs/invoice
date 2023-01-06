// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { authRouter } from "./auth";
import { companyRouter } from "./company";
import { invoiceRouter } from "./invoice";
import { userRouter } from "./user";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("auth.", authRouter)
  .merge("company.", companyRouter)
  .merge("user.", userRouter)
  .merge("invoice.", invoiceRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
