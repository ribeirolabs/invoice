import { formatDistance } from "date-fns";

export function dateToDistance(date: Date) {
  return formatDistance(date, new Date(), {
    addSuffix: true,
  });
}
