import type { Metadata } from "next";
import "./globals.css";

import { AuthSessionProvider } from "@/components/providers/session-provider";

export const metadata: Metadata = {
  title: "REGEN-LINK | Climate Action Platform",
  description:
    "REGEN-LINK is a collaborative cross-city climate action platform for energy efficiency and circular waste action.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </body>
    </html>
  );
}