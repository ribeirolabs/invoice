import { createElement, InputHTMLAttributes, ReactNode } from "react";

type InputProps<T = HTMLInputElement> = {
  label: string;
  helper?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
} & InputHTMLAttributes<T>;

export function Input<T = HTMLInputElement>({
  label,
  helper,
  leading,
  trailing,
  ...props
}: InputProps<T>) {
  return (
    <div className="form-control w-full mb-4">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>

      <div className="input-group">
        {leading}
        {createElement(props.type === "textarea" ? "textarea" : "input", {
          ...props,
          className: "input input-bordered w-full",
        })}
        {trailing}
      </div>

      {helper && (
        <label className="label">
          <span className="label-text-alt"></span>
          <span className="label-text-alt">{helper}</span>
        </label>
      )}
    </div>
  );
}
