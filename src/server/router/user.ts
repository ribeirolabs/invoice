import { createProtectedRouter } from "./protected-router";

export const userRouter = createProtectedRouter().query("me", {
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
});
