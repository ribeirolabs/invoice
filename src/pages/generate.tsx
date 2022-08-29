import { Input } from "@common/components/Input";
import { ProtectedPage } from "@/components/ProtectedPage";
import { ssp } from "@common/server/ssp";
import { trpc } from "@/utils/trpc";
import { GetServerSideProps } from "next";
import {
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import format from "date-fns/format";
import addDays from "date-fns/addDays";
import { getLocale } from "@/utils/locale";
import { getSeparators } from "@/utils/currency";
import Link from "next/link";
import { addToast } from "@common/components/Toast";
import { Alert } from "@common/components/Alert";

export const getServerSideProps: GetServerSideProps = (ctx) => {
  return ssp(ctx, (ssr) => {
    return ssr.prefetchQuery("company.getAll");
  });
};

export default function InvoiceGenerate() {
  const [receiverId, setReceiverId] = useState("");
  const [payerId, setPayerId] = useState("");
  const [date, setDate] = useState(() => format(new Date(), "yyyy-MM-dd"));
  const [dueDateDays, setDueDateDays] = useState(5);

  const [amount, setAmount] = useState("");

  const session = trpc.useQuery(["auth.getSession"]);
  const companies = trpc.useQuery(["company.getAll"]);
  const invoiceNumber = trpc.useMutation("invoice.getNumber");
  const invoice = trpc.useMutation("invoice.generate");
  const latest = trpc.useQuery([
    "invoice.latestFromPayer",
    {
      payer_id: payerId || null,
    },
  ]);

  const receivers = useMemo(() => {
    return (
      companies.data?.filter((company) =>
        company.users.find(
          (user) => user.userId === session.data?.user?.id && user.owner
        )
      ) ?? []
    );
  }, [companies.data, session.data]);

  const payers = useMemo(() => {
    return (
      companies.data?.filter(
        (company) => company.users.filter((user) => !user.owner).length
      ) ?? []
    );
  }, [companies.data]);

  const dueDate = useMemo(() => {
    return format(
      addDays(new Date(`${date} ${new Date().toTimeString()}`), dueDateDays),
      "yyyy-MM-dd"
    );
  }, [date, dueDateDays]);

  const payer = useMemo(() => {
    return companies.data?.find((company) => company.id === payerId);
  }, [payerId, companies]);

  useEffect(() => {
    if (!payerId || !receiverId) {
      invoiceNumber.reset();

      return;
    }

    invoiceNumber.mutateAsync({
      receiverId: receiverId,
      payerId: payerId,
    });
  }, [receiverId, payerId, invoiceNumber.mutateAsync, invoiceNumber.reset]);

  const formatAmount = useCallback((amount: number) => {
    return new Intl.NumberFormat(getLocale(), {
      maximumFractionDigits: 2,
    }).format(amount);
  }, []);

  useEffect(() => {
    if (!latest.data || !payer) {
      return;
    }

    setAmount(formatAmount(latest.data.amount));
  }, [latest.data, payer, formatAmount]);

  const waitingForDecimal = useRef(false);
  const deleting = useRef(false);
  const rawAmount = useRef(0);

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    deleting.current = e.key === "Backspace";
  }

  const separators = useMemo(() => {
    return getSeparators(payer?.currency);
  }, [payer]);

  function onChangeAmount(e: ChangeEvent<HTMLInputElement>) {
    let value = e.target.value.replace(
      new RegExp(`\\${separators.group}`, "g"),
      ""
    );

    if (
      new RegExp(`\\${separators.decimal}$`).test(value) &&
      !deleting.current
    ) {
      waitingForDecimal.current = true;
      return;
    }

    if (waitingForDecimal.current) {
      value = value.replace(/(\d)$/, `${separators.decimal}$1`);
      waitingForDecimal.current = false;
    }

    rawAmount.current = parseFloat(value.replace(",", ".") || "0");

    setAmount(formatAmount(rawAmount.current));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.target as HTMLFormElement;

    const data = new FormData(form);

    const time = new Date().toTimeString();
    const issuedAt = new Date(`${data.get("date") as string} ${time}`);
    const expiredAt = new Date(`${dueDate} ${time}`);

    const receiverId = data.get("receiver_id") as string;
    const payerId = data.get("payer_id") as string;

    try {
      const response = await invoice.mutateAsync({
        receiverId,
        payerId,
        issuedAt,
        expiredAt,
        description: data.get("description") as string,
        amount: rawAmount.current,
      });

      invoiceNumber.mutateAsync({
        receiverId,
        payerId,
      });

      latest.refetch();

      window.open(`/invoice/${response.id}`, "_blank");

      form.reset();
    } catch (e) {
      console.error(e);
      addToast("Unable to generate invoice", "error");
    }
  }

  return (
    <ProtectedPage>
      <div className="max-w-lg mx-auto">
        {(!receivers.length || !payers.length) && (
          <div className="mb-4">
            <Alert type="error" fluid>
              {!receivers.length
                ? "You need to own at least one company to generate an invoice."
                : !payers.length
                ? "You have no payer companies to generate an invoice."
                : ""}
              <Link href="/company/create">
                <a className="text-error-content font-bold ml-2">Create one</a>
              </Link>
            </Alert>
          </div>
        )}

        <div className="mb-4">
          <h1 className="m-0">Invoice</h1>
          <h2 className="m-0">{invoiceNumber.data}&nbsp;</h2>
        </div>

        <form className="form max-w-lg" onSubmit={onSubmit}>
          <div className="form-control w-full mb-2">
            <label className="label">
              <span className="label-text">Receiver</span>
            </label>

            <select
              className={`select select-bordered w-full ${
                !receivers.length ? "select-error" : ""
              }`}
              value={receiverId || ""}
              name="receiver_id"
              onChange={(e) => setReceiverId(e.target.value)}
            >
              <option></option>
              {receivers.map((company) => {
                return (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="form-control w-full mb-2">
            <label className="label">
              <span className="label-text">Payer</span>
            </label>

            <select
              className={`select select-bordered w-full ${
                !payers.length ? "select-error" : ""
              }`}
              value={payerId || ""}
              name="payer_id"
              onChange={(e) => setPayerId(e.target.value)}
            >
              <option></option>
              {payers.map((company) => {
                const user = company.users.find(
                  (user) => user.userId === session.data?.user?.id
                );

                return (
                  <option key={company.id} value={company.id}>
                    {company.name} {user?.type === "SHARED" && "(shared)"}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Date"
              name="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <Input
              label="Due Date"
              name="due_date"
              type="number"
              value={dueDateDays || 0}
              onChange={(e) => {
                const value = parseInt(e.target.value || "");
                setDueDateDays(value || 0);
              }}
              helper={dueDate}
              trailing={<span>days</span>}
            />
          </div>

          <Input
            key={payerId + "-description"}
            label="Description"
            name="description"
            type="textarea"
            defaultValue={latest.data?.description || ""}
          />

          <Input
            key={payerId + "-amount"}
            label="Amount"
            name="amount"
            value={amount}
            onKeyDown={onKeyDown}
            onChange={onChangeAmount}
            leading={<span>{payer?.currency}</span>}
            disabled={!payer}
          />

          <div className="divider"></div>

          <div className="btn-form-group">
            <button
              className="btn btn-primary btn-wide"
              data-loading={invoice.isLoading}
            >
              Confirm
            </button>
            <Link href="/">
              <a className="btn btn-ghost btn-wide">Cancel</a>
            </Link>
          </div>
        </form>
      </div>
    </ProtectedPage>
  );
}
