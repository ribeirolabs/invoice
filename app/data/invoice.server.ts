import prisma from "~/services/prisma.server";
import { InvoiceStatus, parseInvoicePattern } from "./invoice";
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

export async function getLatestInvoiceFromCompanies(
  receiverId: string,
  payerId: string
) {
  return prisma.invoice.findFirst({
    select: {
      id: true,
      amount: true,
      description: true,
      currency: true,
    },
    where: {
      payerId,
      receiverId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function generateInvoice({
  userId,
  payerId,
  receiverId,
  issueDate,
  dueDate,
  description,
  amount,
}: {
  userId: string;
  payerId: string;
  receiverId: string;
  issueDate: string;
  dueDate: string;
  description: string;
  amount: number;
}) {
  const [payer, receiver, totalInvoices] = await Promise.all([
    prisma.company.findFirstOrThrow({
      where: {
        id: payerId,
      },
    }),

    prisma.company.findFirstOrThrow({
      where: {
        id: receiverId,
      },
    }),

    prisma.invoice.count({
      where: {
        receiverId,
        payerId,
      },
    }),
  ]);

  const invoiceNumber = parseInvoicePattern(payer.invoiceNumberPattern, {
    INCREMENT: totalInvoices,
  });

  const time = new Date().toTimeString();

  const response = await prisma.invoice.create({
    data: {
      userId,
      payerId,
      receiverId,
      number: invoiceNumber,
      currency: payer.currency,
      issuedAt: new Date(`${issueDate} ${time}`),
      expiredAt: new Date(`${dueDate} ${time}`),
      description,
      amount,
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
}

export async function fullfillInvoice(invoiceId: string): Promise<void> {
  await prisma.invoice.update({
    data: {
      fullfilledAt: new Date(),
    },
    where: {
      id: invoiceId,
    },
  });
}
