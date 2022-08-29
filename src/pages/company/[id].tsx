import pluralize from "pluralize";
import { Input } from "@/components/Input";
import { ProtectedPage } from "@/components/ProtectedPage";
import { addToast } from "@/components/Toast";
import { ssp } from "@/server/ssp";
import { INVOICE_PATTERN_SYMBOLS, parseInvoicePattern } from "@/utils/invoice";
import { trpc } from "@/utils/trpc";
import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { Alert } from "@/components/Alert";

export const getServerSideProps: GetServerSideProps = (ctx) => {
  return ssp(ctx, (ssr) => {
    if (ctx.params?.id && ctx.params.id !== "new") {
      return [
        ssr.prefetchQuery("company.get", {
          id: ctx.params.id as string,
        }),
      ];
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

  const upsert = trpc.useMutation(["company.upsert"]);
  const detach = trpc.useMutation(["company.detach"]);
  const company = trpc.useQuery([
    "company.get",
    {
      id: router.query.id as string,
    },
  ]);

  const authUser = session.data?.user;

  const [pattern, setPattern] = useState("");

  const user = useMemo(() => {
    return company.data?.users.find(
      (user) => user.userId === session.data?.user?.id
    );
  }, [company.data, session.data]);

  const sharedWith = useMemo(() => {
    return (
      company.data?.users?.filter((user) => user.sharedById === authUser?.id) ??
      []
    );
  }, [authUser, company.data]);

  const canEdit = user?.type === "OWNED" || !company.data;

  useEffect(() => {
    if (company.data == null) {
      return;
    }

    setPattern(company.data.invoiceNumberPattern);
  }, [company.data]);

  function insertInvoicePatternSymbol(
    symbol: keyof typeof INVOICE_PATTERN_SYMBOLS
  ) {
    setPattern((pattern) => pattern + INVOICE_PATTERN_SYMBOLS[symbol]);
  }

  async function onDetach() {
    if (!company.data) {
      return;
    }

    const newCompany = await detach.mutateAsync({
      companyId: company.data.id,
    });

    router.replace(`/company/${newCompany.id}`);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.target as HTMLFormElement;

    const data = new FormData(form);

    const action = company.data?.id ? "update" : "create";

    try {
      await upsert.mutateAsync({
        id: data.get("id") as string,
        name: data.get("name") as string,
        address: data.get("address") as string,
        currency: data.get("currency") as string,
        invoiceNumberPattern: data.get("invoice_number_pattern") as string,
        owner: Boolean(data.get("owner") as string),
      });

      if (action === "update") {
        company.refetch();
      } else {
        form.reset();
      }

      addToast(`Company ${action}d`, "success");
    } catch (e) {
      console.error(e);
      addToast(`Unable to ${action} company`, "error");
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1>Company</h1>

      {user?.sharedBy && (
        <>
          <div className="flex gap-4 items-center">
            <p className="m-0 text-sm">
              Shared by: <b>{user.sharedBy.name}</b>
            </p>
            <button
              className="btn btn-secondary btn-sm"
              onClick={onDetach}
              data-loading={detach.isLoading}
            >
              Detach
            </button>
          </div>
          <div className="divider"></div>
        </>
      )}

      {sharedWith.length > 0 && (
        <>
          <p className="m-0 text-sm">
            Shared with {sharedWith.length}{" "}
            {pluralize("company", sharedWith.length)}
          </p>
          <div className="divider"></div>
        </>
      )}

      <form className="form max-w-lg" onSubmit={onSubmit}>
        <input type="hidden" name="id" value={company.data?.id} />

        <Input
          label="Name"
          name="name"
          defaultValue={company.data?.name}
          readOnly={!canEdit}
        />

        <Input
          label="Address"
          name="address"
          placeholder="Street, number - city/state, country"
          defaultValue={company.data?.address}
          readOnly={!canEdit}
        />

        <div className="flex">
          <div className="form-control flex-1">
            <label className="label cursor-pointer">
              <span className="label-text mr-4">Owner</span>
            </label>
            <div className="toggle-container">
              <input
                type="checkbox"
                className="toggle toggle-xl"
                name="owner"
                defaultChecked={Boolean(user?.owner)}
                disabled={!canEdit}
              />
              <span className="toggle-no-label">NO</span>
              <span className="toggle-yes-label">YES</span>
            </div>
          </div>

          <div className="flex-1">
            <Input
              label="Currency"
              name="currency"
              defaultValue={company.data?.currency}
              readOnly={!canEdit}
            />
          </div>
        </div>

        <Input
          label="Invoice Number Pattern"
          name="invoice_number_pattern"
          placeholder="INV-%Y/%0[4]"
          helper={parseInvoicePattern(pattern, { INCREMENT: 0 })}
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
          readOnly={!canEdit}
        />

        <ul className="leading-4 text-xs">
          <li>
            <button
              className="btn btn-xs btn-secondary"
              type="button"
              onClick={() => insertInvoicePatternSymbol("YEAR")}
            >
              {INVOICE_PATTERN_SYMBOLS.YEAR}
            </button>{" "}
            = year
          </li>
          <li>
            <button
              className="btn btn-xs btn-secondary"
              type="button"
              onClick={() => insertInvoicePatternSymbol("MONTH")}
            >
              %M
            </button>{" "}
            = month
          </li>
          <li>
            <button
              className="btn btn-xs btn-secondary"
              type="button"
              onClick={() => insertInvoicePatternSymbol("DAY")}
            >
              %D
            </button>{" "}
            = day
          </li>
          <li>
            <button
              className="btn btn-xs btn-secondary"
              type="button"
              onClick={() => insertInvoicePatternSymbol("INCREMENT")}
            >
              %0
            </button>{" "}
            = increment. Use [n] to specify number of leading zeros
          </li>

          <ul className="not-prose leading-4 text-xs">
            <li>%0[3] = 001, 002, 003...</li>
          </ul>
        </ul>

        <Alert type="info" inverse>
          The update will only affect future invoices
        </Alert>

        <div className="divider"></div>

        <div className="btn-form-group">
          {canEdit ? (
            <button
              className="btn btn-primary btn-wide"
              data-loading={upsert.isLoading}
              type="submit"
            >
              Save
            </button>
          ) : (
            <span>&nbsp;</span>
          )}

          <Link href="/">
            <a className="btn btn-ghost btn-wide">Cancel</a>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default NewCompanyPage;
