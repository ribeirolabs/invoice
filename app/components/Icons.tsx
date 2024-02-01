import { HTMLAttributes } from "react";
import { cn } from "~/utils";

export type IconProps = HTMLAttributes<SVGElement>;

function iconClass(className?: string): string {
  return cn("icon", className);
}

export function ArrowDownIcon({ className }: IconProps) {
  return (
    <svg fill="none" viewBox="0 0 24 24" className={iconClass(className)}>
      <g
        className="stroke-current"
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

export function DocumentPlusIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className={iconClass(className)}
    >
      <path
        className="stroke-current"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 17v-3m0 0v-3m0 3H9m3 0h3"
      />
      <path
        className="stroke-current"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M16 22H8a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4h4a8 8 0 0 1 8 8v8a4 4 0 0 1-4 4Z"
        opacity=".28"
      />
      <path
        className="stroke-current"
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
        className="fill-current"
        d="M8 1a5 5 0 0 0-5 5v12a5 5 0 0 0 5 5h8a5 5 0 0 0 5-5v-5.2c0-.857 0-1.439-.038-1.889-.035-.438-.1-.663-.18-.819a2 2 0 0 0-.874-.874c-.156-.08-.38-.145-.819-.18C18.639 9 18.057 9 17.2 9h-.038c-.528 0-.982 0-1.357-.03-.395-.033-.789-.104-1.167-.297a3 3 0 0 1-1.311-1.311c-.193-.378-.264-.772-.296-1.167C13 5.82 13 5.365 13 4.839V4.8c0-.857 0-1.439-.038-1.889-.035-.438-.1-.663-.18-.819a2 2 0 0 0-.874-.874c-.156-.08-.38-.145-.819-.18C10.639 1 10.057 1 9.2 1H8Z"
        opacity=".28"
      />
      <path
        className="fill-current"
        d="M14.664 1.4c.175.423.253.869.292 1.348C15 3.29 15 3.954 15 4.758V4.8c0 .577 0 .949.024 1.232.022.272.06.373.085.422a1 1 0 0 0 .437.437c.05.025.15.063.422.085C16.25 7 16.623 7 17.2 7h.041c.805 0 1.47 0 2.01.044.48.04.926.117 1.348.292a9.02 9.02 0 0 0-5.935-5.935Z"
      />
      <path
        className="stroke-current"
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
        className="stroke-current"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M16 22H8a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4h4a8 8 0 0 1 8 8v8a4 4 0 0 1-4 4Z"
        opacity=".28"
      />
      <path
        className="stroke-current"
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
        className="fill-current"
        d="M8 1a5 5 0 0 0-5 5v12a5 5 0 0 0 5 5h8a5 5 0 0 0 5-5v-5.2c0-.857 0-1.439-.038-1.889-.035-.438-.1-.663-.18-.819a2 2 0 0 0-.874-.874c-.156-.08-.38-.145-.819-.18C18.639 9 18.057 9 17.2 9h-.038c-.528 0-.982 0-1.357-.03-.395-.033-.789-.104-1.167-.297a3 3 0 0 1-1.311-1.311c-.193-.378-.264-.772-.296-1.167C13 5.82 13 5.365 13 4.839V4.8c0-.857 0-1.439-.038-1.889-.035-.438-.1-.663-.18-.819a2 2 0 0 0-.874-.874c-.156-.08-.38-.145-.819-.18C10.639 1 10.057 1 9.2 1H8Z"
        opacity=".28"
      />
      <path
        className="fill-current"
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
        className="stroke-current"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M16 22H8a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4h4a8 8 0 0 1 8 8v8a4 4 0 0 1-4 4Z"
        opacity=".28"
      />
      <path
        className="stroke-current"
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
        className="fill-current"
      />
      <path
        className="fill-current"
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
        className="stroke-current"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M21.803 7.762C22 8.722 22 10.006 22 12c0 2.8 0 4.2-.545 5.27a5 5 0 0 1-2.185 2.185C18.2 20 16.8 20 14 20h-4c-2.8 0-4.2 0-5.27-.545a5 5 0 0 1-2.185-2.185C2 16.2 2 14.8 2 12c0-1.994 0-3.278.197-4.238"
        opacity=".28"
      />
      <path
        className="stroke-current"
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
        className="stroke-current"
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
        className="stroke-current"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M16 3.936a9 9 0 1 0 4.842 6.376"
        opacity=".28"
      />
      <path
        className="stroke-current"
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
        className="fill-current"
        d="M2.13 6.015c-.703-2.391 1.538-4.632 3.93-3.863a54.874 54.874 0 0 1 12.875 6.073c.112.072.244.152.387.24.45.272 1.016.616 1.46 1.005C21.43 10.039 22 10.843 22 12c0 1.157-.57 1.961-1.219 2.53-.443.39-1.01.733-1.459 1.006a18.84 18.84 0 0 0-.387.239 54.875 54.875 0 0 1-12.874 6.074c-2.393.768-4.634-1.473-3.93-3.864l1.255-4.267a1 1 0 0 1 .96-.718h5.489a1 1 0 1 0 0-2h-5.49a1 1 0 0 1-.959-.718L2.131 6.015Z"
        opacity=".28"
      />
      <path
        className="stroke-current"
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
        className="stroke-current"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M4.934 12 3.09 5.732c-.481-1.635 1.05-3.147 2.665-2.628a53.872 53.872 0 0 1 12.64 5.963C19.525 9.793 21 10.442 21 12c0 1.558-1.474 2.207-2.605 2.933a53.87 53.87 0 0 1-12.64 5.963c-1.614.519-3.146-.993-2.665-2.628L4.934 12Zm0 0h4.9"
        opacity=".28"
      />
      <path
        className="stroke-current"
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
        className="stroke-current"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M21 12a9 9 0 1 0-9 9c1.052 0 2.062-.18 3-.512"
        opacity=".28"
      />
      <path
        className="stroke-current"
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
        className="fill-current"
        d="M6 5a1 1 0 0 0-1 1v9.036c0 .901 0 1.629.04 2.22.042.61.13 1.148.34 1.657a5 5 0 0 0 2.707 2.706c.51.212 1.048.3 1.656.34.592.041 1.32.041 2.221.041h.072c.901 0 1.629 0 2.22-.04.61-.042 1.148-.13 1.657-.34a5 5 0 0 0 2.706-2.707c.212-.51.3-1.048.34-1.656.041-.592.041-1.32.041-2.222V6a1 1 0 0 0-1-1H6Z"
        opacity=".28"
      />
      <path
        className="stroke-current"
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
        className="fill-current"
        d="M11.916 3c-1.755 0-3.042 0-4.05.137a6.127 6.127 0 0 0-1.545.396A7 7 0 0 0 2.533 7.32c-.318.768-.439 1.605-.491 2.628C2 10.762 2 11.75 2 12.974v.063c0 1.366 0 2.443.06 3.314.06.888.186 1.634.473 2.328a7 7 0 0 0 3.788 3.788c.694.287 1.44.413 2.328.474.87.059 1.948.059 3.314.059h.074c1.366 0 2.443 0 3.314-.06.888-.06 1.634-.186 2.328-.473a7 7 0 0 0 3.788-3.788c.287-.694.413-1.44.474-2.328.059-.87.059-1.947.059-3.314v-.063c0-1.223 0-2.212-.042-3.025-.052-1.023-.173-1.86-.49-2.628a7 7 0 0 0-3.79-3.788 6.126 6.126 0 0 0-1.544-.396C15.127 3 13.84 3 12.084 3h-.168Z"
        opacity=".28"
      />
      <path
        className="stroke-current"
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
        className="stroke-current"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M3 13c0-1.245 0-2.212.04-3 .05-.982.163-1.684.417-2.296a6 6 0 0 1 3.247-3.247A5.135 5.135 0 0 1 8 4.127C8.941 4 10.172 4 12 4c1.828 0 3.059 0 4 .128.498.067.915.17 1.296.329a6 6 0 0 1 3.247 3.247c.254.612.367 1.314.417 2.296.04.788.04 1.755.04 3 0 2.796 0 4.194-.457 5.296a6 6 0 0 1-3.247 3.247C16.194 22 14.796 22 12 22c-2.796 0-4.193 0-5.296-.457a6 6 0 0 1-3.247-3.247C3 17.194 3 15.796 3 13Z"
        opacity=".28"
      />
      <path
        className="stroke-current"
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
        className="stroke-current"
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
        className="stroke-current"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M13 4.528A6 6 0 0 0 3 9v6a6 6 0 0 0 10 4.472"
        opacity=".28"
      />
      <path
        className="stroke-current"
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
        className="fill-current"
        d="M6.687 2.837a1 1 0 0 0-1.974 0c-.1.608-.32 1.015-.598 1.29-.279.277-.686.489-1.278.586a1 1 0 0 0 0 1.974c.608.1 1.015.32 1.29.598.277.279.489.686.586 1.278a1 1 0 0 0 1.974 0c.097-.592.31-1 .586-1.279.275-.278.682-.497 1.29-.597a1 1 0 0 0 0-1.974c-.608-.1-1.015-.32-1.29-.598-.277-.279-.489-.686-.586-1.278ZM6 17.65a1 1 0 1 0-2 0V18h-.35a1 1 0 1 0 0 2H4v.35a1 1 0 1 0 2 0V20h.35a1 1 0 1 0 0-2H6v-.35Z"
        opacity=".28"
      />
      <path
        className="fill-current"
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
        className="fill-current"
        d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1Z"
        opacity=".28"
      />
      <path
        className="fill-current"
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
        className="stroke-current"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
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
        className="fill-current"
        d="M4 15a1 1 0 1 0-2 0 6 6 0 0 0 6 6h8a6 6 0 0 0 6-6 1 1 0 1 0-2 0 4 4 0 0 1-4 4H8a4 4 0 0 1-4-4Z"
        opacity=".28"
      />
      <path
        className="fill-current"
        d="M13 4a1 1 0 1 0-2 0v7.322a29.033 29.033 0 0 1-1.9-.128 1 1 0 0 0-.9 1.595 16 16 0 0 0 2.727 2.83 1.703 1.703 0 0 0 2.146 0 15.997 15.997 0 0 0 2.727-2.83 1 1 0 0 0-.9-1.595 29.46 29.46 0 0 1-1.9.128V4Z"
      />
    </svg>
  );
}
