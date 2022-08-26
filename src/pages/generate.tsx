import { Input } from "@/components/Input";
import { ProtectedPage } from "@/components/ProtectedPage";
import { ssp } from "@/server/ssp";
import { trpc } from "@/utils/trpc";
import { GetServerSideProps } from "next";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useLocalStorage } from "@ribeirolabs/local-storage/react";
import { KEYS } from "@/utils/local-storage";
import format from "date-fns/format";
import addDays from "date-fns/addDays";

export const getServerSideProps: GetServerSideProps = (ctx) => {
  return ssp(ctx, (ssr) => {
    return ssr.prefetchQuery("company.getAll");
  });
};

export default function InvoiceGenerate() {
  const [receiverId, setReceiverId] = useLocalStorage(KEYS.receiver, "");
  const [payerId, setPayerId] = useLocalStorage(KEYS.payer, "");
  const [date, setDate] = useState(() => format(new Date(), "yyyy-MM-dd"));
  const [dueDateDays, setDueDateDays] = useLocalStorage(KEYS.dueDateDays, 5);

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

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.target as HTMLFormElement;

    const data = new FormData(form);

    const time = new Date().toTimeString();
    const issuedAt = new Date(`${data.get("date") as string} ${time}`);
    const expiredAt = new Date(`${dueDate} ${time}`);

    try {
      const response = await invoice.mutateAsync({
        receiverId: data.get("receiver_id") as string,
        payerId: data.get("payer_id") as string,
        issuedAt,
        expiredAt,
        description: data.get("description") as string,
        amount: parseFloat(data.get("amount") as string),
      });

      window.open(`/invoice/${response.id}`, "_blank");

      form.reset();
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
            value={receiverId || ""}
            name="receiver_id"
            onChange={(e) => setReceiverId(e.target.value)}
          >
            <option></option>
            {receivers.map((company) => (
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
            value={payerId || ""}
            name="payer_id"
            onChange={(e) => setPayerId(e.target.value)}
          >
            <option></option>
            {payers.map((company) => (
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
            value={dueDateDays || ""}
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
          type="number"
          defaultValue={latest.data?.amount || ""}
          leading={<span>{payer?.currency}</span>}
        />

        <div className="divider"></div>

        <button
          className="btn btn-primary btn-wide"
          disabled={invoice.isLoading}
        >
          Confirm
        </button>
      </form>
    </ProtectedPage>
  );
}
