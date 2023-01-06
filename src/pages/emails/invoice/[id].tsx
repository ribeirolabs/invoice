import { trpc } from "@/utils/trpc";
import { ssp } from "@common/server/ssp";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

export const getServerSideProps: GetServerSideProps = (ctx) => {
  return ssp(ctx, (ssr) => {
    const id = ctx.params?.id as string | null;
    if (!id) {
      throw new Error("Missing invoice id");
    }
    return [
      ssr.fetchQuery("invoice.htmlForEmail", {
        id,
      }),
    ];
  });
};

export default function Invoice() {
  const router = useRouter();
  const html = trpc.useQuery([
    "invoice.htmlForEmail",
    { id: router.query.id as string },
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
