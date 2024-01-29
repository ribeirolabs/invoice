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
