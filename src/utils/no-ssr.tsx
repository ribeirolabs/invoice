import { ComponentType } from "react";
import dynamic from "next/dynamic";

export function noSSR<Props>(Component: ComponentType<Props>) {
  return dynamic<Props>(async () => Component, {
    ssr: false,
  });
}
