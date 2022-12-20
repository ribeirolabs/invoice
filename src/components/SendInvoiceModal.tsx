import { trpc } from "@/utils/trpc";
import { closeModal, Modal, ModalCancelButton } from "@common/components/Modal";
import { addToast } from "@common/components/Toast";
import { Company, Invoice } from "@prisma/client";

export function SendInvoiceModal({
  invoice,
}: {
  invoice: Invoice & {
    payer: Company;
    receiver: Company;
  };
}) {
  const { mutateAsync, isLoading } = trpc.useMutation(["invoice.send"]);

  function onConfirm() {
    mutateAsync({ id: invoice.id }).then(() => {
      closeModal("send-invoice");
      addToast("Invoice sent!", "success");
    });
  }

  return (
    <Modal id="send-invoice">
      <div className="p-4">
        <h2>Are you sure?</h2>
        <p>
          You&apos;re about to send the invoice <b>{invoice.number}</b> to{" "}
          <b>{invoice.payer.email}</b>
        </p>
      </div>

      <div className="flex gap-2 bg-base-300 p-4 justify-end">
        <ModalCancelButton
          modalId="send-invoice"
          className="flex-1 md:flex-none"
        />
        <button
          className="btn btn-primary flex-1 md:btn-wide md:flex-none"
          data-loading={isLoading}
          onClick={onConfirm}
          autoFocus
        >
          Confirm
        </button>
      </div>
    </Modal>
  );
}
