import { cn } from "~/utils";

export function Logo({
  variant = "responsive",
  className,
}: {
  variant?: "responsive" | "full" | "short";
  className?: string;
}) {
  return (
    <a href="/" className={cn("text-xl", className)}>
      {variant !== "short" && (
        <span
          className={cn(
            "text-neutral-400",
            variant === "responsive" && "hidden sm:inline-block"
          )}
        >
          ribeirolabs
        </span>
      )}

      {variant !== "full" && (
        <span
          className={cn(
            "text-neutral-400",
            variant === "responsive" && "sm:hidden"
          )}
        >
          r
        </span>
      )}

      <span className="font-bold text-primary"> / invoice</span>
    </a>
  );
}
