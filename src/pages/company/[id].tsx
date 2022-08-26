import { Input } from "@/components/Input";
import { ProtectedPage } from "@/components/ProtectedPage";
import { ssp } from "@/server/ssp";
import { trpc } from "@/utils/trpc";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { FormEvent, useMemo } from "react";

export const getServerSideProps: GetServerSideProps = (ctx) => {
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
  return (
    <ProtectedPage>
      <NewCompanyForm />
    </ProtectedPage>
  );
};

const NewCompanyForm = () => {
  const session = trpc.useQuery(["auth.getSession"]);
  const router = useRouter();
  const createCompany = trpc.useMutation(["company.upsert"]);
  const company = trpc.useQuery([
    "company.get",
    {
      id: router.query.id as string,
    },
  ]);

  const owner = useMemo(() => {
    return company.data?.users.find(
      (user) => user.userId === session.data?.user?.id && user.owner
    );
  }, [company.data, session.data]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.target as HTMLFormElement;

    const data = new FormData(form);

    try {
      await createCompany.mutateAsync({
        id: data.get("id") as string,
        name: data.get("name") as string,
        address: data.get("address") as string,
        currency: data.get("currency") as string,
        invoiceNumberPattern: data.get("invoice_number_pattern") as string,
        owner: Boolean(data.get("owner") as string),
      });

      if (company.data?.id) {
        company.refetch();
      } else {
        form.reset();
      }
    } catch (e) {}
  }

  return (
    <>
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

        <div className="flex">
          <div className="form-control flex-1">
            <label className="label cursor-pointer">
              <span className="label-text mr-4">Owner</span>
            </label>
            <input
              type="checkbox"
              className="toggle toggle-xl"
              name="owner"
              defaultChecked={Boolean(owner)}
            />
          </div>

          <div className="flex-1">
            <Input
              label="Currency"
              name="currency"
              defaultValue={company.data?.currency}
            />
          </div>
        </div>

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

        <div className="divider"></div>

        <button className="btn btn-primary" disabled={createCompany.isLoading}>
          Save
        </button>
      </form>
    </>
  );
};

export default NewCompanyPage;
