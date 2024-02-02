import prisma from "~/services/prisma.server";
import { InvoiceStatus } from "./invoice";
import { Invoice } from "@prisma/client";

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

function addStatus(invoice: Omit<InvoiceFull, "status">): InvoiceFull {
  const status = invoice.fullfilledAt
    ? InvoiceStatus.PAID
    : invoice._count.emailHistory > 0
    ? InvoiceStatus.SENT
    : InvoiceStatus.CREATED;

  return {
    ...invoice,
    status,
  };
}

export async function getRecentInvoicesGrouped(userId: string) {
  const invoices = await getRecentInvoices(userId);

  const pending: InvoiceFull[] = [];
  const fullfilled: InvoiceFull[] = [];

  for (const invoice of invoices) {
    const transformed = addStatus(invoice);

    if (invoice.fullfilledAt) {
      fullfilled.push(transformed);
    } else {
      pending.push(transformed);
    }
  }

  return {
    pending,
    fullfilled,
  };
}

export async function getDetailedInvoice(
  id: string,
  userId: string
): Promise<InvoiceFull | null> {
  const invoice = await prisma.invoice.findFirst({
    where: {
      id,
      userId: userId,
    },
    include: {
      receiver: true,
      payer: true,
      _count: {
        select: {
          emailHistory: true,
        },
      },
    },
  });

  if (!invoice) {
    return null;
  }

  return addStatus(invoice);
}
