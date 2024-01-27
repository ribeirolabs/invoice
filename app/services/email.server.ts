import MailComposer from "nodemailer/lib/mail-composer/index.js";

export function getEmail(name: string, email: string) {
  const message = new MailComposer({
    to: "igor@ribeirolabs.com",
    from: `${name} <${email}>`,
    subject: "Test email from Remix",
    html: "<h1>It worked</h1>",
  });

  return message.compile().build();
}
