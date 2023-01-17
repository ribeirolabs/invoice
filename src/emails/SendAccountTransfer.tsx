import { Spacing, Row, Heading, Text, Page } from "./Components";
import { getUserDisplayName } from "@/utils/account";
import { AccountTransfer, User } from "@prisma/client";
import { ArrowRightIcon } from "@common/components/Icons";

export function SendAccountTransfer({
  transfer,
  url,
}: {
  transfer: AccountTransfer & {
    fromUser: User | null;
    toUser: User | null;
  };
  url: string;
}) {
  return (
    <Page>
      <Spacing />
      <Row bg="#fff" pb={0}>
        <Heading level={1} textAlign="center">
          Account Transfer Request
        </Heading>
      </Row>
      <Row bg="#fff" pb={0}>
        <Text textAlign="center">
          You received an account transfer request from{" "}
        </Text>
      </Row>
      <Row bg="#fff" pb={0} pt={0}>
        <Text fontWeight="bold" color="#333" textAlign="center">
          {getUserDisplayName(transfer.fromUserEmail, transfer.fromUser)}
        </Text>
      </Row>
      <Row bg="#fff" pt={0}>
        <Text textAlign="center">
          If you accept it all invoices and companies will belong to you.
        </Text>
      </Row>
      <Row bg="#fff" pt={0}>
        <div
          style={{
            textAlign: "center",
          }}
        >
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            style={{
              textDecoration: "none",
              textTransform: "uppercase",
              fontWeight: "bold",
              display: "inline-block",
              padding: "12px 24px",
              background: "#daad58",
              borderRadius: "2rem",
              verticalAlign: "middle",
              color: "rgba(0, 0, 0, .8)",
            }}
          >
            <div
              style={{
                display: "inline-block",
                verticalAlign: "middle",
                marginRight: 12,
              }}
            >
              <ArrowRightIcon size={18} />
            </div>
            <Text
              as="span"
              display="inline-block"
              letterSpacing={1}
              fontSize={14}
              color="inherit"
            >
              View Request
            </Text>
          </a>
        </div>
      </Row>
    </Page>
  );
}
