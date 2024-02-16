import { ReactNode } from "react";
import { Card } from "./Card";
import { IconProps } from "./Icons";

export function EmptyState({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description?: string;
  icon: (props: IconProps) => JSX.Element;
  children?: ReactNode;
}) {
  const Icon = icon;

  return (
    <div className="relative overflow-hidden col-span-2">
      <Circles />

      <Card className="grid place-items-center gap-2 p-4 bg-gradient-to-tl to-black/40 from-secondary/15 border border-white/15 text-white">
        <Icon className="w-18" />

        <div className="text-center">
          <h3 className="font-bold">{title}</h3>
          {description && <p>{description}</p>}
        </div>

        {children}
      </Card>
    </div>
  );
}

function Circles() {
  return (
    <>
      {Array.from({ length: 6 }, (_, i) => (
        <div
          key={i}
          className="z-0 bg-base-content/30 pointer-events-none rounded-full aspect-square border border-white absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-12 shadow-black shadow-xl"
          style={{
            width: 120 * (i + 1),
            opacity: 0.06 / (i + 1),
          }}
        />
      ))}
    </>
  );
}
