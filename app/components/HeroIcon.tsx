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
    <div className={cn("hero-icon flex flex-col items-center", className)}>
      <div
        className={cn(
          "flex items-center justify-center w-18 aspect-square rounded-full relative",
          label && "mb-2"
        )}
      >
        <Icon className="icon-2xl" />
      </div>

      {label && (
        <div className="badge rounded-full font-bold text-xs -absolute bottom-0 min-w-full -translate-y-[100%] transition-none">
          {label}
        </div>
      )}
    </div>
  );
}
