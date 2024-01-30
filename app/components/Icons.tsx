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

export function StarIcon({ className }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className={iconClass(className)}
    >
      <path
        className="fill-current"
        d="M19.408 2.065a1.32 1.32 0 0 0-.816 0 1.325 1.325 0 0 0-.45.257 3.516 3.516 0 0 0-.2.189l-.431.432a3.462 3.462 0 0 0-.19.2 1.325 1.325 0 0 0-.256.449 1.308 1.308 0 0 0 .257 1.266c.062.073.137.148.189.2l.431.431c.052.052.127.127.2.19a1.308 1.308 0 0 0 1.716-.001c.073-.062.148-.137.2-.189l.431-.432c.052-.051.127-.126.19-.2a1.309 1.309 0 0 0 .256-1.265 1.325 1.325 0 0 0-.257-.45 3.458 3.458 0 0 0-.189-.2l-.431-.431c-.052-.052-.127-.127-.2-.19a1.325 1.325 0 0 0-.45-.256Zm.166 13.048a1.52 1.52 0 0 0-1.148 0c-.27.11-.456.285-.575.411-.11.117-.228.264-.339.403l-.833 1.042-.055.067c-.193.24-.456.565-.56.965a1.992 1.992 0 0 0 0 .998c.104.4.367.726.56.965l.055.067.833 1.042c.111.139.229.286.34.403.118.126.304.302.574.411.37.15.778.15 1.148 0 .27-.11.456-.285.575-.411.11-.117.228-.264.339-.403l.833-1.042.054-.067c.194-.239.457-.565.561-.965a1.992 1.992 0 0 0 0-.998c-.104-.4-.367-.726-.56-.965l-.055-.067-.833-1.042a6.833 6.833 0 0 0-.34-.403 1.639 1.639 0 0 0-.574-.411Z"
        opacity=".28"
      />
      <path
        className="fill-current"
        d="M10.848 3.374a2 2 0 0 0-1.697 0c-.423.198-.685.552-.862.83-.178.28-.368.65-.58 1.063L6.496 7.621a5.962 5.962 0 0 1-.08.153l-.002.002-.002.001a5.984 5.984 0 0 1-.149.088L3.842 9.273c-.36.21-.687.4-.937.577-.254.18-.566.44-.743.839a2 2 0 0 0 0 1.622c.177.4.489.659.743.84.25.177.577.367.937.576l2.422 1.408.15.088h.001l.001.003c.017.03.038.07.08.153l1.212 2.354c.213.413.403.782.581 1.063.177.278.44.632.862.83a2 2 0 0 0 1.697 0c.423-.198.686-.552.862-.83.179-.28.369-.65.582-1.063l1.211-2.354.08-.153.002-.002.002-.001c.028-.018.068-.041.148-.088l2.423-1.408c.36-.21.687-.4.937-.577.254-.18.566-.44.743-.839a2 2 0 0 0 0-1.622c-.177-.4-.49-.659-.743-.84a13.22 13.22 0 0 0-.937-.576l-2.423-1.408c-.08-.047-.12-.07-.148-.088h-.002l-.002-.003a5.818 5.818 0 0 1-.08-.153l-1.211-2.354a14.473 14.473 0 0 0-.582-1.063c-.176-.278-.439-.632-.862-.83Z"
      />
    </svg>
  );
}