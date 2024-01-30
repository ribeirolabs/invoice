import { cn } from "~/utils";

export function Logo({
  variant = "responsive",
}: {
  variant?: "responsive" | "full" | "short";
}) {
  return (
    <a href="/" className="text-xl">
      {variant !== "short" && (
        <span
          className={cn(
            "text-neutral-400",
            variant === "responsive" && "hidden md:inline-block"
          )}
        >
          ribeirolabs
        </span>
      )}

      {variant !== "full" && (
        <span
          className={cn(
            "text-neutral-400",
            variant === "responsive" && "md:hidden"
          )}
        >
          r
        </span>
      )}

      <span className="font-bold text-primary"> / invoice</span>
    </a>
  );
}