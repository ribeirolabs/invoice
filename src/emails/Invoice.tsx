import parse from "html-react-parser";
import { nlToBr } from "@common/utils/nl-to-br";
import { Company, Invoice } from "@prisma/client";
import {
  Spacing,
  Row,
  Heading,
  Separator,
  Text,
  Link,
  Page,
} from "./Components";
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
    <Page
      css={`
        @media screen and (max-width: 500px) {
          td {
            width: auto !important;
            display: block;
          }
        }
      `}
    >
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
          <Heading level={3}>Receiver</Heading>
          <Text>{invoice.receiver.name}</Text>
          <Text>
            <Link href={`mailto:${invoice.receiver.email}`} color="#4175d7">
              {invoice.receiver.email}
            </Link>
          </Text>
        </div>
        <div>
          <Heading level={3}>Bill To</Heading>
          <Text>{invoice.payer.name}</Text>
          <Text>
            <Link href={`mailto:${invoice.payer.email}`} color="#4175d7">
              {invoice.payer.email}
            </Link>
          </Text>
        </div>
      </Row>
    </Page>
  );
}
