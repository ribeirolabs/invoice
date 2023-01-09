import { getUserDisplayName } from "@/utils/account";
import { trpc } from "@/utils/trpc";
import { closeModal, Modal, ModalCancelButton } from "@common/components/Modal";
import { addToast } from "@common/components/Toast";
import { useRouter } from "next/router";

export function RejectTransferAccount() {
  const utils = trpc.useContext();
  const router = useRouter();
  const transfer = utils.getQueryData([
    "user.account.transfer.get",
    {
      id: router.query.id as string,
    },
  ]);
  const reject = trpc.useMutation("user.account.transfer.reject", {
    onSuccess() {
      router.push("/");
      addToast("Transfer request rejected.", "success");
    },
    onError(error) {
      addToast(error.message, "error");
    },
    onSettled() {
      closeModal("reject-transfer-account-modal");
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
    reject.mutate({
      id: router.query.id as string,
    });
  }

  if (!transfer) {
    return null;
  }

  return (
    <Modal id="reject-transfer-account-modal">
      <div className="p-4">
        <h2>Are you sure?</h2>
        <p>
          By rejecting the data will keep belonging to{" "}
          {getUserDisplayName(transfer.fromUserEmail, transfer.fromUser)}
        </p>
      </div>

      <div className="modal-footer">
        <ModalCancelButton
          modalId="reject-transfer-account-modal"
          label="Keep transfer open"
          autoFocus
          disabled={reject.isLoading}
        />
        <button
          className="btn btn-error"
          onClick={onConfirm}
          data-loading={reject.isLoading}
        >
          Reject transfer
        </button>
      </div>
    </Modal>
  );
}
