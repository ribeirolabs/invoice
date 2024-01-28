import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { authenticator } from "~/services/auth.server";
import { sendEmail } from "~/services/email.server";
import { useFetcher } from "@remix-run/react";
import { useRef } from "react";
import { getValidAccount } from "~/data/user.server";

export async function action({ request }: ActionFunctionArgs) {
  try {
    const user = await authenticator.isAuthenticated(request);

    if (!user) {
      return redirect("/login", {
        status: 401,
      });
    }

    const data = await request.formData();
    const to = data.get("to");

    if (!to) {
      return json(
        {
          ok: false,
          message: "Missing `to`",
        },
        {
          status: 400,
        }
      );
    }

    const account = await getValidAccount(user.id, "google");

    const response = await sendEmail({
      from: user,
      to: to.toString(),
      provider: {
        accountId: account.providerAccountId,
        accessToken: account.access_token,
      },
    });

    return json({ ok: true, ...response });
  } catch (e: any) {
    console.error(e);
    return json(
      {
        ok: false,
        message: e.message,
      },
      {
        status: 500,
      }
    );
  }
}

export default function Email() {
  const fetcher = useFetcher<{ ok: true } | { ok: false; message: string }>();
  const form = useRef<HTMLFormElement>(null);

  // useEffect(() => {
  // if (fetcher.data?.ok) {
  //   form.current?.reset();
  // }
  // }, [fetcher.data]);

  return (
    <fetcher.Form action="/email" method="post" ref={form}>
      <input
        autoFocus
        type="email"
        placeholder="Send to..."
        name="to"
        defaultValue="igor.ribeiro.plus@gmail.com"
      />
      &nbsp;
      <button disabled={fetcher.state === "submitting"}>Send Email</button>
      &nbsp;
      {fetcher.data?.ok ? (
        <span style={{ color: "green" }}>Sent!</span>
      ) : (
        <span style={{ color: "red" }}>{fetcher.data?.message}</span>
      )}
    </fetcher.Form>
  );
}
