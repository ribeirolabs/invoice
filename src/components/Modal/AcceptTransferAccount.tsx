import { getUserDisplayName } from "@/utils/account";
import { inferQueryOutput, trpc } from "@/utils/trpc";
import { CheckIcon } from "@common/components/Icons";
import { closeModal, Modal, ModalCancelButton } from "@common/components/Modal";
import { addToast } from "@common/components/Toast";
import { useRouter } from "next/router";

export function AcceptTransferAccount({
  transfer,
}: {
  transfer: inferQueryOutput<"user.account.transfer.get">;
}) {
  const utils = trpc.useContext();
  const router = useRouter();
  const accept = trpc.useMutation("user.account.transfer.accept", {
    onSuccess() {
      router.push("/");
      addToast("Transfer request accepted.", "success");
    },
    onError(error) {
      addToast(error.message, "error");
    },
    onSettled() {
      closeModal("accept-transfer-account-modal");
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
    accept.mutate({
      id: router.query.id as string,
    });
  }

  if (!transfer) {
    return null;
  }

  return (
    <Modal id="accept-transfer-account-modal">
      <div className="p-4">
        <h2>Are you sure?</h2>
        <p>
          By accepting, all invoices and companies related to{" "}
          <span className="text-highlight">
            {getUserDisplayName(transfer.fromUserEmail, transfer.fromUser)}
          </span>{" "}
          will belong to you.
        </p>
      </div>

      <div className="modal-footer">
        <ModalCancelButton
          modalId="accept-transfer-account-modal"
          label="Keep transfer open"
          autoFocus
          disabled={accept.isLoading}
        />
        <button
          className="btn btn-success"
          onClick={onConfirm}
          data-loading={accept.isLoading}
        >
          <CheckIcon size={18} />
          Accept transfer
        </button>
      </div>
    </Modal>
  );
}
