import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist, Montserrat } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "Forms Dashboard",
  description: "Create your forms and share them with others!",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${geist.variable}`}
      style={{ height: "100%" }}
    >
      <body className="dark flex min-h-full w-full grow flex-col overscroll-none">
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
