import { isBefore } from "date-fns";
import { z } from "zod";
import { createProtectedRouter } from "./protected-router";

export const userRouter = createProtectedRouter()
  .query("me", {
    async resolve({ ctx }) {
      return await ctx.prisma.user.findUniqueOrThrow({
        select: {
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
    },
  })
  .query("getAccountTransferData", {
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
  .mutation("requestAccountTransfer", {
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
  .query("getAccountTransfer", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const hasToUpdate = await ctx.prisma.accountTransfer.findFirst({
        where: {
          id: input.id,
          toUser: null,
          toUserEmail: ctx.session.user.email,
        },
      });

      if (hasToUpdate) {
        await ctx.prisma.accountTransfer.update({
          where: {
            id: hasToUpdate.id,
          },
          data: {
            toUserId: ctx.session.user.id,
          },
        });
      }

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

      const isRequester = transfer.fromUserId === ctx.session.user.id;
      const toAuthor = transfer.fromUser?.name ?? transfer.fromUserEmail;

      const events: {
        author: string;
        action: string;
        date: Date;
      }[] = [
        {
          author: isRequester ? "You" : toAuthor,
          action: "requested to Transfer Account",
          date: transfer.sentAt,
        },
      ];

      if (
        transfer.toUser &&
        isBefore(transfer.sentAt, transfer.toUser.createdAt)
      ) {
        events.push({
          author: !isRequester ? "You" : toAuthor,
          action: "created account",
          date: transfer.toUser.createdAt,
        });
      }

      return { ...transfer, events: events.reverse(), isRequester };
    },
  });
