import { isBefore } from "date-fns";
import { z } from "zod";
import {
  checkPendingAccountTransfer,
  validateTransferRequest,
} from "../services/account";
import { createProtectedRouter } from "./protected-router";

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

      // @todo: send email

      return await ctx.prisma.accountTransfer.create({
        data: {
          fromUserEmail: ctx.session.user.email,
          toUserEmail: input.toEmail,
          fromUserId: ctx.session.user.id,
          toUserId: toUser?.id,
        },
        select: {
          toUserEmail: true,
          toUser: {
            select: {
              id: true,
            },
          },
          fromUserEmail: true,
          fromUser: {
            select: {
              id: true,
            },
          },
        },
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
  });
