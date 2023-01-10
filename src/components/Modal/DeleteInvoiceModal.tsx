import { trpc } from "@/utils/trpc";
import { closeModal, Modal, ModalCancelButton } from "@common/components/Modal";
import { addToast } from "@common/components/Toast";
import { Invoice } from "@prisma/client";

export function getDeleteInvoiceModalId(invoiceId: string) {
  return `delete-invoice-${invoiceId}`;
}

export default function DeleteInvoiceModal({ invoice }: { invoice: Invoice }) {
  const id = getDeleteInvoiceModalId(invoice.id);
  const utils = trpc.useContext();
  const deleteInvoice = trpc.useMutation("invoice.delete", {
    async onSuccess(data) {
      return utils.invalidateQueries(["invoice.recent"]).finally(() => {
        addToast(`Invoice ${data.number} deleted`, "success");
        closeModal(id);
      });
    },
    onError() {
      addToast(`Unable to delete invoice ${invoice.number}`, "error");
    },
  });

  function onConfirm() {
    deleteInvoice.mutate(invoice.id);
  }

  return (
    <Modal id={id} size="sm">
      <div className="p-4">
        <h2 className="flex gap-2 items-center">Are you sure?</h2>
        <p>
          You&apos;re about to delete invoice{" "}
          <span className="text-highlight">{invoice.number}</span> and this
          cannot be undone.
        </p>
      </div>

      <div className="modal-footer">
        <ModalCancelButton
          modalId={id}
          className="flex-1 md:flex-none"
          autoFocus
        />
        <button
          className="btn btn--outline btn-error flex-1 md:btn-wide md:flex-none"
          data-loading={deleteInvoice.isLoading}
          onClick={onConfirm}
        >
          Delete invoice
        </button>
      </div>
    </Modal>
  );
}
