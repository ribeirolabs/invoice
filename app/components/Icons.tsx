import { HTMLAttributes } from "react";
import { cn } from "~/utils";

export type IconProps = HTMLAttributes<SVGElement> & {
  solid?: boolean;
};

function iconClass(className?: string): string {
  return cn("icon", className);
}

export function ArrowDownIcon({ className }: IconProps) {
  return (
    <svg fill="none" viewBox="0 0 24 24" className={iconClass(className)}>
      <g
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path d="M12 20V4" opacity=".28" />
        <path d="M6 14.17a30.23 30.23 0 0 0 5.406 5.62.949.949 0 0 0 1.188 0A30.232 30.232 0 0 0 18 14.17" />
      </g>
    </svg>
  );
}

export function ArrowRightIcon({ className }: IconProps) {
  return <ArrowDownIcon className={cn(className, "-rotate-90")} />;
}

export function ArrowLeftIcon({ className }: IconProps) {
  return <ArrowDownIcon className={cn(className, "rotate-90")} />;
}

export function DocumentPlusIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className={iconClass(className)}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 17v-3m0 0v-3m0 3H9m3 0h3"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M16 22H8a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4h4a8 8 0 0 1 8 8v8a4 4 0 0 1-4 4Z"
        opacity=".28"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 2a8 8 0 0 1 8 8v1a3 3 0 0 0-3-3h-.6c-.372 0-.557 0-.713-.025a2 2 0 0 1-1.662-1.662C14 6.157 14 5.972 14 5.6V5a3 3 0 0 0-3-3h1Z"
      />
    </svg>
  );
}

export function DocumentCheckIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className={iconClass(className)}
    >
      <path
        fill="currentColor"
        d="M8 1a5 5 0 0 0-5 5v12a5 5 0 0 0 5 5h8a5 5 0 0 0 5-5v-5.2c0-.857 0-1.439-.038-1.889-.035-.438-.1-.663-.18-.819a2 2 0 0 0-.874-.874c-.156-.08-.38-.145-.819-.18C18.639 9 18.057 9 17.2 9h-.038c-.528 0-.982 0-1.357-.03-.395-.033-.789-.104-1.167-.297a3 3 0 0 1-1.311-1.311c-.193-.378-.264-.772-.296-1.167C13 5.82 13 5.365 13 4.839V4.8c0-.857 0-1.439-.038-1.889-.035-.438-.1-.663-.18-.819a2 2 0 0 0-.874-.874c-.156-.08-.38-.145-.819-.18C10.639 1 10.057 1 9.2 1H8Z"
        opacity=".28"
      />
      <path
        fill="currentColor"
        d="M14.664 1.4c.175.423.253.869.292 1.348C15 3.29 15 3.954 15 4.758V4.8c0 .577 0 .949.024 1.232.022.272.06.373.085.422a1 1 0 0 0 .437.437c.05.025.15.063.422.085C16.25 7 16.623 7 17.2 7h.041c.805 0 1.47 0 2.01.044.48.04.926.117 1.348.292a9.02 9.02 0 0 0-5.935-5.935Z"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m8.5 14.666 2.341 2.339a14.984 14.984 0 0 1 4.558-4.936L15.5 12"
      />
    </svg>
  );
}

export function DocumentOutlineIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className={iconClass(className)}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M16 22H8a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4h4a8 8 0 0 1 8 8v8a4 4 0 0 1-4 4Z"
        opacity=".28"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 2a8 8 0 0 1 8 8v1a3 3 0 0 0-3-3h-.6c-.372 0-.557 0-.713-.025a2 2 0 0 1-1.662-1.662C14 6.157 14 5.972 14 5.6V5a3 3 0 0 0-3-3h1Z"
      />
    </svg>
  );
}

