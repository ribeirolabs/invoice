import { Prisma } from "@prisma/client";
import { z } from "zod";
import { createProtectedRouter } from "./protected-router";

export const companyRouter = createProtectedRouter()
  .mutation("upsert", {
    input: z.object({
      id: z.string().cuid().nullish(),
      name: z.string(),
      currency: z.string(),
      address: z.string(),
      invoiceNumberPattern: z.string(),
      owner: z.boolean(),
    }),
    resolve({ input, ctx }) {
      const data: Prisma.CompanyCreateInput = {
        name: input.name,
        currency: input.currency,
        address: input.address,
        invoiceNumberPattern: input.invoiceNumberPattern,
      };

      if (input.id) {
        return ctx.prisma.company.update({
          data: {
            ...data,
            users: {
              update: {
                data: {
                  owner: input.owner,
                },
                where: {
                  userId_companyId: {
                    userId: ctx.session.user.id,
                    companyId: input.id,
                  },
                },
              },
            },
          },
          where: {
            id: input.id,
          },
        });
      }

      return ctx.prisma.company.create({
        data: {
          ...data,
          users: {
            create: {
              owner: input.owner,
              user: {
                connect: {
                  id: ctx.session.user.id,
                },
              },
            },
          },
        },
      });
    },
  })
  .query("share", {
    input: z.object({
      companyId: z.string().cuid(),
      userId: z.string().cuid(),
    }),
    async resolve({ input, ctx }) {
      // eslint-ignore
      const { id, ...company } = await ctx.prisma.company.findFirstOrThrow({
        where: {
          id: input.companyId,
        },
      });

      return ctx.prisma.company.create({
        data: {
          ...company,
          users: {
            create: {
              userId: input.userId,
              owner: false,
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
            some: {
              userId: ctx.session.user.id,
            },
          },
        },
        include: {
          users: true,
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

      return ctx.prisma.company.findFirst({
        where: {
          id: input.id,
        },
        select: {
          id: true,
          address: true,
          currency: true,
          name: true,
          invoiceNumberPattern: true,
          users: {
            select: {
              userId: true,
              owner: true,
            },
          },
        },
      });
    },
  });
