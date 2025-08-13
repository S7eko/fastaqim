import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./components/layout/navbar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "تـبـيـان الـهـدى",
  description: "منصة لحفظ وتلاوة القرآن الكريم بأساليب متعددة",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[var(--background)] text-[var(--foreground)]`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
