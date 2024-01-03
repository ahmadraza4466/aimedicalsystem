import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NextUiProvider from "../components/next-ui-provider";
import Navbar from "../components/ui/navbar";
import { ThemeProvider } from "../components/theme-provider";
import SidebarContextProvider from "@/contexts/sidebar-context";
import Hotjar from "@hotjar/browser";

const siteId = 3811967;
const hotjarVersion = 6;

Hotjar.init(siteId, hotjarVersion);

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AiBot",
  description:
    "Empower your legal practice with our AI bot for lawyers. Streamline research, enhance client interactions, and stay ahead in the dynamic legal landscape. Boost efficiency, save time, and make informed decisions with our cutting-edge artificial intelligence solution tailored for legal professionals.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextUiProvider>
            <SidebarContextProvider>
              <Navbar />
              {children}
            </SidebarContextProvider>
          </NextUiProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
