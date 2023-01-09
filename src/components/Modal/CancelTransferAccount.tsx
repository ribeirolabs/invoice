import { trpc } from "@/utils/trpc";
import { closeModal, Modal, ModalCancelButton } from "@common/components/Modal";
import { addToast } from "@common/components/Toast";
import { useRouter } from "next/router";

export function CancelTransferAccount() {
  const utils = trpc.useContext();
  const router = useRouter();
  const cancel = trpc.useMutation("user.account.transfer.cancel", {
    onSuccess() {
      router.push("/");
      addToast("Transfer request cancelled. Account unlocked.", "success");
    },
    onError(error) {
      addToast(error.message, "error");
    },
    onSettled() {
      closeModal("cancel-transfer-account-modal");
      utils.invalidateQueries([
        "user.account.transfer.get",
        {
          id: router.query.id as string,
        },
      ]);
      utils.invalidateQueries(["user.account.transfer.getPending"]);
    },
  });
  function onConfirm() {
    cancel.mutate({
      id: router.query.id as string,
    });
  }
  return (
    <Modal id="cancel-transfer-account-modal">
      <div className="p-4">
        <h2>Are you sure?</h2>
        <p>
          By cancelling the request your account will be unlocked and
          you&apos;ll be to generate invoices and create or edit companies
          again.
        </p>
      </div>

      <div className="modal-footer">
        <ModalCancelButton
          modalId="cancel-transfer-account-modal"
          label="Keep transfer open"
          autoFocus
          disabled={cancel.isLoading}
        />
        <button
          className="btn btn-error"
          onClick={onConfirm}
          data-loading={cancel.isLoading}
        >
          Cancel transfer
        </button>
      </div>
    </Modal>
  );
}
