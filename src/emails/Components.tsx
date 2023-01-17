import {
  PropsWithChildren,
  CSSProperties,
  createElement,
  Children,
  useEffect,
  useRef,
} from "react";

const HEADING_STYLE = {
  1: { fontSize: 26 },
  2: { fontSize: 20 },
  3: { fontSize: 16, letterSpacing: "0.05rem" },
} as const;

export function Heading({
  level,
  children,
  ...style
}: PropsWithChildren<{ level: 1 | 2 | 3 }> & CSSProperties) {
  return createElement(
    `h${level}`,
    {
      style: {
        margin: "0 0 6px 0",
        ...(style ?? {}),
        ...HEADING_STYLE[level],
        fontFamily: "Arial, sans-serif",
        fontWeight: 900,
        textTransform: "uppercase",
      },
    },
    children
  );
}

export function Text({
  children,
  ...style
}: PropsWithChildren & CSSProperties) {
  return (
    <p
      style={{
        ...style,
        margin: "6px 0",
        fontFamily: "Arial, sans-serif",
        fontSize: 16,
        color: style.color ?? "#888",
      }}
    >
      {children}
    </p>
  );
}

export function Row({
  children,
  bg,
  pt,
  pb,
  pl,
  pr,
}: PropsWithChildren<{
  bg?: string;
  pt?: number | string;
  pb?: number | string;
  pl?: number | string;
  pr?: number | string;
}>) {
  return (
    <div
      style={{
        maxWidth: 600,
        margin: "0 auto",
        backgroundColor: bg,
      }}
    >
      <table
        style={{
          width: "100%",
        }}
      >
        <tbody>
          <tr>
            {Children.map(children, (column, i) => (
              <td
                key={i}
                style={{
                  padding: 20,
                  width: `${100 / Children.count(children)}%`,
                  paddingTop: pt,
                  paddingBottom: pb,
                  paddingLeft: pl,
                  paddingRight: pr,
                }}
              >
                {column}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function Background({ children }: PropsWithChildren) {
  return (
    <div
      style={{
        backgroundColor: "#ddd",
      }}
    >
      {children}
    </div>
  );
}

export function Spacing() {
  return <Row>&nbsp;</Row>;
}

export function Separator() {
  return (
    <Row bg="#fff">
      <hr
        style={{
          border: 0,
          borderTop: "2px dashed #ddd",
          margin: 0,
        }}
      />
    </Row>
  );
}

export function Link({
  href,
  target,
  children,
  ...style
}: PropsWithChildren<{ href?: string; target?: string } & CSSProperties>) {
  return (
    <a href={href} target={target} style={style}>
      {children}
    </a>
  );
}

export function Page({
  children,
  css,
}: PropsWithChildren<{ css?: string }>) {
  return (
    <html>
      <head>
        <style>{css}</style>
      </head>
      <body style={{ padding: 6, backgroundColor: "#e3e3e3" }}>{children}</body>
    </html>
  );
}

export function useRenderEmail({
  html,
  isLoading,
}: {
  html?: string;
  isLoading: boolean;
}) {
  const ref = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (!html) {
      return;
    }

    const doc = ref.current?.contentDocument;

    if (!doc) {
      return;
    }

    const htmlElement = document.body.parentElement;

    if (htmlElement) {
      htmlElement.dataset.theme = "light";
    }

    doc.open();
    doc.write(html);
    doc.close();

    return () => {
      if (htmlElement) {
        htmlElement.dataset.theme = "dark";
      }
    };
  }, [html]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (html == null) {
    return <p>No HTML</p>;
  }

  return <iframe ref={ref} className="w-screen h-screen" />;
}
