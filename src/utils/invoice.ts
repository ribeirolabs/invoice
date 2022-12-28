export type InvoiceStatus = "created" | "sent" | "overdue" | "fullfilled";

export const INVOICE_PATTERN_SYMBOLS = {
  YEAR: "%Y",
  MONTH: "%M",
  DAY: "%D",
  INCREMENT: "%0",
} as const;

const PATTERNS = {
  YEAR: new RegExp(`(${INVOICE_PATTERN_SYMBOLS.YEAR})`),
  MONTH: new RegExp(`(${INVOICE_PATTERN_SYMBOLS.MONTH})`),
  DAY: new RegExp(`(${INVOICE_PATTERN_SYMBOLS.DAY})`),
  INCREMENT: new RegExp(`(${INVOICE_PATTERN_SYMBOLS.INCREMENT})(\\[\\d\\])?`),
} as const;

export function parseInvoicePattern(
  pattern: string,
  opts: {
    INCREMENT: number;
  }
): string {
  let invoiceNumber = pattern;

  const data = new Date();

  for (const key in PATTERNS) {
    const replacer =
      key === "YEAR"
        ? data.getFullYear()
        : key === "MONTH"
        ? String(data.getMonth() + 1).padStart(2, "0")
        : key === "DAY"
        ? String(data.getDate()).padStart(2, "0")
        : key === "INCREMENT"
        ? opts.INCREMENT + 1
        : "";

    const regex = PATTERNS[key as keyof typeof PATTERNS];

    if (regex.test(pattern)) {
      const result = Array.from(pattern.matchAll(new RegExp(regex, "g")));

      const padding = result[0]?.[2]?.replace(/\D/g, "") ?? "";

      invoiceNumber = invoiceNumber.replace(
        regex,
        String(replacer).padStart(parseInt(padding), "0")
      );
    }
  }

  return invoiceNumber;
}

export const CURRENCIES = ["USD", "BRL", "EUR"] as const;
