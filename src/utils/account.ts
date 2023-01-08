export function getUserDisplayName(
  email: string,
  user: { name: string | null } | null
) {
  if (!user) {
    return email;
  }

  return [user.name, `(${email})`].join(" ");
}