export function DocumentIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className={iconClass(className)}
    >
      <path
        fill="currentColor"
        d="M8 1a5 5 0 0 0-5 5v12a5 5 0 0 0 5 5h8a5 5 0 0 0 5-5v-5.2c0-.857 0-1.439-.038-1.889-.035-.438-.1-.663-.18-.819a2 2 0 0 0-.874-.874c-.156-.08-.38-.145-.819-.18C18.639 9 18.057 9 17.2 9h-.038c-.528 0-.982 0-1.357-.03-.395-.033-.789-.104-1.167-.297a3 3 0 0 1-1.311-1.311c-.193-.378-.264-.772-.296-1.167C13 5.82 13 5.365 13 4.839V4.8c0-.857 0-1.439-.038-1.889-.035-.438-.1-.663-.18-.819a2 2 0 0 0-.874-.874c-.156-.08-.38-.145-.819-.18C10.639 1 10.057 1 9.2 1H8Z"
        opacity=".28"
      />
      <path
        fill="currentColor"
        d="M14.664 1.4c.175.423.253.869.292 1.348C15 3.29 15 3.954 15 4.758V4.8c0 .577 0 .949.024 1.232.022.272.06.373.085.422a1 1 0 0 0 .437.437c.05.025.15.063.422.085C16.25 7 16.623 7 17.2 7h.041c.805 0 1.47 0 2.01.044.48.04.926.117 1.348.292a9.02 9.02 0 0 0-5.935-5.935Z"
      />
    </svg>
  );
}

export function DocumentCheckOutlineIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className={iconClass(className)}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M16 22H8a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4h4a8 8 0 0 1 8 8v8a4 4 0 0 1-4 4Z"
        opacity=".28"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 2a8 8 0 0 1 8 8v1a3 3 0 0 0-3-3h-.6c-.372 0-.557 0-.713-.025a2 2 0 0 1-1.662-1.662C14 6.157 14 5.972 14 5.6V5a3 3 0 0 0-3-3h1ZM8.5 14.666l2.341 2.339a14.984 14.984 0 0 1 4.558-4.936L15.5 12"
      />
    </svg>
  );
}

export function EmailIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className={iconClass(className)}
    >
      <path
        d="M22.948 8.905a.392.392 0 0 0-.608-.3l-5.668 3.607c-1.402.893-2.317 1.476-3.324 1.708a6.002 6.002 0 0 1-2.697 0c-1.006-.232-1.921-.815-3.323-1.708L1.66 8.605a.392.392 0 0 0-.608.3C1 9.73 1 10.702 1 11.872v.172c0 1.363 0 2.447.071 3.322.074.895.227 1.659.583 2.358a6 6 0 0 0 2.622 2.622c.7.356 1.463.51 2.359.583C7.509 21 8.593 21 9.956 21h4.088c1.363 0 2.447 0 3.321-.071.896-.074 1.66-.227 2.359-.583a6 6 0 0 0 2.622-2.622c.356-.7.51-1.463.583-2.358.071-.875.071-1.96.071-3.322v-.172c0-1.17 0-2.143-.052-2.967Z"
        opacity=".28"
        fill="currentColor"
      />
      <path
        fill="currentColor"
        d="M14.044 3H9.956c-1.363 0-2.447 0-3.321.071-.896.074-1.66.227-2.359.583a6 6 0 0 0-2.379 2.19.471.471 0 0 0 .16.644l6.185 3.935c1.62 1.03 2.23 1.403 2.859 1.548a3.998 3.998 0 0 0 1.798 0c.63-.145 1.24-.517 2.86-1.548l6.184-3.936a.471.471 0 0 0 .16-.643 6 6 0 0 0-2.379-2.19c-.7-.356-1.463-.51-2.359-.583C16.491 3 15.407 3 14.044 3Z"
      />
    </svg>
  );
}

