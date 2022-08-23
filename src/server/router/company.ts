import { z } from "zod";
import { createProtectedRouter } from "./protected-router";

export const companyRouter = createProtectedRouter()
  .mutation("create", {
    input: z.object({
      name: z.string(),
      address: z.string(),
      invoiceNumberPattern: z.string(),
    }),
    resolve({ input, ctx }) {
      return ctx.prisma.company.create({
        data: {
          ...input,
          users: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });
    },
  })
  .query("getAll", {
    async resolve({ ctx }) {
      return ctx.prisma.company.findMany({
        where: {
          users: {
            every: {
              id: ctx.session.user.id,
            },
          },
        },
      });
    },
  });
