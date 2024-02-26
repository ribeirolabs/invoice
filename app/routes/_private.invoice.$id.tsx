import { ActionFunctionArgs } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { format } from "date-fns";
import ms from "ms";
import { ReactNode, useEffect, useRef, useState } from "react";
import { LoaderFunctionArgs } from "react-router";
import { redirect, typedjson, useTypedLoaderData } from "remix-typedjson";
import { Header } from "~/components/Header";
import {
  CancelIcon,
  CheckCircleIcon,
  DocumentCheckIcon,
  DocumentPdfIcon,
  SendIcon,
  TrashIcon,
} from "~/components/Icons";
import { InvoiceStatus } from "~/data/invoice";
import { fullfillInvoice, getDetailedInvoice } from "~/data/invoice.server";
import { INVOICE_INTENTS } from "~/intents";
import { requireUser } from "~/services/auth.server";
import { cn, formatCurrency } from "~/utils";

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

export async function action({ request, params }: ActionFunctionArgs) {
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

  const data = await request.formData();

  if (data.get("intent") === INVOICE_INTENTS.fullfill) {
    await fullfillInvoice(params.id);

    return redirect(request.headers.get("referrer") ?? "/");
  }

  return typedjson({
    invoice,
  });
}

function EmailToast() {
  const fetcher = useFetcher<
    { success: true } | { success: false; message: string }
  >({
    key: "invoice.send-email",
  });

  const [toast, setToast] = useState<{
    type: "success" | "error" | "neutral";
    timeout?: number;
    content: ReactNode;
  } | null>(null);

  const timeoutHandle = useRef(0);

  useEffect(() => {
    if (fetcher.state === "submitting") {
      setToast({
        type: "neutral",
        content: (
          <>
            <span className="loading" />
            <span>Sending email</span>
          </>
        ),
      });
    }
  }, [fetcher.state]);

  useEffect(() => {
    const data = fetcher.data;

    if (!data) {
      return;
    }

    if (data.success) {
      setToast({
        type: "success",
        timeout: ms("3s"),
        content: (
          <>
            <CheckCircleIcon />
            <span>Email enviado com sucesso</span>
          </>
        ),
      });
    } else {
      setToast({
        type: "error",
        content: (
          <>
            <CancelIcon />
            <span>{data.message}</span>
          </>
        ),
      });
    }
  }, [fetcher.data]);

  useEffect(() => {
    if (timeoutHandle.current) {
      clearTimeout(timeoutHandle.current);
    }

    if (!toast) {
      return;
    }

    if (toast?.timeout) {
      // @ts-ignore
      timeoutHandle.current = setTimeout(() => setToast(null), toast.timeout);
    }
  }, [toast]);

  if (!toast) {
    return null;
  }

  return (
    <div className="toast">
      <div
        onClick={() => setToast(null)}
        className={cn(
          "alert cursor-pointer",
          toast.type === "success"
            ? "alert-success"
            : toast.type === "error"
            ? "alert-error"
            : ""
        )}
      >
        {toast.content}
      </div>
    </div>
  );
}

export default function Page() {
  const { invoice } = useTypedLoaderData<typeof loader>();
  const fetcher = useFetcher({
    key: "invoice.send-email",
  });

  return (
    <>
      <EmailToast />
      <main
        data-theme="light"
        className="max-content flex flex-col gap-5 flex-1 w-full min-h-screen !py-8 !px-6 print:!px-12 "
      >
        <div className="flex gap-4 items-center justify-end">
          <div className="text-end">
            <h1 className="text-3xl font-black leading-none">
              {invoice.number}
            </h1>
            <h1 className="text-2xl font-bold leading-none text-dim tracking-tight">
              {formatCurrency(invoice.amount, "USD")}
            </h1>
          </div>
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
          <button
            disabled={fetcher.state !== "idle"}
            onClick={() =>
              fetcher.submit(
                {},
                {
                  action: `/invoice/${invoice.id}/email`,
                  method: "post",
                }
              )
            }
          >
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
