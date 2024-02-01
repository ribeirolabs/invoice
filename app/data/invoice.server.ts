import prisma from "~/services/prisma.server";
import { InvoiceStatus } from "./invoice";

export type InvoiceFull = Awaited<
  ReturnType<typeof getRecentInvoices>
>[number] & {
  status: InvoiceStatus;
};

export async function getRecentInvoices(userId: string) {
  return prisma.invoice.findMany({
    where: {
      userId,
    },
    include: {
      payer: true,
      receiver: true,
      _count: {
        select: {
          emailHistory: true,
        },
      },
    },
    take: 10,
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getRecentInvoicesGrouped(userId: string) {
  const invoices = await getRecentInvoices(userId);

  const pending: InvoiceFull[] = [];
  const fullfilled: InvoiceFull[] = [];

  for (const invoice of invoices) {
    if (invoice.fullfilledAt) {
      fullfilled.push({ ...invoice, status: InvoiceStatus.PAID });
    } else {
      pending.push({
        ...invoice,
        id: "FAKE_ID",
        status: InvoiceStatus.CREATED,
        receiver: invoice.payer,
        payer: invoice.receiver,
      });
      pending.push({
        ...invoice,
        status:
          invoice._count.emailHistory > 0
            ? InvoiceStatus.SENT
            : InvoiceStatus.CREATED,
      });
    }
  }

  return {
    pending,
    fullfilled,
  };
}
