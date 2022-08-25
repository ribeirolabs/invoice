const PATTERNS = {
  YEAR: /(%Y)/,
  MONTH: /(%M)/,
  INCREMENT: /(%0)(\[\d\])?/,
};

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
        ? String(data.getMonth()).padStart(2, "0")
        : key === "INCREMENT"
        ? opts.INCREMENT + 1
        : "";

    const regex = PATTERNS[key as keyof typeof PATTERNS];

    if (regex.test(pattern)) {
      const result = Array.from(pattern.matchAll(new RegExp(regex, "g")));

      const padding = result[0]?.[2]?.replace(/\D/g, "");

      invoiceNumber = invoiceNumber.replace(
        regex,
        String(replacer).padStart(parseInt(padding), "0")
      );
    }
  }

  return invoiceNumber;
}

export const CURRENCY_SYMBOL = {
  USD: "$",
  BRL: "R$",
  EUR: "€",
};

export const getCurrency = (code: string) => {
  return CURRENCY_SYMBOL[code as keyof typeof CURRENCY_SYMBOL];
};
