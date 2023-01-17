import { trpc } from "./trpc";

export function getUserDisplayName(
  email: string,
  user: { name: string | null } | null
) {
  if (!user) {
    return email;
  }

  return [user.name, `(${email})`].join(" ");
}

export function useRequiredUser() {
  const { data: user } = trpc.useQuery(["user.me"]);

  if (!user) {
    throw new Error("Missing required user");
  }

  return user;
}

export function useIsUserLocked() {
  return useRequiredUser().locked;
}

export function getTransferUrl(id: string, host?: string) {
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

  if (!host) {
    throw new Error("Unable to get host from request headers");
  }

  return new URL(
    `/settings/transfer-account/${id}`,
    `${protocol}://${host}`
  ).toString();
}