export function EmailOutlineIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className={iconClass(className)}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M21.803 7.762C22 8.722 22 10.006 22 12c0 2.8 0 4.2-.545 5.27a5 5 0 0 1-2.185 2.185C18.2 20 16.8 20 14 20h-4c-2.8 0-4.2 0-5.27-.545a5 5 0 0 1-2.185-2.185C2 16.2 2 14.8 2 12c0-1.994 0-3.278.197-4.238"
        opacity=".28"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M14 4h-4c-2.8 0-4.2 0-5.27.545A5 5 0 0 0 2.545 6.73a4.006 4.006 0 0 0-.348 1.032l5.508 3.505h0c1.557.99 2.335 1.486 3.171 1.678a5 5 0 0 0 2.248 0c.836-.192 1.614-.688 3.171-1.678l5.508-3.505a4.003 4.003 0 0 0-.348-1.032 5 5 0 0 0-2.185-2.185C18.2 4 16.8 4 14 4Z"
      />
    </svg>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className={iconClass(className)}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m5 12.713 5.017 5.012.4-.701a28.598 28.598 0 0 1 8.7-9.42L20 7"
      />
    </svg>
  );
}

export function CheckCircleIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className={iconClass(className)}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M16 3.936a9 9 0 1 0 4.842 6.376"
        opacity=".28"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m8.073 11.012 4.013 4.01a21.935 21.935 0 0 1 8.692-9.393L21 5.5"
      />
    </svg>
  );
}

export function SendIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className={iconClass(className)}
    >
      <path
        fill="currentColor"
        d="M2.13 6.015c-.703-2.391 1.538-4.632 3.93-3.863a54.874 54.874 0 0 1 12.875 6.073c.112.072.244.152.387.24.45.272 1.016.616 1.46 1.005C21.43 10.039 22 10.843 22 12c0 1.157-.57 1.961-1.219 2.53-.443.39-1.01.733-1.459 1.006a18.84 18.84 0 0 0-.387.239 54.875 54.875 0 0 1-12.874 6.074c-2.393.768-4.634-1.473-3.93-3.864l1.255-4.267a1 1 0 0 1 .96-.718h5.489a1 1 0 1 0 0-2h-5.49a1 1 0 0 1-.959-.718L2.131 6.015Z"
        opacity=".28"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M13 17.975a53.921 53.921 0 0 0 5.395-3.042C19.526 14.207 21 13.558 21 12c0-1.558-1.474-2.207-2.605-2.933A53.934 53.934 0 0 0 13 6.025"
      />
    </svg>
  );
}

export function SendOutlineIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className={iconClass(className)}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4.934 12 3.09 5.732c-.481-1.635 1.05-3.147 2.665-2.628a53.872 53.872 0 0 1 12.64 5.963C19.525 9.793 21 10.442 21 12c0 1.558-1.474 2.207-2.605 2.933a53.87 53.87 0 0 1-12.64 5.963c-1.614.519-3.146-.993-2.665-2.628L4.934 12Zm0 0h4.9"
        opacity=".28"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4.934 12h4.9m8.56-2.933C19.527 9.793 21 10.442 21 12c0 1.558-1.474 2.207-2.605 2.933"
      />
    </svg>
  );
}

export function AtIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className={iconClass(className)}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M21 12a9 9 0 1 0-9 9c1.052 0 2.062-.18 3-.512"
        opacity=".28"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M16 8v5.5a2.5 2.5 0 0 0 2.5 2.5c2.18 0 2.5-2.267 2.5-4m-5 0a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
      />
    </svg>
  );
}

export function TrashIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className={iconClass(className)}
    >
      <path
        fill="currentColor"
        d="M6 5a1 1 0 0 0-1 1v9.036c0 .901 0 1.629.04 2.22.042.61.13 1.148.34 1.657a5 5 0 0 0 2.707 2.706c.51.212 1.048.3 1.656.34.592.041 1.32.041 2.221.041h.072c.901 0 1.629 0 2.22-.04.61-.042 1.148-.13 1.657-.34a5 5 0 0 0 2.706-2.707c.212-.51.3-1.048.34-1.656.041-.592.041-1.32.041-2.222V6a1 1 0 0 0-1-1H6Z"
        opacity=".28"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m16 6-1.106-2.211a3.236 3.236 0 0 0-5.788 0L8 6M4 6h16"
      />
    </svg>
  );
}

