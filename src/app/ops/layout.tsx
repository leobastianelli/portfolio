import type { Metadata } from "next";
import "./ops.css";

export const metadata: Metadata = {
  title: "Analytics Ops",
  robots: { index: false, follow: false, nocache: true },
};

export default function OpsLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
