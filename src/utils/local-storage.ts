function key(name: string): string {
  return `@ribeirolabs/invoice:${name}`;
}

export const KEYS = {
  sensitiveInformation: key("sensitiveInformation"),
  receiver: key("receiver"),
  payer: key("payer"),
  dueDateDays: key("dueDateDays"),
};
