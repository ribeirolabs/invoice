import { Input } from "@common/components/Input";
import { ProtectedPage } from "@common/components/ProtectedPage";
import { ssp } from "@common/server/ssp";
import { trpc } from "@/utils/trpc";
import { GetServerSideProps } from "next";
import {
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
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
import { useSettingsValue } from "@common/components/Settings";
import { Select } from "@common/components/Select";

export const getServerSideProps: GetServerSideProps = (ctx) => {
  return ssp(ctx, (ssr) => {
    return ssr.prefetchQuery("company.getAll");
  });
};

function formatAmount(amount: number) {
  return new Intl.NumberFormat(getLocale(), {
    maximumFractionDigits: 2,
  }).format(amount);
}

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

  const sensitiveInformation = useSettingsValue("sensitiveInformation");

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
  }, [invoiceNumber.reset, invoiceNumber.mutateAsync, payerId, receiverId]);

  const waitingForDecimal = useRef(false);
  const deleting = useRef(false);
  const rawAmount = useRef(0);

  useEffect(() => {
    if (!latest.data || !payer) {
      return;
    }

    rawAmount.current = latest.data.amount;
    setAmount(formatAmount(latest.data.amount));
  }, [latest.data, payer]);

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
    console.log("onChange", value, rawAmount.current);

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
      <div className="flex flex-col items-center">
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

        <div className="flex flex-wrap gap-2 w-full max-w-lg justify-between items-end">
          <h1 className="m-0">Invoice</h1>

          {invoiceNumber.data ? (
            <div className="badge badge-primary badge-lg text-xl font-bold">
              {invoiceNumber.data}
            </div>
          ) : null}
        </div>

        <form className="form w-form" onSubmit={onSubmit}>
          <div className="divider"></div>

          <Select
            label="Receiver"
            error={!receivers.length}
            name="receiver_id"
            onChange={(e) => setReceiverId(e.target.value)}
            value={receiverId ?? ""}
          >
            <option></option>
            {receivers.map((company) => {
              return (
                <option key={company.id} value={company.id}>
                  {company.alias ?? company.name}
                </option>
              );
            })}
          </Select>

          <Select
            label="Payer"
            error={!payers.length}
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
                  {company.alias ?? company.name}{" "}
                  {user?.type === "SHARED" && "(shared)"}
                </option>
              );
            })}
          </Select>

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
            type={sensitiveInformation ? "text" : "password"}
            value={amount}
            onKeyDown={onKeyDown}
            onChange={onChangeAmount}
            leading={<span>{payer?.currency ?? <>&nbsp;&nbsp;</>}</span>}
            disabled={!payer}
          />

          <div className="divider"></div>

          <div className="btn-form-group">
            <Link href="/">
              <a className="btn btn-outline btn-wide">Cancel</a>
            </Link>
            <button
              className="btn btn-primary btn-wide"
              data-loading={invoice.isLoading}
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </ProtectedPage>
  );
}
