import { ReactNode } from "react";
import { useField } from "remix-validated-form";
import { cn } from "~/utils";

export function InputGroup({
  children,
  label,
  name,
  helper,
  className,
}: {
  children: ReactNode;
  label: string;
  name: string;
  helper?: string;
  className?: string;
}) {
  const { error } = useField(name);
  return (
    <label
      className={cn("form-control w-full group", className)}
      aria-invalid={Boolean(error)}
    >
      <div className="label">
        <span className="label-text font-bold">{label}</span>
        {helper && <span className="label-text">{helper}</span>}
      </div>

      {children}

      {error && <div className="label-text text-error mt-1">{error}</div>}
    </label>
  );
}
