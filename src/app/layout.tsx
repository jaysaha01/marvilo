"use client";

import { ThemeContextProvider } from "@/context/ThemeContext";
import { usePathname } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";

import "./style.scss";
import Wrapper from "@/components/Wrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentPathName = usePathname();
  const hideWrapper = currentPathName === "/signup" || currentPathName === "/signin" || currentPathName === "/forget-password" || currentPathName === "/reset-password";

  return (
    <AuthProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          {hideWrapper ? children : <ThemeContextProvider><Wrapper>{children}</Wrapper></ThemeContextProvider>}
        </body>
      </html>
    </AuthProvider>

  );
}
