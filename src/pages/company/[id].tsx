import pluralize from "pluralize";
import { ProtectedPage } from "@common/components/ProtectedPage";
import { addToast } from "@common/components/Toast";
import { ssp } from "@common/server/ssp";
import {
  CURRENCIES,
  INVOICE_PATTERN_SYMBOLS,
  parseInvoicePattern,
} from "@/utils/invoice";
import { trpc } from "@/utils/trpc";
import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Alert } from "@common/components/Alert";
import { Input } from "@common/components/Input";
import { dispatchCustomEvent } from "@ribeirolabs/events";
import { useEvent } from "@ribeirolabs/events/react";
import { User } from "@prisma/client";
import { Select } from "@common/components/Select";
import { getCurrencySymbol } from "@/utils/currency";
import { objectKeys } from "@common/utils/object-keys";

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

export const config = {
  unstable_excludeFiles: ["public/**/*"],
};

const NewCompanyPage: NextPage = () => {
  return (
    <ProtectedPage>
      <CompanyForm />
    </ProtectedPage>
  );
};

const CompanyForm = () => {
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
      company.data?.users
        ?.filter((user) => user.sharedById === authUser?.id)
        ?.map((share) => share.user) ?? []
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
    setPattern((current) => {
      const pattern = INVOICE_PATTERN_SYMBOLS[symbol];
      const next = [current, pattern];

      if (symbol === "INCREMENT") {
        next.push("[3]");
      }

      return next.join("");
    });
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

    const request = {
      id: data.get("id") as string,
      name: data.get("name") as string,
      alias: data.get("alias") as string,
      email: data.get("email") as string,
      address: data.get("address") as string,
      currency: data.get("currency") as string,
      invoiceNumberPattern: data.get("invoice_number_pattern") as string,
      owner: Boolean(data.get("owner") as string),
    };

    try {
      await upsert.mutateAsync(request);

      if (action === "create" && Boolean(data.get("create_another"))) {
        form.reset();
        setPattern("");

        (form.querySelector('input[name="name"]') as HTMLInputElement)?.focus();
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        router.push("/");
      }

      addToast(`Company ${request.alias ?? ""} ${action}d`, "success");
    } catch (e) {
      console.error(e);
      addToast(`Unable to ${action} company ${request.alias ?? ""}`, "error");
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="py-2 w-full md:max-w-lg text-center w-full">
        {user?.sharedBy && (
          <span className="badge badge-secondary mb-2">read-only</span>
        )}

        <h1>{company.data?.name ?? "Company"}</h1>

        {user?.sharedBy && (
          <>
            <div className="flex gap-4 justify-center items-center">
              <p className="m-0 text-sm">
                Shared by: <b>{user.sharedBy.name}</b>
              </p>
              <button
                className="btn btn-sm"
                onClick={onDetach}
                data-loading={detach.isLoading}
              >
                Detach
              </button>
            </div>
          </>
        )}

        {sharedWith.length > 0 && (
          <p className="m-0 text-sm">
            Shared with
            <button
              className="btn btn-sm mx-2 btn"
              onClick={() => {
                dispatchCustomEvent("modal", {
                  action: "open",
                  id: "company-shared-with",
                });
              }}
            >
              {sharedWith.length} {pluralize("user", sharedWith.length)}
            </button>
          </p>
        )}

        <div className="divider"></div>
      </div>

      <form
        className="form w-full md:max-w-lg"
        onSubmit={onSubmit}
        autoComplete="off"
      >
        <Input
          label="Name"
          name="name"
          defaultValue={company.data?.name}
          readOnly={!canEdit}
          style={{ textTransform: "uppercase" }}
        />

        <Input
          label="Alias"
          name="alias"
          helper="Optional"
          defaultValue={company.data?.alias ?? ""}
          readOnly={!canEdit}
          style={{ textTransform: "uppercase" }}
        />

        <Input
          label="Email"
          name="email"
          type="email"
          defaultValue={company.data?.email ?? ""}
          readOnly={!canEdit}
        />

        <Input
          label="Address"
          name="address"
          placeholder="Street, number - city/state, country"
          defaultValue={company.data?.address}
          readOnly={!canEdit}
          style={{ textTransform: "uppercase" }}
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
            <Select
              label="Currency"
              name="currency"
              defaultValue={company.data?.currency}
              disabled={!canEdit}
            >
              {CURRENCIES.map((code) => (
                <option key={code} value={code}>
                  {getCurrencySymbol(code)} - {code}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              label="Invoice Number Pattern"
              name="invoice_number_pattern"
              placeholder="INV-%Y/%0[4]"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              readOnly={!canEdit}
              required
              helper={
                /\%0/.test(pattern)
                  ? "Use the [X] after %0 to control the leading numbers for the increment"
                  : ""
              }
            />
          </div>
          <div className="flex-1 flex gap-2 flex-col">
            <span>&nbsp;</span>
            <div className="h-[48px] flex items-center">
              <h3 className="m-0">
                {parseInvoicePattern(pattern, { INCREMENT: 0 }) || "-"}
              </h3>
            </div>
          </div>
        </div>

        <div className="btn-group">
          {objectKeys(INVOICE_PATTERN_SYMBOLS).map((pattern) => (
            <button
              key={pattern}
              className="btn btn-sm"
              type="button"
              onClick={() => insertInvoicePatternSymbol(pattern)}
            >
              {pattern}
            </button>
          ))}
        </div>
        <p className="m-0 text-sm">
          Click on the buttons above to insert a pattern
        </p>

        <Alert type="info" inverse className="my-8">
          The update will only affect future invoices
        </Alert>

        <div className="divider" />

        {!company.data ? (
          <div className="flex justify-end">
            <div className="flex gap-2 items-center">
              <label className="cursor-pointer text-sm">Create another</label>
              <input
                type="checkbox"
                className="toggle"
                name="create_another"
                disabled={!canEdit}
              />
            </div>
          </div>
        ) : null}

        <div className="mt-4 btn-form-group">
          <Link href="/">
            <a className="btn btn-wide btn-outline">Cancel</a>
          </Link>

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
        </div>

        <input type="hidden" name="id" value={company.data?.id} />
      </form>

      <Modal users={sharedWith} />
    </div>
  );
};

const Modal = ({ users }: { users: User[] }) => {
  const [opened, setOpened] = useState(false);

  useEvent(
    "modal",
    useCallback((e) => {
      if (e.detail.id !== "company-shared-with") {
        return;
      }

      setOpened(e.detail.action === "open");
    }, [])
  );

  return (
    <div
      className="modal modal-bottom sm:modal-middle"
      data-open={opened}
      onClick={() => setOpened(false)}
    >
      <div className="modal-box border border-base-300 relative">
        <h3 className="font-bold text-lg">Shared with</h3>

        <div className="overflow-x-auto">
          <table className="table table-zebra m-0 w-full border border-base-300 table-compact">
            <thead>
              <tr>
                <th className="w-[5ch]"></th>
                <th>Name</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user, i) => (
                <tr key={user.id}>
                  <td>{i + 1}</td>
                  <td>{user.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="modal-action">
          <button className="btn btn-ghost" onClick={() => setOpened(false)}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewCompanyPage;
