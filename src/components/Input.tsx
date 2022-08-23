import { InputHTMLAttributes } from "react";

type InputProps<T = HTMLInputElement> = {
  label: string;
  helper?: string;
} & InputHTMLAttributes<T>;

export function Input<T>({ label, helper, ...props }: InputProps<T>) {
  return (
    <div className="form-control w-full mb-4">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>

      <input {...props} className="input input-bordered w-full" />

      {helper && (
        <label className="label">
          <span className="label-text-alt"></span>
          <span className="label-text-alt">{helper}</span>
        </label>
      )}
    </div>
  );
}
