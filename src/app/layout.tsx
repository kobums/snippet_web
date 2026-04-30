import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
// import BottomNav from "@/components/layout/BottomNav";
import AuthProvider from "@/components/auth/AuthProvider";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Snippet - 블라인드 북 큐레이션",
  description:
    "편견 없이, 오직 문장의 힘으로 책을 발견하세요. 마음에 드는 문장을 스와이프하고, 숨겨진 책을 만나보세요.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        {/* FOUC 방지: 렌더 전 테마 클래스 즉시 적용 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('snippet-theme')||'system';var dark=t==='dark'||(t==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);if(dark)document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${geistSans.variable} antialiased bg-liquid`}>
        <AuthProvider>
          {children}
          {/* BottomNav - 임시로 비활성화 */}
          {/* <div className="lg:hidden">
            <BottomNav />
          </div> */}
        </AuthProvider>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      </body>
    </html>
  );
}
