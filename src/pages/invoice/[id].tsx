import parse from "html-react-parser";
import { ssp } from "@common/server/ssp";
import { formatCurrency } from "@/utils/currency";
import { noSSR } from "@/utils/no-ssr";
import { trpc } from "@/utils/trpc";
import format from "date-fns/format";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Senstive } from "@/components/Sensitive";
import { ProtectedPage } from "@common/components/ProtectedPage";
import { dispatchCustomEvent } from "@ribeirolabs/events";
import dynamic from "next/dynamic";
import { Portal } from "@common/components/Portal";
import { getSendInvoiceModalId } from "@/components/Modal/SendInvoiceModal";
import { DeleteIcon, DownloadIcon, SendIcon } from "@common/components/Icons";
import { openModal } from "@common/components/Modal";
import { nlToBr } from "@common/utils/nl-to-br";
import { getInvoiceFilename } from "@/utils/invoice";
import { getDeleteInvoiceModalId } from "@/components/Modal/DeleteInvoiceModal";
import { UserUnlocked } from "@/components/UserUnlocked";

const SendInvoiceModal = dynamic(
  () => import("@/components/Modal/SendInvoiceModal")
);

const DeleteInvoiceModal = dynamic(
  () => import("@/components/Modal/DeleteInvoiceModal")
);

export const getServerSideProps: GetServerSideProps = (ctx) => {
  return ssp(ctx, () => []);
};

const InvoicePage: NextPage = () => {
  return (
    <ProtectedPage>
      <InvoicePrint />
    </ProtectedPage>
  );
};

const InvoicePrint = () => {
  const router = useRouter();
  const invoice = trpc.useQuery([
    "invoice.get",
    { id: router.query.id as string },
  ]);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const html = document.body.parentElement;

    if (!html) {
      return;
    }

    window.onbeforeprint = () => {
      html.dataset.theme = "light";
    };

    window.onafterprint = () => {
      html.dataset.theme = "dark";
    };
  }, []);

  const amount = useMemo(() => {
    const { amount, payer } = invoice.data ?? {};

    if (amount == null || payer == null) {
      return "";
    }

    return formatCurrency(amount, payer.currency);
  }, [invoice.data]);

  async function onExport() {
    if (invoice.data == null) {
      return null;
    }

    try {
      setExporting(true);

      const response = await fetch("/api/pdf", {
        method: "post",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/pdf",
        },
        body: JSON.stringify({
          id: invoice.data.id,
        }),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const file = await response.arrayBuffer();

      const blob = new Blob([file], { type: "application/pdf" });
      const a = document.createElement("a");
      a.href = window.URL.createObjectURL(blob);
      a.download = getInvoiceFilename(invoice.data);
      a.click();
    } catch (e) {
      console.error(e);
      dispatchCustomEvent("toast", {
        type: "error",
        message: "Unable to export invoice",
      });
    } finally {
      setExporting(false);
    }
  }

  if (invoice.data == null) {
    return null;
  }

  return (
    <div className="invoice-print flex flex-col h-full">
      <Head>
        <title>{invoice.data.number}</title>
      </Head>

      <Portal id="sidebar-menu">
        <li>
          <button onClick={onExport} disabled={exporting}>
            {exporting ? (
              <div
                className="btn btn-ghost btn-only-loader w-[1em] h-[1em] min-h-[1em] p-0"
                data-loading
              ></div>
            ) : (
              <DownloadIcon />
            )}
            Export PDF
          </button>
        </li>
        <UserUnlocked>
          <li>
            <button
              onClick={() => openModal(getSendInvoiceModalId(invoice.data.id))}
              disabled={!!invoice.data.fullfilledAt}
            >
              <SendIcon />
              Send Email
            </button>
          </li>
          <li>
            <button
              onClick={() =>
                openModal(getDeleteInvoiceModalId(invoice.data.id))
              }
            >
              <DeleteIcon />
              Delete Invoice
            </button>
          </li>
        </UserUnlocked>
      </Portal>

      <div>
        <div className="flex flex-wrap justify-between mb-8 gap-4">
          <h2 className="flex-none inline-block">{invoice.data.number}</h2>
          <h2>
            <Senstive>
              <Amount amount={amount} />
            </Senstive>
          </h2>
        </div>

        <div className="invoice-divider"></div>

        <div className="invoice-section">
          <div className="flex justify-between mb-4">
            <div>
              <h3>Issued</h3>
              <p className="m-0">
                {format(invoice.data.issuedAt, "MMM d, YYY")}
              </p>
            </div>

            <div>
              <h3>Due Date</h3>
              <p className="m-0">
                {format(invoice.data.expiredAt, "MMM d, YYY")}
              </p>
            </div>

            <div className="w-fit hidden">
              <h3>Amount</h3>
              <p className="m-0 text-end">
                <Amount amount={amount} />
              </p>
            </div>
          </div>

          <div>
            <h3>Description</h3>
            <p>{parse(nlToBr(invoice.data.description))}</p>
          </div>
        </div>

        <div className="invoice-divider"></div>

        <div className="invoice-section">
          <h3>Receiver</h3>
          <p className="font-bold">{invoice.data.receiver.name}</p>
          <p>{invoice.data.receiver.address}</p>
        </div>

        <div className="invoice-divider"></div>

        <div className="invoice-section">
          <h3>Bill to</h3>
          <p className="font-bold">{invoice.data.payer.name}</p>
          <p>{invoice.data.payer.address}</p>
        </div>
      </div>

      <footer className="font-brand flex-1 flex items-end justify-center text-xs">
        <Link href="/" target="_blank">
          ribeirolabs/invoice
        </Link>

        <span className="mx-4">|</span>

        <Link target="_blank" href={`/invoice/${invoice.data.id}`}>
          {invoice.data.id}
        </Link>
      </footer>

      <SendInvoiceModal invoice={invoice.data} />
      <DeleteInvoiceModal invoice={invoice.data} />
    </div>
  );
};

const Amount = noSSR<{ amount: string }>(({ amount }) => <span>{amount}</span>);

export default InvoicePage;
