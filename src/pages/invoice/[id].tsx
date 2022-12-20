import { ssp } from "@common/server/ssp";
import { formatCurrency } from "@/utils/currency";
import { noSSR } from "@/utils/no-ssr";
import { trpc } from "@/utils/trpc";
import format from "date-fns/format";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo } from "react";
import Link from "next/link";
import { Senstive } from "@/components/Sensitive";
import { ProtectedPage } from "@common/components/ProtectedPage";
import { useEvent } from "@ribeirolabs/events/react";
import { dispatchCustomEvent } from "@ribeirolabs/events";
import { ErrorBoundary } from "react-error-boundary";

export const getServerSideProps: GetServerSideProps = (ctx) => {
  return ssp(ctx, (ssr) => {
    return ssr.fetchQuery("invoice.get", {
      id: ctx.params?.id as string,
    });
  });
};

const ErrorFallback = ({ error }: { error: Error }) => (
  <>
    <h1>Something went wrong</h1>
    <pre>{error.stack}</pre>
  </>
);

const InvoicePage: NextPage = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ProtectedPage>
        <InvoicePrint />
      </ProtectedPage>
    </ErrorBoundary>
  );
};

const InvoicePrint = () => {
  const router = useRouter();
  const invoice = trpc.useQuery([
    "invoice.get",
    { id: router.query.id as string },
  ]);
  const { mutateAsync } = trpc.useMutation(["invoice.send"]);

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

  useEvent(
    "export-invoice",
    useCallback(
      async ({ detail }) => {
        if (invoice.data == null) {
          return null;
        }

        try {
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
          a.download = `${invoice.data.number}.pdf`;
          a.click();
        } catch (e) {
          console.error(e);
          dispatchCustomEvent("toast", {
            type: "error",
            message: "Unable to export invoice",
          });
        } finally {
          if (detail.onDone) {
            detail.onDone();
          }
        }
      },
      [invoice.data]
    )
  );

  useEvent(
    "send-invoice",
    useCallback(
      ({ detail }) => {
        if (!invoice.data) {
          return;
        }

        mutateAsync({
          id: invoice.data.id,
        }).finally(() => detail.onDone?.());
      },
      [invoice.data, mutateAsync]
    )
  );

  if (invoice.data == null) {
    return null;
  }

  return (
    <div className="invoice-print flex flex-col h-full">
      <Head>
        <title>{invoice.data.number}</title>
      </Head>
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
              <h3>Date</h3>
              <p className="m-0">
                {format(invoice.data.issuedAt, "yyyy/MM/dd")}
              </p>
            </div>

            <div>
              <h3>Due Date</h3>
              <p className="m-0">
                {format(invoice.data.expiredAt, "yyyy/MM/dd")}
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
            <p>{invoice.data.description}</p>
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
    </div>
  );
};

const Amount = noSSR<{ amount: string }>(({ amount }) => <span>{amount}</span>);

export default InvoicePage;

export const config = {
  unstable_excludeFiles: ["public/**/*"],
};
