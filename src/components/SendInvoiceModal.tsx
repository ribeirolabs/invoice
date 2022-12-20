import { trpc } from "@/utils/trpc";
import { Alert } from "@common/components/Alert";
import { closeModal, Modal, ModalCancelButton } from "@common/components/Modal";
import { addToast } from "@common/components/Toast";
import { Company, Invoice } from "@prisma/client";
import format from "date-fns/format";
import pluralize from "pluralize";

export function SendInvoiceModal({
  invoice,
}: {
  invoice: Invoice & {
    payer: Company;
    receiver: Company;
  };
}) {
  const sendInvoice = trpc.useMutation(["invoice.send"]);
  const history = trpc.useQuery(["invoice.emailHistory", { id: invoice.id }]);

  function onConfirm() {
    sendInvoice.mutateAsync({ id: invoice.id }).then(() => {
      closeModal("send-invoice");
      addToast(`Invoice ${invoice.number} sent!`, "success");
      history.refetch();
    });
  }

  return (
    <Modal id="send-invoice" size="sm">
      <div className="p-4">
        <h2>Are you sure?</h2>
        <p>
          You&apos;re about to send the invoice <b>{invoice.number}</b> to{" "}
          <b>{invoice.payer.email}</b>
        </p>
        <Alert type="warning">
          You already sent this invoice {history.data?.length}{" "}
          {pluralize("time", history.data?.length)}:
          <ul>
            {history.data?.map(({ id, createdAt, email }) => (
              <li key={id}>
                <div>{format(createdAt, "yyyy-MM-dd HH:mm")}</div>
                <div className="text-xs">{email}</div>
              </li>
            ))}
          </ul>
        </Alert>
      </div>

      <div className="flex gap-2 bg-base-300 p-4 justify-end">
        <ModalCancelButton
          modalId="send-invoice"
          className="flex-1 md:flex-none"
        />
        <button
          className="btn btn-primary flex-1 md:btn-wide md:flex-none"
          data-loading={sendInvoice.isLoading}
          onClick={onConfirm}
          autoFocus
        >
          Confirm
        </button>
      </div>
    </Modal>
  );
}
