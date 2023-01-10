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
  if (user.locked) {
    throw new Error("Missing required user");
  }

  return user;
}

export function useIsUserLocked() {
  return useRequiredUser().locked;
}
