import { InvoiceEmail } from "@/emails/Invoice";
import {
  getInvoiceFilename,
  InvoiceStatus,
  parseInvoicePattern,
} from "@/utils/invoice";
import { refreshAccessToken } from "@common/server/refresh-access-token";
import { gmail } from "@googleapis/gmail";
import { TRPCError } from "@trpc/server";
import fromUnixTime from "date-fns/fromUnixTime";
import isAfter from "date-fns/isAfter";
import isBefore from "date-fns/isBefore";
import { gmail_v1 } from "googleapis";
import MailComposer from "nodemailer/lib/mail-composer";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { z } from "zod";
import { sendInvoiceEmail } from "../services/email";
import { generatePdf } from "../services/pdf";
import { createProtectedRouter } from "./protected-router";

export const invoiceRouter = createProtectedRouter()
  .query("get", {
    input: z.object({
      id: z.string().cuid(),
    }),
    async resolve({ ctx, input }) {
      const invoice = await ctx.prisma.invoice.findFirst({
        where: {
          id: input.id,
        },
        include: {
          payer: true,
          receiver: true,
        },
      });

      if (invoice == null) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (invoice.userId !== ctx.session.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

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
  })
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
      const invoices = await ctx.prisma.invoice.findMany({
        where: {
          userId: ctx.session.user.id,
        },
        include: {
          payer: true,
          receiver: true,
          _count: {
            select: { emailHistory: true },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      });

      return invoices.map((invoice) => {
        const status: InvoiceStatus = invoice.fullfilledAt
          ? "fullfilled"
          : isAfter(new Date(), invoice.expiredAt)
          ? "overdue"
          : invoice._count.emailHistory > 0
          ? "sent"
          : "created";

        return {
          ...invoice,
          status,
        };
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
          amount: bigint;
        }[]
      >`
      SELECT payerId, NULL AS receiverId, COUNT(payerId) AS count, SUM(amount) as amount FROM Invoice
      WHERE userId = ${ctx.session.user.id}
      GROUP BY payerId

      UNION ALL

      SELECT NULL AS payerId, receiverId, COUNT(receiverId) AS count, SUM(amount) as amount FROM Invoice
      WHERE userId = ${ctx.session.user.id}
      GROUP BY receiverId
      `;
    },
  })
  .mutation("delete", {
    input: z.string().cuid(),
    resolve({ ctx, input }) {
      return ctx.prisma.invoice.delete({
        where: {
          id: input,
        },
      });
    },
  })
  .mutation("send.old", {
    input: z.object({
      id: z.string().cuid(),
    }),
    async resolve({ ctx, input }) {
      const invoice = await ctx.prisma.invoice.findUniqueOrThrow({
        where: { id: input.id },
        include: {
          receiver: {
            select: {
              name: true,
              email: true,
            },
          },
          payer: {
            select: {
              name: true,
              email: true,
              currency: true,
            },
          },
        },
      });

      await sendInvoiceEmail({ invoice, req: ctx.req });

      return await ctx.prisma.invoiceEmailHistory.create({
        data: {
          provider: "mailgun",
          invoiceId: input.id,
          email: invoice.payer.email,
        },
      });
    },
  })
  .mutation("send", {
    input: z.object({
      id: z.string().cuid(),
    }),
    async resolve({ ctx, input }) {
      const [invoice, account] = await Promise.all([
        ctx.prisma.invoice.findUniqueOrThrow({
          where: { id: input.id },
          select: {
            number: true,
            issuedAt: true,
            expiredAt: true,
            description: true,
            receiver: {
              select: {
                name: true,
                email: true,
              },
            },
            payer: {
              select: {
                name: true,
                email: true,
                currency: true,
              },
            },
            user: {
              select: {
                timezone: true,
              },
            },
          },
        }),

        ctx.prisma.account.findFirstOrThrow({
          where: {
            userId: ctx.session.user.id,
          },
          select: {
            id: true,
            providerAccountId: true,
            access_token: true,
            refresh_token: true,
            expires_at: true,
          },
        }),
      ]);

      let { access_token, refresh_token, expires_at } = account;

      if (access_token == null) {
        throw new Error("Account missing access_token");
      }

      if (!ctx.req.headers.origin) {
        throw new Error(
          'Unable to generate PDF, missing "origin" from request'
        );
      }

      const pdf = await generatePdf({
        id: input.id,
        domain: ctx.req.headers.origin,
        cookies: ctx.req.cookies,
      });

      const message = new MailComposer({
        to: invoice.payer.email,
        from: `${invoice.receiver.name} <${ctx.session.user.email}>`,
        subject: `Invoice from: ${invoice.receiver.name}`,
        html: renderToStaticMarkup(
          createElement(InvoiceEmail, {
            invoice,
          })
        ),
        attachments: [
          {
            filename: getInvoiceFilename(invoice),
            content: pdf,
          },
        ],
      });

      const buffer = await message.compile().build();

      if (expires_at && refresh_token) {
        if (isBefore(fromUnixTime(Number(expires_at)), new Date())) {
          const response = await refreshAccessToken(refresh_token);

          access_token = response.access_token;
          refresh_token = response.refresh_token;
          expires_at = BigInt(response.expires_at);

          await ctx.prisma.account.update({
            where: {
              id: account.id,
            },
            data: response,
          });
        }
      }

      const response = await new Promise<gmail_v1.Schema$Message>(
        (resolve, reject) => {
          gmail("v1")
            .users.messages.send({
              access_token: access_token,
              userId: account.providerAccountId,
              requestBody: {
                raw: buffer.toString("base64"),
              },
            })
            .then((res) => {
              if (res.status > 200) {
                reject(res.statusText);
                return;
              }

              resolve(res.data);
            })
            .catch(reject);
        }
      );

      return await ctx.prisma.invoiceEmailHistory.create({
        data: {
          invoiceId: input.id,
          provider: "gmail",
          email: invoice.payer.email,
          data: {
            id: response.id,
            threadId: response.threadId,
            date: response.internalDate,
            historyId: response.historyId,
            from: ctx.session.user.email,
          },
        },
      });
    },
  })
  .query("emailHistory", {
    input: z.object({
      id: z.string().cuid(),
    }),
    resolve({ ctx, input }) {
      return ctx.prisma.invoiceEmailHistory.findMany({
        where: {
          invoiceId: input.id,
        },
      });
    },
  })
  .mutation("fullfill", {
    input: z.string().cuid(),
    resolve({ ctx, input }) {
      return ctx.prisma.invoice.update({
        data: {
          fullfilledAt: new Date(),
        },
        where: {
          id: input,
        },
      });
    },
  })
  .query("htmlForEmail", {
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
          user: {
            select: {
              timezone: true,
            },
          },
        },
      });

      const html = renderToStaticMarkup(
        createElement(InvoiceEmail, { invoice })
      );

      return html;
    },
  });
