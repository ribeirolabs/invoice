import { ReactNode } from "react";
import { IconProps } from "./Icons";

export function FormPage({
  children,
  title,
  icon,
}: {
  children: ReactNode;
  title: string;
  icon: (props: IconProps) => JSX.Element;
}) {
  const Icon = icon;

  return (
    <div className="max-content p-3 !max-w-xl mt-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex gap-2 items-end leading-none">
          <Icon className="icon-lg" /> {title}
        </h1>
        <div className="divider" />
      </div>

      {children}
    </div>
  );
}