export function CalendarIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className={iconClass(className)}
    >
      <path
        fill="currentColor"
        d="M11.916 3c-1.755 0-3.042 0-4.05.137a6.127 6.127 0 0 0-1.545.396A7 7 0 0 0 2.533 7.32c-.318.768-.439 1.605-.491 2.628C2 10.762 2 11.75 2 12.974v.063c0 1.366 0 2.443.06 3.314.06.888.186 1.634.473 2.328a7 7 0 0 0 3.788 3.788c.694.287 1.44.413 2.328.474.87.059 1.948.059 3.314.059h.074c1.366 0 2.443 0 3.314-.06.888-.06 1.634-.186 2.328-.473a7 7 0 0 0 3.788-3.788c.287-.694.413-1.44.474-2.328.059-.87.059-1.947.059-3.314v-.063c0-1.223 0-2.212-.042-3.025-.052-1.023-.173-1.86-.49-2.628a7 7 0 0 0-3.79-3.788 6.126 6.126 0 0 0-1.544-.396C15.127 3 13.84 3 12.084 3h-.168Z"
        opacity=".28"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M8 2v3m8-3v3m4.96 5H3.04"
      />
    </svg>
  );
}

export function CalendarOutlineIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className={iconClass(className)}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M3 13c0-1.245 0-2.212.04-3 .05-.982.163-1.684.417-2.296a6 6 0 0 1 3.247-3.247A5.135 5.135 0 0 1 8 4.127C8.941 4 10.172 4 12 4c1.828 0 3.059 0 4 .128.498.067.915.17 1.296.329a6 6 0 0 1 3.247 3.247c.254.612.367 1.314.417 2.296.04.788.04 1.755.04 3 0 2.796 0 4.194-.457 5.296a6 6 0 0 1-3.247 3.247C16.194 22 14.796 22 12 22c-2.796 0-4.193 0-5.296-.457a6 6 0 0 1-3.247-3.247C3 17.194 3 15.796 3 13Z"
        opacity=".28"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M8 2v4m8-4v4m4.96 4H3.04m4.97 4H8m.01 4H8m4.01-4H12m.01 4H12m4.01-4H16m.01 4H16"
      />
    </svg>
  );
}

export function LoginIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className={iconClass(className)}
    >
      <g
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path d="M13 4.528A6 6 0 0 0 3 9v6a6 6 0 0 0 10 4.472" opacity=".28" />
        <path d="M10.812 9a15.002 15.002 0 0 0-2.655 2.556A.703.703 0 0 0 8 12m2.812 3a15 15 0 0 1-2.655-2.556A.703.703 0 0 1 8 12m0 0h13" />
      </g>
    </svg>
  );
}

export function LogoutIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className={iconClass(className)}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M13 4.528A6 6 0 0 0 3 9v6a6 6 0 0 0 10 4.472"
        opacity=".28"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M18.189 9a15 15 0 0 1 2.654 2.556c.105.13.157.287.157.444m-2.811 3a14.998 14.998 0 0 0 2.654-2.556A.704.704 0 0 0 21 12m0 0H8"
      />
    </svg>
  );
}

