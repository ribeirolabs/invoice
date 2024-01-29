import { cn } from "~/utils";

export function LoginIcon({ className }: { className?: string }) {
  return (
    <svg fill="none" viewBox="0 0 24 24" className={cn("w-6 h-6", className)}>
      <g
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
      >
        <path d="M13 4.528A6 6 0 0 0 3 9v6a6 6 0 0 0 10 4.472" opacity=".28" />
        <path d="M10.812 9a15.002 15.002 0 0 0-2.655 2.556A.703.703 0 0 0 8 12m2.812 3a15 15 0 0 1-2.655-2.556A.703.703 0 0 1 8 12m0 0h13" />
      </g>
    </svg>
  );
}
