import { cn } from "~/utils";
import { IconProps } from "./Icons";

export function HeroIcon({
  className,
  icon,
  label,
}: {
  className?: string;
  icon: (props: IconProps) => JSX.Element;
  label?: string;
}) {
  const Icon = icon;

  return (
    <div
      className={cn(
        "hero-icon flex items-center justify-center w-18 aspect-square rounded-full relative",
        label && "mb-2",
        className
      )}
    >
      <Icon className="icon-2xl" />

      {label && (
        <div className="badge rounded-full font-bold text-xs absolute bottom-0 w-full left-1/2 -translate-x-1/2 transition-none">
          {label}
        </div>
      )}
    </div>
  );
}