export function SparkleIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className={iconClass(className)}
    >
      <path
        fill="currentColor"
        d="M6.687 2.837a1 1 0 0 0-1.974 0c-.1.608-.32 1.015-.598 1.29-.279.277-.686.489-1.278.586a1 1 0 0 0 0 1.974c.608.1 1.015.32 1.29.598.277.279.489.686.586 1.278a1 1 0 0 0 1.974 0c.097-.592.31-1 .586-1.279.275-.278.682-.497 1.29-.597a1 1 0 0 0 0-1.974c-.608-.1-1.015-.32-1.29-.598-.277-.279-.489-.686-.586-1.278ZM6 17.65a1 1 0 1 0-2 0V18h-.35a1 1 0 1 0 0 2H4v.35a1 1 0 1 0 2 0V20h.35a1 1 0 1 0 0-2H6v-.35Z"
        opacity=".28"
      />
      <path
        fill="currentColor"
        d="M13.892 2.874a1 1 0 0 0-1.984 0c-.322 2.534-1.006 4.36-2.118 5.642-1.098 1.265-2.714 2.115-5.145 2.496a1 1 0 0 0 0 1.976c2.431.381 4.047 1.231 5.145 2.496 1.112 1.281 1.796 3.108 2.118 5.642a1 1 0 0 0 1.984 0c.322-2.534 1.006-4.36 2.118-5.642 1.098-1.265 2.714-2.115 5.145-2.496a1 1 0 0 0 0-1.976c-2.563-.402-4.181-1.306-5.248-2.585-1.086-1.304-1.706-3.12-2.015-5.553Z"
      />
    </svg>
  );
}

export function UserCircleIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className={iconClass(className)}
    >
      <path
        fill="currentColor"
        d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1Z"
        opacity=".28"
      />
      <path
        fill="currentColor"
        d="M19.386 17.144C18.598 15.85 17.135 15 15.5 15h-7c-1.634 0-3.097.85-3.886 2.144A8.99 8.99 0 0 0 12 21a8.99 8.99 0 0 0 7.386-3.856ZM12 6.25a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5Z"
      />
    </svg>
  );
}

export function PlusIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className={iconClass(className)}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 19v-7m0 0V5m0 7H5m7 0h7"
      />
    </svg>
  );
}

export function DownloadIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className={iconClass(className)}
    >
      <path
        fill="currentColor"
        d="M4 15a1 1 0 1 0-2 0 6 6 0 0 0 6 6h8a6 6 0 0 0 6-6 1 1 0 1 0-2 0 4 4 0 0 1-4 4H8a4 4 0 0 1-4-4Z"
        opacity=".28"
      />
      <path
        fill="currentColor"
        d="M13 4a1 1 0 1 0-2 0v7.322a29.033 29.033 0 0 1-1.9-.128 1 1 0 0 0-.9 1.595 16 16 0 0 0 2.727 2.83 1.703 1.703 0 0 0 2.146 0 15.997 15.997 0 0 0 2.727-2.83 1 1 0 0 0-.9-1.595 29.46 29.46 0 0 1-1.9.128V4Z"
      />
    </svg>
  );
}

export function ChevronDownIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className={iconClass(className)}
    >
      <path
        fill="currentColor"
        d="M12.925 14.673a21.354 21.354 0 0 0 3.88-4.08 1 1 0 0 0-.881-1.59 51.713 51.713 0 0 1-7.848 0 1 1 0 0 0-.882 1.59 21.353 21.353 0 0 0 3.881 4.08 1.472 1.472 0 0 0 1.85 0Z"
      />
    </svg>
  );
}

