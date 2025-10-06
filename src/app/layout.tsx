import type { Metadata } from "next";
import { Noto_Sans_JP, Roboto } from "next/font/google";
import AppThemeProvider from "../theme/AppThemeProvider";
import { cookies } from "next/headers";
import type { SchemeKey } from "../theme/colorSchemes";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
});

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-jp",
});

export const metadata: Metadata = {
  title: "LULL 業務受発注管理システム",
  description: "LULL社向け業務受発注管理システムのUIモックアップ",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const raw = cookieStore.get("theme-scheme")?.value as SchemeKey | "plum" | "charcoal" | undefined;
  const normalized = raw === "plum" || raw === "charcoal" ? "dark" : (raw as SchemeKey | undefined);
  const initialScheme = (normalized ?? "default") as SchemeKey;
  return (
    <html lang="ja" data-scheme={initialScheme}>
      <body className={`${roboto.variable} ${notoSansJP.variable}`}>
        <script
          dangerouslySetInnerHTML={{
            __html: `(()=>{try{var m=document.cookie.match(/(?:^|; )theme-scheme=([^;]+)/);var c=m?decodeURIComponent(m[1]):null;var l=localStorage.getItem('theme-scheme');var s=c||l; if(s){document.documentElement.dataset.scheme=s;} if(!c && l){document.cookie='theme-scheme='+encodeURIComponent(l)+'; path=/; max-age=31536000; samesite=lax';}}catch(e){}})();`,
          }}
        />
        <AppThemeProvider initialScheme={initialScheme}>{children}</AppThemeProvider>
      </body>
    </html>
  );
}
