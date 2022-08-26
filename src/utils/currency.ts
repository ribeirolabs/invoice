import { getLocale } from "./locale";

export function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat(getLocale(), {
    style: "currency",
    currency,
  }).format(amount);
}