export function CompaniesIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className={iconClass(className)}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M6.161 1c-.527 0-.981 0-1.356.03-.395.033-.789.104-1.167.297a3 3 0 0 0-1.311 1.311c-.193.378-.264.772-.296 1.167C2 4.18 2 4.635 2 5.161v15.27c0 .253 0 .5.017.707.019.229.063.499.201.77a2 2 0 0 0 .874.874c.271.138.541.182.77.201.208.017.454.017.706.017h14.864c.252 0 .498 0 .706-.017a2.03 2.03 0 0 0 .77-.201 2 2 0 0 0 .874-.874 2.03 2.03 0 0 0 .201-.77c.017-.208.017-.454.017-.706v-7.27c0-.528 0-.982-.03-1.357-.033-.395-.104-.789-.297-1.167a3 3 0 0 0-1.311-1.311c-.378-.193-.772-.264-1.167-.296A17.9 17.9 0 0 0 17.838 9H15V5.161c0-.527 0-.981-.03-1.356-.033-.395-.104-.789-.297-1.167a3 3 0 0 0-1.311-1.311c-.378-.193-.772-.264-1.167-.296C11.82 1 11.365 1 10.839 1H6.16ZM19.4 21h-4.408c.008-.175.008-.37.008-.568V11h2.8c.577 0 .949 0 1.232.024.272.022.372.06.422.085a1 1 0 0 1 .437.437c.025.05.063.15.085.422.023.283.024.655.024 1.232v7.2c0 .297 0 .459-.01.575l-.001.014h-.014c-.116.01-.279.011-.575.011Z"
        clipRule="evenodd"
        opacity=".28"
      />
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M5.75 6a1 1 0 0 1 1-1h3.5a1 1 0 1 1 0 2h-3.5a1 1 0 0 1-1-1Zm0 4a1 1 0 0 1 1-1h3.5a1 1 0 1 1 0 2h-3.5a1 1 0 0 1-1-1Zm0 4a1 1 0 0 1 1-1h3.5a1 1 0 1 1 0 2h-3.5a1 1 0 0 1-1-1ZM16 14a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2h-1a1 1 0 0 1-1-1ZM5.75 18a1 1 0 0 1 1-1h3.5a1 1 0 1 1 0 2h-3.5a1 1 0 0 1-1-1ZM16 18a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2h-1a1 1 0 0 1-1-1Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function CompaniesOutlineIcon({ className, solid }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className={iconClass(className)}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12.4 22c.56 0 .84 0 1.054-.109a1 1 0 0 0 .437-.437C14 21.24 14 20.96 14 20.4V10m-1.6 12h7c.56 0 .84 0 1.054-.109a1 1 0 0 0 .437-.437C21 21.24 21 20.96 21 20.4v-7.2c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C19.48 10 18.92 10 17.8 10H14m-1.6 12H4.6c-.56 0-.84 0-1.054-.109a1 1 0 0 1-.437-.437C3 21.24 3 20.96 3 20.4V5.2c0-1.12 0-1.68.218-2.108a2 2 0 0 1 .874-.874C4.52 2 5.08 2 6.2 2h4.6c1.12 0 1.68 0 2.108.218a2 2 0 0 1 .874.874C14 3.52 14 4.08 14 5.2V10"
        opacity={solid ? 1 : 0.28}
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M17 14h1m-1 4h1M7 6h3m-3 4h3m-3 4h3m-3 4h3"
      />
    </svg>
  );
}

export function PencilIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className={iconClass(className)}
    >
      <path
        fill="currentColor"
        d="M19.37 2.411a2.568 2.568 0 0 0-3.216.346L3.052 15.917c-.216.217-.428.428-.586.684a2.6 2.6 0 0 0-.309.722c-.075.291-.082.59-.089.898L2 20.97a1 1 0 0 0 .998 1.024l2.8.005c.316.001.627.002.93-.07.265-.064.518-.17.75-.312.265-.163.484-.384.707-.609L21.216 7.921l.072-.073a2.601 2.601 0 0 0 .321-3.16 7.35 7.35 0 0 0-2.24-2.277Z"
        opacity=".28"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M5.727 21 3 20.996l.066-2.68M20.501 7.221l.061-.062a1.6 1.6 0 0 0 .197-1.944 6.35 6.35 0 0 0-1.932-1.965 1.569 1.569 0 0 0-1.965.212"
      />
    </svg>
  );
}

export function LinkSlantIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className={iconClass(className)}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m10.586 6.343.707-.707a5 5 0 1 1 7.071 7.071l-.707.707M6.343 10.586l-.707.707a5 5 0 1 0 7.071 7.071l.707-.707"
        opacity=".28"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M14.121 9.879 9.88 14.12"
      />
    </svg>
  );
}

export function HamburgerIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className={iconClass(className)}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 12h16M4 18h16M4 6h16"
      />
    </svg>
  );
}

