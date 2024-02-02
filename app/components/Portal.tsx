import { ReactNode, useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";

export function Portal({
  children,
  selector,
}: {
  children: ReactNode;
  selector: string;
}) {
  const element = useRef<HTMLElement | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    element.current = document.querySelector(selector);

    if (!element.current) {
      console.error(`[Portal] element not found: ${selector}`);
      return;
    }

    setReady(true);
  }, [selector]);

  if (!element.current || !ready) {
    return null;
  }

  return createPortal(children, element.current);
}
