import { formatDistance } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { twMerge } from "tailwind-merge";

export function getLocale() {
  if (typeof navigator === "undefined") {
    return "en-US";
  }

  return navigator.language;
}

export function getTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function cookieToObject(cookies: string): Record<string, string> {
  return cookies.split("; ").reduce((all, cookie) => {
    const [name, value] = cookie.split("=");
    all[name] = value;
    return all;
  }, {} as ReturnType<typeof cookieToObject>);
}

export function cn(
  ...args: (string | false | null | undefined | string[])[]
): string {
  return twMerge(...args);
}

export function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat(getLocale(), {
    style: "currency",
    currency,
  }).format(amount);
}

export function dateToDistance(date: Date | string) {
  return formatDistance(date, new Date(), {
    locale: ptBR,
    addSuffix: true,
  });
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  BRL: "R$",
};

export function getCurrencySymbol(currency = "USD"): string {
  if (currency in CURRENCY_SYMBOLS) {
    return CURRENCY_SYMBOLS[currency];
  }

  return (
    new Intl.NumberFormat(getLocale(), {
      style: "currency",
      currency,
    })
      .formatToParts(1)
      .find((part) => part.type === "currency")?.value ?? "$"
  );
}

export function nlToBr(text: string) {
  return text.replace(/\n/g, "<br />");
}
