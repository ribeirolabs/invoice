import parse from "html-react-parser";
import { nlToBr } from "@common/utils/nl-to-br";
import { Company, Invoice } from "@prisma/client";
import { Spacing, Row, Heading, Separator, Text, Link } from "./Components";
import formatInTimeZone from "date-fns-tz/formatInTimeZone";

type PartialInvoice = Pick<
  Invoice,
  "number" | "issuedAt" | "expiredAt" | "description"
> & {
  payer: Pick<Company, "name" | "email" | "currency">;
  receiver: Pick<Company, "name" | "email">;
  user: {
    timezone: string;
  };
};

export function InvoiceEmail({ invoice }: { invoice: PartialInvoice }) {
  return (
    <html>
      <head>
        <style>{`
        @media screen and (max-width: 500px) {
          td {
            width: auto !important;
            display: block;
          }
        }
        `}</style>
      </head>
      <body style={{ padding: 6, backgroundColor: "#e3e3e3" }}>
        <Spacing />
        <Row bg="#fff" pb={0}>
          <Heading level={1} textAlign="end" margin={0}>
            {invoice.number}
          </Heading>
        </Row>
        <Separator />
        <Row bg="#fff">
          <div>
            <Heading level={3}>Issued</Heading>
            <Text>
              {formatInTimeZone(
                invoice.issuedAt,
                invoice.user.timezone,
                "MMM d, yyyy"
              )}
            </Text>
          </div>
          <div>
            <Heading level={3}>Due Date</Heading>
            <Text>
              {formatInTimeZone(
                invoice.expiredAt,
                invoice.user.timezone,
                "MMM d, yyyy"
              )}
            </Text>
          </div>
        </Row>
        <Row bg="#fff">
          <div>
            <Heading level={3}>Description</Heading>
            <Text>{parse(nlToBr(invoice.description))}</Text>
          </div>
        </Row>
        <Row bg="#fff">
          <div>
            <Heading level={3}>From</Heading>
            <Text>{invoice.receiver.name}</Text>
            <Text>
              <Link href={`mailto:${invoice.receiver.email}`} color="#4175d7">
                {invoice.receiver.email}
              </Link>
            </Text>
          </div>
          <div>
            <Heading level={3}>To</Heading>
            <Text>{invoice.payer.name}</Text>
            <Text>
              <Link href={`mailto:${invoice.payer.email}`} color="#4175d7">
                {invoice.payer.email}
              </Link>
            </Text>
          </div>
        </Row>
        <Row>
          <Text textAlign="center">
            <Link
              href="https://invoice.ribeirolabs.com"
              color="#238244"
              fontWeight="bold"
              fontSize={12}
            >
              ribeirolabs / invoice
            </Link>
          </Text>
        </Row>
        <Spacing />
      </body>
    </html>
  );
}
