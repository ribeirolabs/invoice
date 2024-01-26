import TransferAccountModal from "@/components/Modal/TransferAccountModal";
import { getUserDisplayName } from "@/utils/account";
import { trpc } from "@/utils/trpc";
import { openModal } from "@common/components/Modal";
import { ProtectedPage } from "@common/components/ProtectedPage";
import { ssp } from "@common/server/ssp";
import formatInTimeZone from "date-fns-tz/formatInTimeZone";
import { GetServerSideProps } from "next";
import Image from "next/image";
import Link from "next/link";
import pluralize from "pluralize";
import { useMemo } from "react";
import { ErrorBoundary } from "react-error-boundary";

export const getServerSideProps: GetServerSideProps = (ctx) => {
  return ssp(ctx, () => []);
};

export default function SettingsPage() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ProtectedPage>
        <Page />
      </ProtectedPage>
    </ErrorBoundary>
  );
}

function Page() {
  const user = trpc.useQuery(["user.me"]);

  const stats = useMemo(() => {
    const stats: string[] = [];

    if (!user.data?._count) {
      return null;
    }

    const { companies, invoices } = user.data._count;

    if (companies) {
      stats.push(
        [
          String(companies).padStart(2, "0"),
          pluralize("company", companies),
        ].join(" ")
      );
    }

    if (invoices) {
      stats.push(
        [
          String(invoices).padStart(2, "0"),
          pluralize("invoice", invoices),
        ].join(" ")
      );
    }

    return stats.join(" • ");
  }, [user.data?._count]);

  if (!user.data) {
    return <p>User not found</p>;
  }

  if (user.isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="px-2">
        <h2>Profile</h2>
        <div className="flex items-center gap-4">
          <div className="relative flex-shrink-0 rounded-full w-20 h-20 overflow-hidden bg-neutral">
            {user.data.image && (
              <Image
                layout="fill"
                className="m-0 w-full"
                src={user.data.image}
                alt={`${user.data.name}'s avatar`}
              />
            )}
          </div>

          <div className="grid gap-3">
            <div className="flex flex-col md:flex-row md:items-end gap-2">
              <h3 className="m-0 leading-none">{user.data.name}</h3>
              <p className="m-0 text-sm">({user.data.email})</p>
            </div>
            <div>
              {stats ? <p className="m-0 text-sm">{stats}</p> : null}
              <p className="m-0 text-sm">
                Joined{" "}
                {formatInTimeZone(
                  user.data.createdAt,
                  user.data.timezone,
                  "MMM d, yyyy"
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="divider"></div>
      <TransferAccountSection />
      <div className="divider"></div>
    </>
  );
}

function TransferAccountSection() {
  const { data: pending, isLoading } = trpc.useQuery([
    "user.account.transfer.getPending",
  ]);

  return (
    <div className="md:max-w-[70%]">
      <h2>Transfer Account</h2>
      <p>
        This action will transfer all your data (invoices, companies) to a
        different account. You&apos;ll still be able to continue using the app
        with this account, but without any data.
      </p>
      {pending ? (
        <div className="alert bg-warning/10 ">
          {pending.isOwner
            ? `You currently have a pending transfer request waiting on ${getUserDisplayName(
                pending.toUserEmail,
                pending.toUser
              )} to accept/reject it`
            : `You have a pending transfer request from ${getUserDisplayName(
                pending.fromUserEmail,
                pending.fromUser
              )}. Approve or reject it in order to request an account transfer`}
          <Link href={`/settings/transfer-account/${pending.id}`}>
            <a className="flex-1 md:flex-none btn btn-sm btn-warning md:btn-wide btn-bordered">
              View
            </a>
          </Link>
        </div>
      ) : (
        <button
          className="btn btn-sm btn-outline btn-error"
          onClick={() => openModal("transfer-account")}
          data-loading={isLoading}
        >
          Transfer
        </button>
      )}
      <TransferAccountModal />
    </div>
  );
}

function ErrorFallback({ error }: { error: Error }) {
  return (
    <>
      <h1>Something went wrong</h1>
      <pre>{error.stack}</pre>
    </>
  );
}
