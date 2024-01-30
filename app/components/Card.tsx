import { ReactNode } from "react";
import { cn } from "~/utils";

export function Card({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "p-1 light:bg-neutral-100 bg-neutral-700/40 rounded light:shadow-lg shadow-black/20 shadow-none",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardContent({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={cn("light:bg-white bg-neutral-800 p-3 rounded", className)}>
      {children}
    </div>
  );
}

export function CardFooter({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return <div className={cn("py-2 px-1", className)}>{children}</div>;
}

Card.Content = CardContent;
Card.Footer = CardFooter;
