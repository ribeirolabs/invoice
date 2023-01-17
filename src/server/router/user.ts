import { isBefore } from "date-fns";
import { z } from "zod";
import {
  checkPendingAccountTransfer,
  validateTransferRequest,
} from "../services/account";
import { createProtectedRouter } from "./protected-router";
import { gmail_v1, google } from "googleapis";
import MailComposer from "nodemailer/lib/mail-composer";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { gmail } from "@googleapis/gmail";
import { SendAccountTransfer } from "@/emails/SendAccountTransfer";
import { env } from "@/env/server.mjs";
import { getTransferUrl } from "@/utils/account";

export const userRouter = createProtectedRouter()
  .query("me", {
    async resolve({ ctx }) {
      await checkPendingAccountTransfer(ctx.session.user);

      const user = await ctx.prisma.user.findUniqueOrThrow({
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          createdAt: true,
          timezone: true,
          _count: {
            select: {
              invoices: true,
              companies: true,
            },
          },
        },
        where: {
          id: ctx.session.user.id,
        },
      });

      const pendingTransfer = await ctx.prisma.accountTransfer.findFirst({
        where: {
          acceptedAt: null,
          rejectedAt: null,
          cancelledAt: null,
          OR: [
            {
              toUserId: ctx.session.user.id,
            },
            {
              fromUserId: ctx.session.user.id,
            },
          ],
        },
        select: {
          id: true,
          toUserEmail: true,
          toUser: {
            select: {
              name: true,
              email: true,
            },
          },
          fromUserEmail: true,
          fromUser: {
            select: {
              name: true,
              email: true,
            },
          },
          sentAt: true,
        },
      });

      const isOwner = pendingTransfer?.fromUserEmail === ctx.session.user.email;

      return {
        ...user,
        locked: pendingTransfer !== null && isOwner,
        pendingTransfer: pendingTransfer
          ? {
              ...pendingTransfer,
              isOwner,
            }
          : null,
      };
    },
  })
  .query("account.transfer.getTransferredData", {
    async resolve({ ctx }) {
      return await ctx.prisma.user.findFirst({
        where: {
          id: ctx.session.user.id,
        },
        select: {
          invoices: {
            select: {
              id: true,
              number: true,
            },
          },
          companies: {
            select: {
              userId: true,
              owner: true,
              company: {
                select: {
                  id: true,
                  name: true,
                  alias: true,
                },
              },
            },
          },
        },
      });
    },
  })
  .mutation("account.transfer.request", {
    input: z.object({
      toEmail: z.string().email(),
    }),
    async resolve({ ctx, input }) {
      const toUser = await ctx.prisma.user.findUnique({
        select: {
          id: true,
        },
        where: {
          email: input.toEmail,
        },
      });

      const pending = await ctx.prisma.accountTransfer.findMany({
        where: {
          acceptedAt: null,
          rejectedAt: null,
          cancelledAt: null,
          OR: [
            {
              toUserId: ctx.session.user.id,
            },
            {
              fromUserId: ctx.session.user.id,
            },
          ],
        },
        select: {
          id: true,
        },
      });

      if (pending.length) {
        throw new Error("You have pending transfer requests");
      }

      return await ctx.prisma.$transaction(async (tx) => {
        const transfer = await tx.accountTransfer.create({
          data: {
            fromUserEmail: ctx.session.user.email,
            toUserEmail: input.toEmail,
            fromUserId: ctx.session.user.id,
            toUserId: toUser?.id,
          },
          include: {
            toUser: true,
            fromUser: true,
          },
        });

        const transferUrl = getTransferUrl(transfer.id, ctx.req.headers.host);

        const message = new MailComposer({
          to: input.toEmail,
          from: `Ribeirolabs Invoice <apps@ribeirolabs.com>`,
          subject: "Account Transfer Request",
          html: renderToStaticMarkup(
            createElement(SendAccountTransfer, {
              transfer,
              url: transferUrl.toString(),
            })
          ),
        });

        const buffer = await message.compile().build();

        const key = JSON.parse(`"${env.GOOGLE_PRIVATE_KEY}"`);

        console.log(key);

        const client = new google.auth.GoogleAuth({
          credentials: {
            client_email: env.GOOGLE_CLIENT_EMAIL,
            private_key: key,
          },
          clientOptions: {
            subject: "apps@ribeirolabs.com",
          },
          scopes: ["https://www.googleapis.com/auth/gmail.compose"],
        });

        await gmail("v1")
          .users.messages.send({
            auth: client,
            userId: "me",
            requestBody: {
              raw: buffer.toString("base64"),
            },
          })
          .then((res) => {
            if (res.status > 200) {
              throw new Error(res.statusText);
            }
          });

        return transfer;
      });
    },
  })
  .query("account.transfer.get", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      await checkPendingAccountTransfer(ctx.session.user);

      const transfer = await ctx.prisma.accountTransfer.findFirstOrThrow({
        where: {
          id: input.id,
        },
        include: {
          toUser: {
            select: {
              id: true,
              name: true,
              email: true,
              createdAt: true,
            },
          },
          fromUser: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      const isOwner = transfer.fromUserId === ctx.session.user.id;
      const toAuthor = transfer.fromUser?.name ?? transfer.fromUserEmail;

      const status = transfer.acceptedAt
        ? "accepted"
        : transfer.rejectedAt
        ? "rejected"
        : transfer.cancelledAt
        ? "cancelled"
        : "pending";

      const events: {
        author: string;
        action: string;
        date: Date;
      }[] = [
        {
          author: isOwner ? "You" : toAuthor,
          action: "requested to Transfer Account",
          date: transfer.sentAt,
        },
      ];

      if (
        transfer.toUser &&
        isBefore(transfer.sentAt, transfer.toUser.createdAt)
      ) {
        events.push({
          author: isOwner ? toAuthor : "You",
          action: "created account",
          date: transfer.toUser.createdAt,
        });
      }

      if (transfer.acceptedAt) {
        events.push({
          author: isOwner ? toAuthor : "You",
          action: "accepted the transfer",
          date: transfer.acceptedAt,
        });
      }

      if (transfer.rejectedAt) {
        events.push({
          author: isOwner ? toAuthor : "You",
          action: "rejected the transfer",
          date: transfer.rejectedAt,
        });
      }

      if (transfer.cancelledAt) {
        events.push({
          author: isOwner ? "You" : toAuthor,
          action: "cancelled the transfer",
          date: transfer.cancelledAt,
        });
      }

      return { ...transfer, events: events.reverse(), isOwner, status };
    },
  })
  .query("account.transfer.getPending", {
    async resolve({ ctx }) {
      await checkPendingAccountTransfer(ctx.session.user);

      const request = await ctx.prisma.accountTransfer.findFirst({
        where: {
          acceptedAt: null,
          rejectedAt: null,
          cancelledAt: null,
          OR: [
            {
              toUserId: ctx.session.user.id,
            },
            {
              fromUserId: ctx.session.user.id,
            },
          ],
        },
        select: {
          id: true,
          toUserEmail: true,
          toUser: {
            select: {
              name: true,
              email: true,
            },
          },
          fromUserEmail: true,
          fromUser: {
            select: {
              name: true,
              email: true,
            },
          },
          sentAt: true,
        },
      });

      if (!request) {
        return null;
      }

      return {
        ...request,
        isOwner: request.fromUserEmail === ctx.session.user.email,
      };
    },
  })
  .mutation("account.transfer.cancel", {
    input: z.object({
      id: z.string().cuid(),
    }),
    async resolve({ ctx, input }) {
      await validateTransferRequest(input.id);

      return await ctx.prisma.accountTransfer.update({
        where: {
          id: input.id,
        },
        data: {
          cancelledAt: new Date(),
        },
        select: {
          id: true,
        },
      });
    },
  })
  .mutation("account.transfer.reject", {
    input: z.object({
      id: z.string().cuid(),
    }),
    async resolve({ ctx, input }) {
      await validateTransferRequest(input.id);

      return await ctx.prisma.accountTransfer.update({
        where: {
          id: input.id,
        },
        data: {
          rejectedAt: new Date(),
        },
        select: {
          id: true,
        },
      });
    },
  })
  .mutation("account.transfer.accept", {
    input: z.object({
      id: z.string().cuid(),
    }),
    async resolve({ ctx, input }) {
      const request = await validateTransferRequest(input.id);

      return await ctx.prisma.$transaction(async (tx) => {
        if (!request.fromUserId) {
          throw new Error("Transfer request missing creator");
        }

        if (!request.toUserId) {
          throw new Error("Transfer request missing receipient user");
        }

        await Promise.all([
          tx.companiesOnUsers.updateMany({
            where: {
              userId: request.fromUserId,
            },
            data: {
              userId: request.toUserId,
            },
          }),

          tx.companiesOnUsers.updateMany({
            where: {
              sharedById: request.fromUserId,
            },
            data: {
              sharedById: request.toUserId,
            },
          }),

          tx.invoice.updateMany({
            where: {
              userId: request.fromUserId,
            },
            data: {
              userId: request.toUserId,
            },
          }),
        ]);

        return await tx.accountTransfer.update({
          where: {
            id: input.id,
          },
          data: {
            acceptedAt: new Date(),
          },
          select: {
            id: true,
          },
        });
      });
    },
  })
  .query("account.transfer.htmlForEmail", {
    input: z.object({
      id: z.string().cuid(),
    }),
    async resolve({ ctx, input }) {
      const transfer = await ctx.prisma.accountTransfer.findFirstOrThrow({
        where: {
          id: input.id,
        },
        include: {
          toUser: true,
          fromUser: true,
        },
      });

      const transferUrl = getTransferUrl(transfer.id, ctx.req.headers.host);

      const html = renderToStaticMarkup(
        createElement(SendAccountTransfer, {
          transfer,
          url: transferUrl,
        })
      );

      return html;
    },
  });
