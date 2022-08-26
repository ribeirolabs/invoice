import { getLocale } from "./locale";

export function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat(getLocale(), {
    style: "currency",
    currency,
  }).format(amount);
}

export function getSeparators(currency = "USD") {
  const parts = new Intl.NumberFormat(getLocale(), {
    style: "currency",
    currency,
  }).formatToParts(10000.2);

  let decimal = "";
  let group = "";

  for (const part of parts) {
    if (part.type === "group") {
      group = part.value;
    }

    if (part.type === "decimal") {
      decimal = part.value;
    }
  }

  return {
    decimal,
    group,
  };
}
