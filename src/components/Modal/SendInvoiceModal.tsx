import { dateToDistance } from "@/utils/date";
import { INVOICE_EMAIL_LIMIT } from "@/utils/invoice";
import { trpc } from "@/utils/trpc";
import { Alert } from "@common/components/Alert";
import { closeModal, Modal, ModalCancelButton } from "@common/components/Modal";
import { addToast } from "@common/components/Toast";
import { cn } from "@common/utils/classNames";
import { Company, Invoice } from "@prisma/client";
import format from "date-fns/format";
import pluralize from "pluralize";

export function getSendInvoiceModalId(invoiceId: string) {
  return `send-invoice-${invoiceId}`;
}

export default function SendInvoiceModal({
  invoice,
}: {
  invoice: Invoice & {
    payer: Company;
    receiver: Company;
  };
}) {
  const sendInvoice = trpc.useMutation(["invoice.send"]);
  const history = trpc.useQuery(["invoice.emailHistory", { id: invoice.id }]);
  const id = getSendInvoiceModalId(invoice.id);

  function onConfirm() {
    sendInvoice
      .mutateAsync({ id: invoice.id })
      .then(() => {
        closeModal(id);
        addToast(`Invoice ${invoice.number} sent!`, "success");
        history.refetch();
      })
      .catch((e) => {
        console.error(e);
        addToast(`Unable to send ${invoice.number}`, "error");
      });
  }

  const historyCount = history.data?.length ?? 0;
  const submissionsLeft = INVOICE_EMAIL_LIMIT - historyCount;

  return (
    <Modal id={id} size="sm">
      <div className="p-4">
        <h2>Send Invoice</h2>
        <p className="m-0">
          You&apos;re about to send an email to{" "}
          <span className="text-highlight">{invoice.payer.email}</span> with the
          invoice <b className="text-highlight">{invoice.number}</b>
        </p>
        <p>
          You&apos;ll also receive a copy on{" "}
          <b className="text-highlight">{invoice.receiver.email}</b>
        </p>

        {history.isLoading ? (
          <p>Checking email history...</p>
        ) : (
          historyCount > 0 && (
            <div
              className={cn(
                "p-4 rounded-sm font-bold",
                submissionsLeft > 0 ? "bg-warning/10" : "bg-error/10"
              )}
            >
              {submissionsLeft > 0 ? (
                <>
                  You can send this invoice {submissionsLeft} more{" "}
                  {pluralize("time", submissionsLeft)}
                </>
              ) : (
                <>
                  You already sent this invoice {historyCount}{" "}
                  {pluralize("time", historyCount)}
                </>
              )}

              <ol>
                {history.data?.map(({ id, createdAt, email }) => (
                  <li key={id}>
                    <div>Sent {dateToDistance(createdAt)}</div>
                    <div className="text-xs">{email}</div>
                  </li>
                ))}
              </ol>
            </div>
          )
        )}
      </div>

      <div className="flex gap-2 bg-base-300 p-4 justify-end">
        <ModalCancelButton
          modalId={id}
          className="flex-1 md:flex-none"
          autoFocus
        />
        <button
          className="btn btn-primary flex-1 md:btn-wide md:flex-none"
          data-loading={sendInvoice.isLoading}
          onClick={onConfirm}
          disabled={history.isLoading || submissionsLeft === 0}
          autoFocus
        >
          Send Email
        </button>
      </div>
    </Modal>
  );
}
