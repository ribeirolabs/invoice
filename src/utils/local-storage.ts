function key(name: string): string {
  return `@ribeirolabs/invoice:${name}`;
}

export const KEYS = {
  receiver: key("receiver"),
  payer: key("payer"),
  dueDateDays: key("dueDateDays"),
};
