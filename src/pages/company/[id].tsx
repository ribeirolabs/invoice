import pluralize from "pluralize";
import { ProtectedPage } from "@common/components/ProtectedPage";
import { addToast } from "@common/components/Toast";
import { ssp } from "@common/server/ssp";
import { INVOICE_PATTERN_SYMBOLS, parseInvoicePattern } from "@/utils/invoice";
import { trpc } from "@/utils/trpc";
import type { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  FormEvent,
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Alert } from "@common/components/Alert";
import { Input } from "@common/components/Input";
import { dispatchCustomEvent } from "@ribeirolabs/events";
import { useEvent } from "@ribeirolabs/events/react";
import { CompanyEmail, User } from "@prisma/client";
import { AddIcon, DeleteIcon } from "@common/components/Icons";

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

    const emailsPayload: { email: string; alias: string }[] = [];
    const emails = data.getAll("email[]") as string[];
    const aliases = data.getAll("alias[]") as string[];

    for (let i = 0; i < emails.length; i++) {
      const email = emails[i];

      if (!email) {
        continue;
      }

      emailsPayload.push({
        email,
        alias: aliases[i] ?? "",
      });
    }

    try {
      await upsert.mutateAsync({
        id: data.get("id") as string,
        name: data.get("name") as string,
        address: data.get("address") as string,
        currency: data.get("currency") as string,
        invoiceNumberPattern: data.get("invoice_number_pattern") as string,
        owner: Boolean(data.get("owner") as string),
        emails: emailsPayload,
        deleteEmails: data.getAll("delete_emails[]") as string[],
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
    <div className="flex flex-col items-center">
      <div className="py-2 max-w-lg text-center w-full">
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

      <form className="form w-form" onSubmit={onSubmit}>
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
          helper={parseInvoicePattern(pattern, { INCREMENT: 0 }) || "-"}
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
          readOnly={!canEdit}
        />

        <div className="not-prose">
          <ul className="leading-4 text-xs grid gap-1">
            <li>
              <button
                className="btn btn-xs"
                type="button"
                onClick={() => insertInvoicePatternSymbol("YEAR")}
              >
                {INVOICE_PATTERN_SYMBOLS.YEAR}
              </button>{" "}
              = year
            </li>
            <li>
              <button
                className="btn btn-xs"
                type="button"
                onClick={() => insertInvoicePatternSymbol("MONTH")}
              >
                %M
              </button>{" "}
              = month
            </li>
            <li>
              <button
                className="btn btn-xs"
                type="button"
                onClick={() => insertInvoicePatternSymbol("DAY")}
              >
                %D
              </button>{" "}
              = day
            </li>
            <li>
              <button
                className="btn btn-xs"
                type="button"
                onClick={() => insertInvoicePatternSymbol("INCREMENT")}
              >
                %0
              </button>{" "}
              = increment. Use [n] to specify number of leading zeros
            </li>

            <ul className="not-prose ml-6 leading-4 text-xs">
              <li>%0[3] = 001, 002, 003...</li>
            </ul>
          </ul>
        </div>

        <EmailsForm
          mode={canEdit ? "write" : "readonly"}
          initial={company.data?.emails ?? []}
        />

        <div className="divider"></div>

        <Alert type="info" inverse>
          The update will only affect future invoices
        </Alert>

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

let fakeId = 0;

type EmailData = Pick<CompanyEmail, "id" | "email" | "alias">;

function emptyEmail(): EmailData {
  return { id: `FAKE-${fakeId++}`, email: "", alias: "" };
}

function EmailsForm({
  initial,
  mode,
}: {
  mode: "write" | "readonly";
  initial: EmailData[];
}) {
  const [list, setList] = useState<EmailData[]>(() =>
    initial.length ? initial : mode === "write" ? [emptyEmail()] : []
  );
  const [toDelete, setToDelete] = useState<string[]>([]);

  function onAddEmail() {
    setList((list) => list.concat([emptyEmail()]));
  }

  function onRemoveEmail(id: string) {
    setList((list) => {
      const next = list.filter((email) => email.id !== id);

      return next.length === 0 ? [emptyEmail()] : next;
    });

    if (id.startsWith("FAKE-")) {
      return;
    }

    setToDelete((list) => list.concat([id]));
  }

  return (
    <div>
      <div className="divider"></div>
      <h3>Emails</h3>

      {toDelete.map((id) => (
        <Fragment key={id}>
          <input type="hidden" name="delete_emails[]" value={id} />
        </Fragment>
      ))}

      {list.length === 0 ? (
        <p>No emails yet.</p>
      ) : mode === "write" ? (
        <fieldset className="grid grid-cols-[max-content_2fr_1fr_max-content] gap-2 items-center">
          <div></div>
          <div className="font-bold">Email</div>
          <div className="font-bold">Alias</div>
          <div></div>

          {list.map((data, i) => (
            <Fragment key={data.id}>
              <div className="text-center">{i + 1}</div>
              <input
                type="email"
                className="input input-bordered w-full"
                name="email[]"
                defaultValue={data.email ?? ""}
              />
              <input
                type="text"
                className="input input-bordered w-full"
                name="alias[]"
                defaultValue={data.alias ?? ""}
              />

              <div className="align-center">
                <button
                  className="btn-action"
                  onClick={() => onRemoveEmail(data.id)}
                >
                  <DeleteIcon />
                </button>
              </div>
            </Fragment>
          ))}

          <div className="col-span-4 text-center mt-2">
            <button
              className="btn btn-sm btn-wide"
              onClick={onAddEmail}
              type="button"
            >
              <AddIcon />
              Add new
            </button>
          </div>
        </fieldset>
      ) : (
        <ul>
          {list.map((data) => (
            <li key={data.id} className="leading-tight">
              <div className="font-bold">{data.email}</div>
              <span className="text-sm">{data.alias}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
