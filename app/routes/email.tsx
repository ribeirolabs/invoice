import { ActionFunctionArgs, json } from "@remix-run/node";
import { requireUser } from "~/services/auth.server";
import { sendEmail } from "~/services/email.server";
import { useFetcher } from "@remix-run/react";
import { useRef } from "react";

export async function action({ request }: ActionFunctionArgs) {
  try {
    const user = await requireUser(request);
    const data = await request.formData();
    const to = data.get("to");

    if (!to) {
      throw new Response(null, {
        status: 400,
        statusText: "Missing email receiver",
      });
    }

    const response = await sendEmail({
      user,
      to: to.toString(),
      subject: "Test",
      content: "<h1>Test email</h1>",
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
