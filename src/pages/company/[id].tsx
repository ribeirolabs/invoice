import { Header } from "@/components/Header";
import { Input } from "@/components/Input";
import { ProtectedPage } from "@/components/ProtectedPage";
import { ssp } from "@/server/ssp";
import { trpc } from "@/utils/trpc";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { FormEvent } from "react";

export const getServerSideProps: GetServerSideProps = (ctx) => {
  console.log("serversideprops", ctx.params);

  return ssp(ctx, (ssr) => {
    if (ctx.params?.id && ctx.params.id !== "new") {
      return ssr.fetchQuery("company.get", {
        id: ctx.params.id as string,
      });
    }

    return Promise.resolve();
  });
};

const NewCompanyPage: NextPage = () => {
  const router = useRouter();
  const createCompany = trpc.useMutation(["company.upsert"]);
  const company = trpc.useQuery([
    "company.get",
    {
      id: router.query.id as string,
    },
  ]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.target as HTMLFormElement;

    const data = new FormData(form);

    try {
      const response = await createCompany.mutateAsync({
        id: data.get("id") as string,
        name: data.get("name") as string,
        address: data.get("address") as string,
        invoiceNumberPattern: data.get("invoice_number_pattern") as string,
      });

      if (company.data?.id) {
        company.refetch();
      } else {
        form.reset();
      }
    } catch (e) {}
  }

  return (
    <ProtectedPage>
      <Header />
      <main className="p-4">
        <h1>{company.data ? company.data.name : "New Company"}</h1>

        <form className="form max-w-lg" onSubmit={onSubmit}>
          <input type="hidden" name="id" value={company.data?.id} />

          <Input label="Name" name="name" defaultValue={company.data?.name} />

          <Input
            label="Address"
            name="address"
            placeholder="Street, number - city/state, country"
            defaultValue={company.data?.address}
          />

          <Input
            label="Invoice Number Pattern"
            name="invoice_number_pattern"
            placeholder="INV-%Y/%0[4]"
            helper="GALLEY-2022/0001"
            defaultValue={company.data?.invoiceNumberPattern}
          />

          <ul className="leading-4 text-xs">
            <li>%Y = year</li>
            <li>%M = month</li>
            <li>%D = day</li>
            <li>%0 = increment. Use [n] to specify number of leading zeros</li>

            <ul className="not-prose leading-4 text-xs">
              <li>%0[3] = 001, 002, 003...</li>
            </ul>
          </ul>

          <button
            className="btn btn-primary"
            disabled={createCompany.isLoading}
          >
            Confirm
          </button>
        </form>
      </main>
    </ProtectedPage>
  );
};

export default NewCompanyPage;
