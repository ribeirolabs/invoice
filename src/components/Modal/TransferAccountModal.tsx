import { trpc } from "@/utils/trpc";
import { Input } from "@common/components/Input";
import {
  closeModal,
  Modal,
  ModalCancelButton,
  useModalEvent,
} from "@common/components/Modal";
import { addToast } from "@common/components/Toast";
import { cn } from "@common/utils/classNames";
import { FormEvent, useCallback, useState } from "react";

const CONFIRMATION_TEXT = "transfer account";

export default function TransferAccountModal() {
  const transferData = trpc.useQuery([
    "user.account.transfer.getTransferredData",
  ]);
  const utils = trpc.useContext();
  const transfer = trpc.useMutation("user.account.transfer.request", {
    onSuccess(data) {
      addToast(
        `Transfer requested, waiting on ${data.toUserEmail} to accept it`,
        "success"
      );
      setTransferTo("");
      setConfirmation("");
      closeModal("transfer-account");
      utils.invalidateQueries(["user.account.transfer.getPending"]);
    },
    onError(e) {
      console.error(e);
      addToast(e.message, "error");
    },
  });
  const [transferTo, setTransferTo] = useState("");
  const [confirmation, setConfirmation] = useState("");

  function onConfirm(e: FormEvent) {
    e.preventDefault();

    transfer.mutate({
      toEmail: transferTo,
    });
  }

  useModalEvent(
    "transfer-account",
    useCallback(({ action }) => {
      if (action === "close") {
        setTransferTo("");
        setConfirmation("");
      }
    }, [])
  );

  return (
    <Modal id="transfer-account" size="sm">
      <form onSubmit={onConfirm}>
        <div className="p-4">
          <h2 className="flex gap-2 items-center">Are you sure?</h2>
          <p>You&apos;re about to transfer the data below:</p>

          <table className="table table-compact border border-neutral">
            <thead>
              <tr>
                <th colSpan={2}>Invoices</th>
              </tr>
            </thead>
            <tbody>
              {transferData.data?.invoices?.map((invoice, i) => (
                <tr key={invoice.number} className="m-0">
                  <td className="w-6">{i + 1}</td>
                  <td>{invoice.number}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <table className="table table-compact border border-neutral">
            <thead>
              <tr>
                <th colSpan={2}>Companies</th>
              </tr>
            </thead>
            <tbody>
              {transferData.data?.companies?.map(({ owner, company }, i) => (
                <tr key={company.id} className="m-0">
                  <td className="w-6">{i + 1}</td>
                  <td>
                    <span>{company.alias ?? company.name}</span>
                    <span
                      className={cn(
                        "badge badge-sm ml-4",
                        owner && "badge-info"
                      )}
                    >
                      {owner ? "owned" : "shared"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Input
            label="Email to Transfer Account"
            name="email"
            type="email"
            autoComplete="off"
            value={transferTo}
            onChange={(e) => setTransferTo(e.target.value)}
          />

          <p>
            The user will receive the transfer request and will be able to
            either accept or reject it. When accepted, all the data listed above
            will belong to that user.
          </p>

          <p>
            <span className="text-highlight">This cannot be undone.</span>
          </p>

          <p>
            To confirm the action type{" "}
            <span className="text-highlight">{CONFIRMATION_TEXT}</span> below
          </p>
          <Input
            name="confirmation"
            autoComplete="off"
            autoCapitalize="off"
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
          />
        </div>

        <div className="modal-footer flex-col-reverse md:flex-row">
          <ModalCancelButton modalId="transfer-account" className="flex-1" />
          <button
            className="btn btn-error btn-wide"
            data-loading={transfer.isLoading}
            disabled={confirmation !== CONFIRMATION_TEXT || !transferTo}
          >
            Transfer Account
          </button>
        </div>
      </form>
    </Modal>
  );
}
