import { format } from "date-fns";
import { ReactNode } from "react";
import { LoaderFunctionArgs } from "react-router";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { Header } from "~/components/Header";
import { HeroIcon } from "~/components/HeroIcon";
import {
  DocumentCheckIcon,
  DocumentIcon,
  DocumentPdfIcon,
  SendIcon,
  TrashIcon,
} from "~/components/Icons";
import { InvoiceStatus } from "~/data/invoice";
import { getDetailedInvoice } from "~/data/invoice.server";
import { requireUser } from "~/services/auth.server";
import { formatCurrency } from "~/utils";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await requireUser(request);

  if (!params.id) {
    throw new Response(null, {
      status: 400,
      statusText: "Missing invoice id",
    });
  }

  const invoice = await getDetailedInvoice(params.id, user.id);

  if (!invoice) {
    throw new Response(null, {
      status: 404,
      statusText: "Invoice não encontrada",
    });
  }

  return typedjson({
    invoice,
  });
}

export default function Page() {
  const { invoice } = useTypedLoaderData<typeof loader>();

  return (
    <>
      <main
        data-theme="light"
        className="max-content flex flex-col gap-5 flex-1 w-full min-h-screen !py-8 !px-6 print:!px-12 "
      >
        <div className="flex gap-4 items-center justify-between">
          <div>
            <h1 className="text-3xl font-black leading-none">
              {invoice.number}
            </h1>
            <h1 className="text-2xl font-bold leading-none text-dim tracking-tight">
              {formatCurrency(invoice.amount, "USD")}
            </h1>
          </div>

          <a href="/">
            <HeroIcon
              icon={() => <DocumentIcon className="icon-3xl" />}
              label="r/invoice"
              className="!mb-0 opacity-50"
            />
          </a>
        </div>

        <div className="divider m-0" />

        <div className="flex justify-between">
          <div>
            <InfoLabel>Issued Date</InfoLabel>
            <InfoValue>{format(invoice.issuedAt, "MMM d, yyy")}</InfoValue>
          </div>

          <div>
            <InfoLabel>Due Date</InfoLabel>
            <InfoValue>{format(invoice.expiredAt, "MMM d, yyy")}</InfoValue>
          </div>
        </div>

        <div>
          <InfoLabel>Description</InfoLabel>
          <InfoValue>{invoice.description}</InfoValue>
        </div>

        <div className="divider mb-0" />

        <div>
          <InfoLabel>Receiver</InfoLabel>
          <InfoValue>{invoice.receiver.name}</InfoValue>
          <div className="h-3" />
          <InfoValue>{invoice.receiver.address}</InfoValue>
        </div>

        <div className="divider" />

        <div>
          <InfoLabel>Payer</InfoLabel>
          <InfoValue>{invoice.payer.name}</InfoValue>
          <div className="h-3" />
          <InfoValue>{invoice.payer.address}</InfoValue>
        </div>

        <footer className="hidden print:flex justify-self-end flex-1 items-end justify-center gap-3 text-dim text-xs">
          <span className="font-bold">ribeirolabs / invoice</span>
          <span>&bull;</span>
          <a href={`/invoice/${invoice.id}`} className="underline">
            {invoice.number}
          </a>
        </footer>
      </main>

      <Header.Actions title="Invoice">
        <li>
          <a
            href={`/invoice/${invoice.id}.pdf`}
            download={`${invoice.number}.pdf`}
          >
            <DocumentPdfIcon /> Baixar
          </a>
        </li>
        <li>
          <button>
            <SendIcon /> Enviar
          </button>
        </li>
        <li>
          <button disabled={invoice.status === InvoiceStatus.PAID}>
            <DocumentCheckIcon /> Concluir
          </button>
        </li>
        <li>
          <button>
            <TrashIcon /> Remover
          </button>
        </li>
      </Header.Actions>
    </>
  );
}

function InfoLabel({ children }: { children: ReactNode }) {
  return <h3 className="text-lg font-black">{children}</h3>;
}

function InfoValue({ children }: { children: ReactNode }) {
  return <p className="text-dim">{children}</p>;
}
