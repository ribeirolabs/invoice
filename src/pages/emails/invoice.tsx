import { InvoiceEmail } from "@/emails/Invoice";
import { trpc } from "@/utils/trpc";
import { ssp } from "@common/server/ssp";
import { GetServerSideProps } from "next";
import { useEffect, useRef } from "react";

export const getServerSideProps: GetServerSideProps = (ctx) => {
  return ssp(ctx, (ssr) => {
    return [
      ssr.fetchQuery("invoice.htmlForEmail", {
        id: "clcik57gc0014i0dv6jv4lh2e",
      }),
    ];
  });
};

export default function Invoice() {
  const html = trpc.useQuery([
    "invoice.htmlForEmail",
    { id: "clcik57gc0014i0dv6jv4lh2e" },
  ]);
  const ref = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (!html.data) {
      return;
    }

    const doc = ref.current?.contentDocument;

    if (!doc) {
      return;
    }

    const htmlElement = document.body.parentElement;

    if (htmlElement) {
      htmlElement.dataset.theme = "light";
    }

    doc.open();
    doc.write(html.data);
    doc.close();

    return () => {
      if (htmlElement) {
        htmlElement.dataset.theme = "dark";
      }
    };
  }, [html.data]);

  if (html.isLoading) {
    return <p>Loading...</p>;
  }

  if (html.data == null) {
    return <p>No invoice</p>;
  }

  return <iframe ref={ref} className="w-screen h-screen" />;
}

Invoice.disableLayout = true;
