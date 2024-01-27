import MailComposer from "nodemailer/lib/mail-composer/index.js";

export function getEmail({
  from,
  to,
}: {
  to: { email: string };
  from: { name: string; email: string };
}) {
  const message = new MailComposer({
    to: to.email,
    from: `${from.name} <${from.email}>`,
    subject: "Test email from Remix",
    html: "<h1>It worked</h1>",
  });

  return message.compile().build();
}
