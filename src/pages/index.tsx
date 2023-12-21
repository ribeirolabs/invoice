import { CompaniesTable } from "@/components/CompaniesTable";
import { InvoicesTable } from "@/components/InvoicesTable";
import { ProtectedPage } from "@common/components/ProtectedPage";
import { addToast } from "@common/components/Toast";
import { ssp } from "@common/server/ssp";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const getServerSideProps: GetServerSideProps = (ctx) => {
  return ssp(ctx, (ssr) => {
    return [
      // ssr.fetchQuery("company.getAll"),
      // ssr.fetchQuery("invoice.countByCompany"),
      ssr.fetchQuery("invoice.recent"),
    ];
  });
};

const Home: NextPage = () => {
  return (
    <ProtectedPage>
      <CompanyShareNotification />
      <InvoicesTable />
      <div className="my-12"></div>
      {/*      <CompaniesTable /> */}
    </ProtectedPage>
  );
};

function CompanyShareNotification() {
  const router = useRouter();
  const shareState = router.query.company_share as "error" | undefined;

  useEffect(() => {
    if (shareState === "error") {
      requestAnimationFrame(() => {
        addToast("Unable to receive company", "error", "company-share");
        router.replace("/");
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shareState]);

  return null;
}

export default Home;
