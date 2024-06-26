import { Prisma } from "@prisma/client";
import { z } from "zod";
import { createProtectedRouter } from "./protected-router";

export const companyRouter = createProtectedRouter()
  .mutation("upsert", {
    input: z.object({
      id: z.string().nullish(),
      name: z.string().min(5),
      email: z.string().email(),
      alias: z.string().optional(),
      currency: z.string().min(3).max(5),
      address: z.string().min(10),
      invoiceNumberPattern: z.string().min(3),
      owner: z.boolean(),
    }),
    async resolve({ input, ctx }) {
      const data: Prisma.CompanyCreateInput = {
        name: input.name.toUpperCase(),
        alias: input.alias?.toUpperCase() || null,
        email: input.email,
        currency: input.currency,
        address: input.address.toUpperCase(),
        invoiceNumberPattern: input.invoiceNumberPattern,
      };

      const userId = ctx.session.user.id;

      if (input.id) {
        const companyId = input.id;

        const where: Prisma.InvoiceWhereInput = {
          userId,
          issuedAt: {
            gt: new Date(),
          },
        };

        const invoiceData = {
          name: input.name,
          address: input.address,
          currency: input.currency,
        };

        const [company] = await Promise.all([
          ctx.prisma.company.update({
            data: {
              ...data,
              users: {
                update: {
                  data: {
                    owner: input.owner,
                  },
                  where: {
                    userId_companyId: {
                      userId,
                      companyId,
                    },
                  },
                },
              },
            },
            where: {
              id: companyId,
            },
          }),

          ctx.prisma.invoice.updateMany({
            data: {
              data: {
                receiver: invoiceData,
              },
            },
            where: {
              ...where,
              receiverId: companyId,
            },
          }),

          ctx.prisma.invoice.updateMany({
            data: {
              data: {
                payer: invoiceData,
              },
            },
            where: {
              ...where,
              payerId: companyId,
            },
          }),
        ]);

        return company;
      }

      return ctx.prisma.company.create({
        data: {
          ...data,
          users: {
            create: {
              owner: input.owner,
              type: "OWNED",
              user: {
                connect: {
                  id: userId,
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
      sharedById: z.string().cuid(),
    }),
    async resolve({ input, ctx }) {
      return ctx.prisma.companiesOnUsers.create({
        data: {
          ...input,
          type: "SHARED",
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
          _count: {
            select: {
              payerInvoices: true,
              receiverInvoices: true,
            },
          },
        },
      });
    },
  })
  .query("get", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      if (input.id === "new") {
        return Promise.resolve();
      }

      return ctx.prisma.company.findFirst({
        where: {
          id: input.id,
        },
        include: {
          users: {
            include: {
              sharedBy: true,
              user: true,
            },
          },
        },
      });
    },
  })
  .mutation("detach", {
    input: z.object({
      companyId: z.string().cuid(),
    }),
    async resolve({ ctx, input }) {
      const userId = ctx.session.user.id;

      const { id, ...company } = await ctx.prisma.company.findFirstOrThrow({
        where: {
          id: input.companyId,
        },
      });

      const createdCompany = await ctx.prisma.company.create({
        data: {
          ...company,
          users: {
            create: {
              userId,
              owner: false,
              type: "OWNED",
            },
          },
        },
      });

      await Promise.all([
        // remove connection with old company
        ctx.prisma.companiesOnUsers.delete({
          where: {
            userId_companyId: {
              companyId: input.companyId,
              userId,
            },
          },
        }),

        // update invoices from old company
        ctx.prisma.invoice.updateMany({
          data: {
            payerId: createdCompany.id,
          },
          where: {
            payerId: input.companyId,
            userId,
          },
        }),
      ]);

      return createdCompany;
    },
  });
