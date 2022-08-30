import { ssp } from "@common/server/ssp";
import { formatCurrency } from "@/utils/currency";
import { noSSR } from "@/utils/no-ssr";
import { trpc } from "@/utils/trpc";
import format from "date-fns/format";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";
import Link from "next/link";

export const getServerSideProps: GetServerSideProps = (ctx) => {
  return ssp(ctx, (ssr) => {
    return ssr.prefetchQuery("invoice.public.get", {
      id: ctx.params?.id as string,
    });
  });
};

const InvoicePage: NextPage = () => {
  const router = useRouter();
  const invoice = trpc.useQuery([
    "invoice.public.get",
    { id: router.query.id as string },
  ]);

  useEffect(() => {
    const html = document.body.parentElement;

    if (!html) {
      return;
    }

    window.onbeforeprint = () => {
      html.dataset.theme = "light";
    };

    return () => {
      window.onafterprint = () => {
        html.dataset.theme = "dark";
      };
    };
  }, []);

  const amount = useMemo(() => {
    const { amount, payer } = invoice.data ?? {};

    if (amount == null || payer == null) {
      return "";
    }

    return formatCurrency(amount, payer.currency);
  }, [invoice.data]);

  if (invoice.data == null) {
    return null;
  }

  return (
    <div className="invoice-print p-4 flex flex-col h-screen">
      <Head>
        <title>{invoice.data.number}</title>
      </Head>
      <div>
        <div className="flex justify-between mb-8 gap-4">
          <h2 className="flex-none inline-block">{invoice.data.number}</h2>
          <h2>
            <Amount amount={amount} />
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

      <footer className="flex-1 flex items-end justify-center text-xs">
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
