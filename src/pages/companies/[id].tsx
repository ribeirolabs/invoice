import { Header } from "@/components/Header";
import { Input } from "@/components/Input";
import { ProtectedPage } from "@/components/ProtectedPage";
import { ssp } from "@/server/ssp";
import { trpc } from "@/utils/trpc";
import type { GetServerSideProps, NextPage } from "next";
import { FormEvent } from "react";

export const getServerSideProps: GetServerSideProps = (ctx) => {
  return ssp(ctx, () => {
    return Promise.resolve();
  });
};

const NewCompanyPage: NextPage = () => {
  const createCompany = trpc.useMutation(["company.create"]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.target as HTMLFormElement;

    const data = new FormData(form);

    try {
      const response = await createCompany.mutateAsync({
        name: data.get("name") as string,
        address: data.get("address") as string,
        invoiceNumberPattern: data.get("invoice_number_pattern") as string,
      });

      form.reset();
    } catch (e) {}
  }

  return (
    <ProtectedPage>
      <Header />
      <main className="p-4">
        <h1>New Company</h1>

        <form className="form" onSubmit={onSubmit}>
          <Input label="Name" name="name" />

          <Input
            label="Address"
            name="address"
            placeholder="Street, number - city/state, country"
          />

          <Input
            label="Invoice Number Pattern"
            name="invoice_number_pattern"
            placeholder="INV-%Y/%0[4]"
            helper="GALLEY-2022/0001"
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
