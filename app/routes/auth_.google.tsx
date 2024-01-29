import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { AUTH_INTENTS } from "~/intents";
import { authenticator } from "~/services/auth.server";

export function loader() {
  return redirect("/login");
}

export async function action({ request }: ActionFunctionArgs) {
  const data = await request.formData();
  const intent = data.get("intent");

  switch (intent) {
    case AUTH_INTENTS.login:
      return authenticator.authenticate("google", request);
    case AUTH_INTENTS.logout:
      return authenticator.logout(request, {
        redirectTo: "/login",
      });
    default:
      throw redirect("/login", {
        status: 400,
      });
  }
}
