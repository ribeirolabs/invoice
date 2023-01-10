import { useRequiredUser } from "@/utils/account";
import { PropsWithChildren } from "react";

export function UserUnlocked({ children }: PropsWithChildren) {
  const user = useRequiredUser();
  if (user.locked) {
    return null;
  }
  return <>{children}</>;
}
