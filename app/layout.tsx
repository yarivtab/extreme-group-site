import type { Metadata } from "next";
import { headers } from "next/headers";
import { Heebo, Space_Mono } from "next/font/google";
import "./globals.css";

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const socialImage = `${protocol}://${host}/og.png`;
  return {
    title: { default: "Extreme Group — אנשים וטכנולוגיה שעובדים", template: "%s | Extreme Group" },
    description: "גיוס טכנולוגי ופרויקטי AI, אוטומציה ו־IT — מדויקים, מהירים ונוחים יותר.",
    openGraph: { title: "Extreme Group — אנשים מעולים. מערכות חכמות.", description: "גיוס טכנולוגי ופרויקטי AI, אוטומציה ו־IT.", locale: "he_IL", type: "website", images: [{ url: socialImage, width: 1536, height: 1024 }] },
    twitter: { card: "summary_large_image", title: "Extreme Group", description: "אנשים מעולים. מערכות חכמות. פחות חיכוך.", images: [socialImage] },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body
        className={`${heebo.variable} ${spaceMono.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
