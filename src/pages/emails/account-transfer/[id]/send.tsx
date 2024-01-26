import { useRenderEmail } from "@/emails/Components";
import { trpc } from "@/utils/trpc";
import { ssp } from "@common/server/ssp";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { ComponentType } from "react";

export const getServerSideProps: GetServerSideProps = (ctx) => {
  return ssp(ctx, () => {
    const id = ctx.params?.id as string | null;

    if (!id) {
      throw new Error("Missing account transfer request");
    }

    return [];
  });
};

export default function Invoice() {
  const router = useRouter();
  const html = trpc.useQuery([
    "user.account.transfer.htmlForEmail",
    { id: router.query.id as string },
  ]);

  return useRenderEmail({
    html: html.data,
    isLoading: html.isLoading,
  }) as unknown as ComponentType;
}

Invoice.disableLayout = true;
