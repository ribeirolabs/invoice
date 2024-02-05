import prisma from "~/services/prisma.server";
import { InvoiceStatus } from "./invoice";
import { Company, Invoice, Prisma } from "@prisma/client";

const FULL_INVOICE: Prisma.InvoiceInclude = {
  payer: true,
  receiver: true,
  _count: {
    select: {
      emailHistory: true,
    },
  },
};

export type InvoiceFull = Invoice & {
  payer: Company;
  receiver: Company;
  status: InvoiceStatus;
  _count: {
    emailHistory: number;
  };
};

export async function getRecentFullfilledInvoices(
  userId: string
): Promise<InvoiceFull[]> {
  const invoices = await prisma.invoice.findMany({
    where: {
      userId,
      NOT: {
        fullfilledAt: null,
      },
    },
    include: FULL_INVOICE,
    take: 10,
    orderBy: {
      createdAt: "desc",
    },
  });

  return invoices.map(addStatus);
}

export async function getPendingInvoices(
  userId: string
): Promise<InvoiceFull[]> {
  const invoices = await prisma.invoice.findMany({
    where: {
      userId,
      fullfilledAt: null,
    },
    include: FULL_INVOICE,
    orderBy: {
      createdAt: "desc",
    },
  });

  return invoices.map(addStatus);
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

export async function getDetailedInvoice(
  id: string,
  userId: string
): Promise<InvoiceFull | null> {
  const invoice = await prisma.invoice.findFirst({
    where: {
      id,
      userId: userId,
    },
    include: FULL_INVOICE,
  });

  if (!invoice) {
    return null;
  }

  return addStatus(invoice);
}
