export function getLocale() {
  if (typeof navigator === "undefined") {
    return "en-US";
  }

  return navigator.language;
}
