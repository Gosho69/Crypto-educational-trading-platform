import "bootstrap/dist/css/bootstrap.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BootstrapClient from "./components/BootstrapClient";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CryptoETP",
  description:
    "CryptoETP is a platform for trading educationally crypto assets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
       className={inter.className}>
        {children}
        <BootstrapClient />
        </body>
    </html>
  );
}