export function CancelIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className={iconClass(className)}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m6 18 6-6m0 0 6-6m-6 6L6 6m6 6 6 6"
      />
    </svg>
  );
}

export function DocumentPdfIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className={iconClass(className)}
    >
      <path
        fill="currentColor"
        d="M13 3.241v-2.24L12.463 1h-2.106C9.273 1 8.4 1 7.691 1.058c-.728.06-1.369.185-1.96.487A5 5 0 0 0 3.544 3.73c-.302.592-.428 1.233-.487 1.961C3 6.4 3 7.273 3 8.357V11h18V9.537L20.999 9h-2.24c-.805 0-1.47 0-2.01-.044-.563-.046-1.08-.145-1.565-.392a4 4 0 0 1-1.748-1.748c-.247-.485-.346-1.002-.392-1.564C13 4.71 13 4.046 13 3.242Z"
        opacity=".28"
      />
      <path
        fill="currentColor"
        d="M15 1.282V3.2c0 .856 0 1.439.038 1.889.035.438.1.662.18.819a2 2 0 0 0 .874.874c.156.08.38.144.819.18C17.361 7 17.943 7 18.8 7h1.918a4.995 4.995 0 0 0-.455-.956c-.31-.506-.735-.931-1.35-1.545L17.5 3.085c-.614-.614-1.038-1.038-1.544-1.348A4.996 4.996 0 0 0 15 1.282Z"
      />
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M3 13a1 1 0 0 0-1 1v7a1 1 0 1 0 2 0v-1h.5a3.5 3.5 0 1 0 0-7H3Zm1.5 5H4v-3h.5a1.5 1.5 0 0 1 0 3Zm5.5-5a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h.5a4.5 4.5 0 1 0 0-9H10Zm3 4.5a2.5 2.5 0 0 1-2 2.45v-4.9a2.5 2.5 0 0 1 2 2.45Z"
        clip-rule="evenodd"
      />
      <path
        fill="currentColor"
        d="M17 13a1 1 0 0 0-1 1v7a1 1 0 1 0 2 0v-2h3a1 1 0 1 0 0-2h-3v-2h3a1 1 0 1 0 0-2h-4Z"
      />
    </svg>
  );
}

export function DocumentPdfOutlineIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className={iconClass(className)}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4 10V8.4c0-2.24 0-3.36.436-4.216a4 4 0 0 1 1.748-1.748C7.04 2 8.16 2 10.4 2h1.949c.978 0 1.468 0 1.928.11.408.099.798.26 1.156.48.404.247.75.593 1.442 1.285l1.25 1.25c.692.692 1.038 1.038 1.286 1.442a4 4 0 0 1 .479 1.156c.11.46.11.95.11 1.928V10"
        opacity=".28"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M3 19v-5h1.5a2.5 2.5 0 0 1 0 5H3Zm0 0v2m14-3v-4h4m-4 4v3m0-3h4m-11-4v7h.5a3.5 3.5 0 1 0 0-7H10Zm8.125-8.874-1.25-1.251c-.692-.692-1.038-1.038-1.442-1.285a3.998 3.998 0 0 0-1.156-.48A3.094 3.094 0 0 0 14 2.059V3.2c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C16.28 8 17.12 8 18.8 8h1.142a3.11 3.11 0 0 0-.052-.277 4 4 0 0 0-.48-1.156c-.247-.404-.593-.75-1.285-1.441Z"
      />
    </svg>
  );
}

export function ArrowTurnLeftDownIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className={iconClass(className)}
    >
      <g
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path
          d="M9.5 20v-8c0-2.8 0-4.2.545-5.27a5 5 0 0 1 2.185-2.185C13.3 4 14.7 4 17.5 4h3"
          opacity=".28"
        />
        <path d="M4.5 15.142a25.196 25.196 0 0 0 4.505 4.684.79.79 0 0 0 .99 0 25.198 25.198 0 0 0 4.505-4.684" />
      </g>
    </svg>
  );
}
