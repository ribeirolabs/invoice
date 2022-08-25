import { parseInvoicePattern } from "@/utils/invoice";
import { z } from "zod";
import { createRouter } from "./context";
import { createProtectedRouter } from "./protected-router";

export const invoicePublicRouter = createRouter().query("get", {
  input: z.object({
    id: z.string().cuid(),
  }),
  async resolve({ ctx, input }) {
    return ctx.prisma.invoice.findFirstOrThrow({
      where: {
        id: input.id,
      },
      include: {
        payer: true,
        receiver: true,
      },
    });
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
      const payer = await ctx.prisma.company.findFirstOrThrow({
        where: {
          id: input.payerId,
        },
      });

      const invoiceNumber = parseInvoicePattern(payer.invoiceNumberPattern, {
        INCREMENT: payer.invoiceNumberCount,
      });

      const response = await ctx.prisma.invoice.create({
        data: {
          ...input,
          number: invoiceNumber,
          currency: payer.currency,
        },
      });

      await ctx.prisma.company.update({
        data: {
          invoiceNumberCount: payer.invoiceNumberCount + 1,
        },
        where: {
          id: payer.id,
        },
      });

      return response;
    },
  })
  .mutation("get-number", {
    input: z.object({
      company_id: z.string().cuid(),
    }),
    async resolve({ input, ctx }) {
      const company = await ctx.prisma.company.findFirstOrThrow({
        where: {
          id: input.company_id,
        },
      });

      const invoiceNumber = parseInvoicePattern(company.invoiceNumberPattern, {
        INCREMENT: company.invoiceNumberCount,
      });

      return invoiceNumber;
    },
  })
  .query("latestFromPayer", {
    input: z.object({
      payer_id: z.string().cuid(),
    }),
    async resolve({ ctx, input }) {
      return ctx.prisma.invoice.findFirst({
        where: {
          payerId: input.payer_id,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    },
  });
