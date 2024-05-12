import type { Metadata } from "next";
import Head from "next/head";
import "./globals.css";
import AuthProvider from "@/contexts/AuthProvider";
import ToastContext from "@/contexts/ToastContext";
import Navbar from "@/components/header/Navbar";
import Button from "@/components/home/Button";

export const metadata: Metadata = {
  title: "KU Books Recommendation | Search",
  description: "Search For a Book",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, user-scalable=no" />
      </Head>
      <body className="w-full h-full text-black overflow-x-hidden">
        <AuthProvider>
          <ToastContext />
          <Navbar />
          {children}
          <Button />
        </AuthProvider>
      </body>
    </html>
  );
}
