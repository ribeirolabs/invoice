import { ssp } from "@/server/ssp";
import { trpc } from "@/utils/trpc";
import format from "date-fns/format";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";

export const getServerSideProps: GetServerSideProps = (ctx) => {
  return ssp(ctx, (ssr) => {
    return ssr.fetchQuery("invoice.public.get", {
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
    const { amount } = invoice.data ?? {};

    if (amount == null) {
      return "";
    }

    return new Intl.NumberFormat("en-US", {
      currency: "USD",
    }).format(amount);
  }, [invoice.data]);

  if (invoice.data == null) {
    return null;
  }

  return (
    <div className="p-4 flex flex-col h-screen">
      <Head>
        <title>{invoice.data.number}</title>
      </Head>
      <div>
        <div className="flex justify-between mb-4">
          <h2 className="m-0">Invoice </h2>
          <h2 className="m-0">{invoice.data.number}</h2>
        </div>

        <div className="divider mb-0"></div>

        <div className="flex justify-between">
          <div>
            <h3>Date</h3>
            <p className="m-0">{format(invoice.data.issuedAt, "yyyy/MM/dd")}</p>
          </div>

          <div>
            <h3>Due Date</h3>
            <p className="m-0">
              {format(invoice.data.expiredAt, "yyyy/MM/dd")}
            </p>
          </div>

          <div>
            <h3>Amount</h3>
            <p className="text-end">${amount}</p>
          </div>
        </div>

        <div className="flex justify-between">
          <div>
            <h3>Description</h3>
            <p>{invoice.data.description}</p>
          </div>
        </div>

        <div className="divider mb-0"></div>

        <h3>Receiver</h3>
        <p className="font-bold">{invoice.data.receiver.name}</p>
        <p>{invoice.data.receiver.address}</p>

        <div className="divider mb-0"></div>

        <h3>Bill to</h3>
        <p className="font-bold">{invoice.data.payer.name}</p>
        <p>{invoice.data.payer.address}</p>

        <div className="divider mb-0"></div>
      </div>

      <footer className="flex-1 flex items-end justify-center">
        <p className="text-xs">@ribeirolabs / invoice - {invoice.data.id}</p>
      </footer>
    </div>
  );
};

export default InvoicePage;
