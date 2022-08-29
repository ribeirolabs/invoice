import { parseInvoicePattern } from "@/utils/invoice";
import { z } from "zod";
import { createRouter } from "./context";
import { createProtectedRouter } from "./protected-router";

export const invoicePublicRouter = createRouter().query("get", {
  input: z.object({
    id: z.string().cuid(),
  }),
  async resolve({ ctx, input }) {
    const invoice = await ctx.prisma.invoice.findFirstOrThrow({
      where: {
        id: input.id,
      },
      include: {
        payer: true,
        receiver: true,
      },
    });

    const data = invoice.data as Record<
      "payer" | "receiver",
      {
        name: string;
        address: string;
        currency: string;
      }
    >;

    return {
      ...invoice,
      payer: {
        ...invoice.payer,
        ...(data?.payer ?? {}),
      },
      receiver: {
        ...invoice.receiver,
        ...(data?.receiver ?? {}),
      },
    };
  },
});

export const invoiceRouter = createProtectedRouter()
  .mutation("generate", {
    input: z.object({
      receiverId: z.string().cuid(),
      payerId: z.string().cuid(),
      issuedAt: z.date(),
      expiredAt: z.date(),
      description: z.string(),
      amount: z.number(),
    }),
    async resolve({ input, ctx }) {
      const [payer, receiver, totalInvoices] = await Promise.all([
        ctx.prisma.company.findFirstOrThrow({
          where: {
            id: input.payerId,
          },
        }),

        ctx.prisma.company.findFirstOrThrow({
          where: {
            id: input.receiverId,
          },
        }),

        ctx.prisma.invoice.count({
          where: {
            receiverId: input.receiverId,
            payerId: input.payerId,
          },
        }),
      ]);

      const invoiceNumber = parseInvoicePattern(payer.invoiceNumberPattern, {
        INCREMENT: totalInvoices,
      });

      const response = await ctx.prisma.invoice.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
          number: invoiceNumber,
          currency: payer.currency,
          data: {
            receiver: {
              name: receiver.name,
              address: receiver.address,
              currency: receiver.currency,
            },
            payer: {
              name: payer.name,
              address: payer.address,
              currency: payer.currency,
            },
          },
        },
      });

      return response;
    },
  })
  .mutation("getNumber", {
    input: z.object({
      receiverId: z.string().cuid(),
      payerId: z.string().cuid(),
    }),
    async resolve({ input, ctx }) {
      const [payer, totalInvoices] = await Promise.all([
        ctx.prisma.company.findFirstOrThrow({
          where: {
            id: input.payerId,
          },
        }),

        ctx.prisma.invoice.count({
          where: {
            receiverId: input.receiverId,
            payerId: input.payerId,
          },
        }),
      ]);

      const invoiceNumber = parseInvoicePattern(payer.invoiceNumberPattern, {
        INCREMENT: totalInvoices,
      });

      return invoiceNumber;
    },
  })
  .query("latestFromPayer", {
    input: z.object({
      payer_id: z.string().cuid().nullish(),
    }),
    async resolve({ ctx, input }) {
      if (!input.payer_id) {
        return null;
      }

      return ctx.prisma.invoice.findFirst({
        where: {
          payerId: input.payer_id,
          userId: ctx.session.user.id,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    },
  })
  .query("recent", {
    async resolve({ ctx }) {
      return ctx.prisma.invoice.findMany({
        where: {
          userId: ctx.session.user.id,
        },
        include: {
          payer: true,
          receiver: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      });
    },
  })
  .query("countByCompany", {
    async resolve({ ctx }) {
      return ctx.prisma.$queryRaw<
        {
          payerId: string;
          receiverId: string;
          count: bigint;
        }[]
      >`
      SELECT payerId, NULL AS receiverId, COUNT(payerId) AS count FROM Invoice
      WHERE userId = ${ctx.session.user.id}
      GROUP BY payerId

      UNION ALL

      SELECT NULL AS payerId, receiverId, COUNT(receiverId) AS count FROM Invoice
      WHERE userId = ${ctx.session.user.id}
      GROUP BY receiverId
      `;
    },
  })
  .query("getIssuedCount", {
    input: z.object({
      companyId: z.string().cuid(),
    }),
    async resolve({ ctx, input }) {
      return ctx.prisma.invoice.count({
        where: {
          userId: ctx.session.user.id,
          issuedAt: {
            lt: new Date(),
          },
          OR: [
            {
              payerId: input.companyId,
            },
            {
              receiverId: input.companyId,
            },
          ],
        },
      });
    },
  });
