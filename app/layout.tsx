import type { Metadata } from "next";
import { headers } from "next/headers";
import { Assistant, Rubik, Space_Mono } from "next/font/google";
import "./globals.css";

const assistant = Assistant({
  variable: "--font-assistant",
  weight: "variable",
  subsets: ["hebrew", "latin"],
});

const rubik = Rubik({
  variable: "--font-rubik",
  weight: "variable",
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
    title: { default: "Extreme Group — Smart Tech + Talent", template: "%s | Extreme Group" },
    description: "שותף טאלנט וטכנולוגיה לארגוני טכנולוגיה ופינטק — גיוס, צוותים ייעודיים ופרויקטי AI, אוטומציה ו־Data.",
    openGraph: { title: "Extreme Group — Smart Tech + Talent", description: "Service as a Software לטאלנט וטכנולוגיה.", locale: "he_IL", type: "website", images: [{ url: socialImage, width: 1536, height: 1024 }] },
    twitter: { card: "summary_large_image", title: "Extreme Group — Smart Tech + Talent", description: "Service as a Software לטאלנט וטכנולוגיה.", images: [socialImage] },
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
        className={`${assistant.variable} ${rubik.variable} ${spaceMono.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
