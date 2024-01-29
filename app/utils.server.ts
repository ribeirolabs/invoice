import { redirect } from "@remix-run/node";

export function redirectBack(
  request: Request,
  opts?: {
    fallback?: string;
  }
) {
  const redirectTo = request.headers.get("Referer") ?? opts?.fallback;

  if (redirectTo) {
    return redirect(redirectTo);
  }
}
