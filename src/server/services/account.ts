import { prisma } from "@/server/db/client";

export async function checkPendingAccountTransfer({
  id,
  email,
}: {
  id: string;
  email: string;
}) {
  const hasToUpdate = await prisma.accountTransfer.findMany({
    select: {
      id: true,
    },
    where: {
      toUser: null,
      toUserEmail: email,
    },
  });

  if (hasToUpdate.length) {
    await prisma.accountTransfer.updateMany({
      where: {
        id: {
          in: hasToUpdate.map(({ id }) => id),
        },
      },
      data: {
        toUserId: id,
      },
    });
  }
}
