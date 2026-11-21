import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "DevLetters – A place to read and write", template: "%s – DevLetters" },
  description:
    "DevLetters is a quiet place to read and write. Practical essays and guides on writing and clear thinking.",
};

// Applies the saved theme before the page paints, so there is no light/dark flash.
const themeScript = `try{var t=localStorage.getItem('devletters.theme');if(t)document.documentElement.setAttribute('data-theme',t)}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <main className="wrap flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
