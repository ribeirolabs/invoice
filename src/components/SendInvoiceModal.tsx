import { trpc } from "@/utils/trpc";
import { Alert } from "@common/components/Alert";
import { closeModal, Modal, ModalCancelButton } from "@common/components/Modal";
import { addToast } from "@common/components/Toast";
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

  return (
    <Modal id={id} size="sm">
      <div className="p-4">
        <h2>Are you sure?</h2>
        <p>
          You&apos;re about to send <b>{invoice.number}</b> to:
        </p>
        <p className="font-bold">{invoice.payer.email}</p>
        <p className="text-sm">*You will also receive a copy</p>

        {history.isLoading ? (
          <p>Checking email history...</p>
        ) : (
          historyCount > 0 && (
            <Alert type="warning">
              You already sent this invoice {historyCount}{" "}
              {pluralize("time", historyCount)}:
              <ul>
                {history.data?.map(({ id, createdAt, email }) => (
                  <li key={id}>
                    <div>{format(createdAt, "yyyy-MM-dd HH:mm")}</div>
                    <div className="text-xs">{email}</div>
                  </li>
                ))}
              </ul>
            </Alert>
          )
        )}
      </div>

      <div className="flex gap-2 bg-base-300 p-4 justify-end">
        <ModalCancelButton modalId={id} className="flex-1 md:flex-none" />
        <button
          className="btn btn-primary flex-1 md:btn-wide md:flex-none"
          data-loading={sendInvoice.isLoading}
          onClick={onConfirm}
          disabled={history.isLoading}
          autoFocus
        >
          Send Email
        </button>
      </div>
    </Modal>
  );
}
