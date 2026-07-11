import type { Metadata } from "next";
import "./globals.css";
import MainLayout from "@/components/shared/MainLayout";

export const metadata: Metadata = {
  title: "Path Excel - Learn • Practice • Get Job Ready",
  description: "Learn Microsoft Excel by solving real Excel problems inside an interactive spreadsheet. LeetCode for Excel.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100">
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
