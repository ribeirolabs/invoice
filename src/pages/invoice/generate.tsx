import { Input } from "@/components/Input";
import { ProtectedPage } from "@/components/ProtectedPage";
import { ssp } from "@/server/ssp";
import { trpc } from "@/utils/trpc";
import { GetServerSideProps } from "next";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useLocalStorage } from "@ribeirolabs/local-storage/react";
import { KEYS } from "@/utils/local-storage";
import format from "date-fns/format";
import addDays from "date-fns/addDays";

export const getServerSideProps: GetServerSideProps = (ctx) => {
  return ssp(ctx, (ssr) => {
    return ssr.fetchQuery("company.getAll");
  });
};

export default function InvoiceGenerate() {
  const companies = trpc.useQuery(["company.getAll"]);

  const { mutate: generateInvoiceNumber, ...invoiceNumber } =
    trpc.useMutation("invoice.get-number");

  const { mutateAsync: generateInvoice, ...invoice } =
    trpc.useMutation("invoice.generate");

  const [receiverId, setReceiverId] = useLocalStorage(KEYS.receiver, "");
  const [payerId, setPayerId] = useLocalStorage(KEYS.payer, "");
  const [date, setDate] = useState(() => format(new Date(), "yyyy-MM-dd"));
  const [dueDateDays, setDueDateDays] = useLocalStorage(KEYS.dueDateDays, 5);

  const latest = trpc.useQuery([
    "invoice.latestFromPayer",
    {
      payer_id: payerId,
    },
  ]);

  const dueDate = useMemo(() => {
    return addDays(new Date(date), dueDateDays).toLocaleDateString();
  }, [date, dueDateDays]);

  const payer = useMemo(() => {
    return companies.data?.find((company) => company.id === payerId);
  }, [payerId, companies]);

  useEffect(() => {
    if (!payerId) {
      return;
    }

    generateInvoiceNumber({
      company_id: payerId,
    });
  }, [payerId, generateInvoiceNumber]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.target as HTMLFormElement;

    const data = new FormData(form);

    try {
      await generateInvoice({
        receiverId: data.get("receiver_id") as string,
        payerId: data.get("payer_id") as string,
        issuedAt: new Date(data.get("date") as string),
        expiredAt: new Date(data.get("due_date") as string),
        description: data.get("description") as string,
        amount: parseFloat(data.get("amount") as string),
      });

      // form.reset();
    } catch (e) {
      alert(e);
    }
  }

  return (
    <ProtectedPage>
      <h1>Generate Invoice: {invoiceNumber.data}</h1>

      <form className="form max-w-lg" onSubmit={onSubmit}>
        <div className="form-control w-full mb-2">
          <label className="label">
            <span className="label-text">Receiver</span>
          </label>

          <select
            className="select select-bordered w-full"
            value={receiverId}
            name="receiver_id"
            onChange={(e) => setReceiverId(e.target.value)}
          >
            {companies.data?.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-control w-full mb-2">
          <label className="label">
            <span className="label-text">Payer</span>
          </label>

          <select
            className="select select-bordered w-full"
            value={payerId}
            name="payer_id"
            onChange={(e) => {
              setPayerId(e.target.value);
            }}
          >
            <option></option>
            {companies.data
              ?.filter((company) => company.id !== receiverId)
              .map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
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
            value={dueDateDays}
            onChange={(e) => setDueDateDays(parseInt(e.target.value))}
            helper={dueDate}
            trailing={<span>days</span>}
          />
        </div>

        <Input label="Description" name="description" type="textarea" />

        <Input
          label="Amount"
          name="amount"
          type="number"
          leading={<span>{payer?.currency}</span>}
        />

        <button className="btn btn-primary" disabled={invoice.isLoading}>
          Confirm
        </button>
      </form>
    </ProtectedPage>
  );
}
