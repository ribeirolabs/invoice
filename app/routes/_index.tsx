import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [{ title: "ribeirolabs / invoice" }];
};

export default function Index() {
  return (
    <div>
      <h1>ribeirolabs / invoice</h1>
    </div>
  );
}
