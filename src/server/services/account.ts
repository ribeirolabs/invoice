import { prisma } from "@/server/db/client";
import { AccountTransfer } from "@prisma/client";

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

export async function validateTransferRequest(id: string) {
  const transfer = await prisma.accountTransfer.findUniqueOrThrow({
    where: {
      id,
    },
    select: {
      acceptedAt: true,
      rejectedAt: true,
      cancelledAt: true,
    },
  });

  if (transfer.acceptedAt) {
    throw new Error("Transfer request already accepted");
  }

  if (transfer.rejectedAt) {
    throw new Error("Transfer request already rejected");
  }

  if (transfer.cancelledAt) {
    throw new Error("Transfer request already cancelled");
  }

  return true;
}
