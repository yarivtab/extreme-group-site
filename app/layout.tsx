import type { Metadata } from "next";
import { headers } from "next/headers";
import { Assistant, Rubik, Space_Mono } from "next/font/google";
import { isPublicProductionHost } from "./seo";
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
  const origin = `${protocol}://${host}`;
  const socialImage = `${protocol}://${host}/og.png`;
  return {
    metadataBase: new URL(origin),
    title: { default: "Extreme Group — Recruiting Intelligence Network", template: "%s | Extreme Group" },
    description: "Data, AI ואוטומציה שמחברים צוותי גיוס וטאלנטים להזדמנויות הנכונות.",
    alternates: { canonical: "/" },
    robots: isPublicProductionHost(host)
      ? { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } }
      : { index: false, follow: true },
    openGraph: { title: "Extreme Group — Recruiting Intelligence Network", description: "מחברים אנשים להזדמנויות הנכונות באמצעות Data, AI ואוטומציה.", locale: "he_IL", type: "website", images: [{ url: socialImage, width: 1536, height: 1024 }] },
    twitter: { card: "summary_large_image", title: "Extreme Group — Recruiting Intelligence", description: "מחברים אנשים להזדמנויות הנכונות.", images: [socialImage] },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Extreme Group",
    url: origin,
    logo: `${origin}/extreme-logo.png`,
    sameAs: [
      "https://www.linkedin.com/company/extreme-technologies",
      "https://on.fb.me/1Fe92Pr",
      "https://bit.ly/1D2IoVF",
    ],
  };

  return (
    <html lang="he" dir="rtl">
      <body
        className={`${assistant.variable} ${rubik.variable} ${spaceMono.variable}`}
      >
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, "\\u003c") }} />
        {children}
      </body>
    </html>
  );
}
