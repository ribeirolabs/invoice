import { z } from "zod";
import { createProtectedRouter } from "./protected-router";

export const companyRouter = createProtectedRouter()
  .mutation("upsert", {
    input: z.object({
      id: z.string().cuid().nullish(),
      name: z.string(),
      address: z.string(),
      invoiceNumberPattern: z.string(),
    }),
    resolve({ input, ctx }) {
      const data = {
        name: input.name,
        address: input.address,
        invoiceNumberPattern: input.invoiceNumberPattern,
      };

      if (input.id) {
        return ctx.prisma.company.update({
          data,
          where: {
            id: input.id,
          },
        });
      }

      return ctx.prisma.company.create({
        data: {
          ...data,
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
  })
  .query("get", {
    input: z.object({
      id: z.string().cuid(),
    }),
    async resolve({ ctx, input }) {
      if (input.id === "new") {
        return Promise.resolve();
      }

      console.log({ input });

      return ctx.prisma.company.findFirst({
        where: {
          id: input.id,
        },
      });
    },
  });
