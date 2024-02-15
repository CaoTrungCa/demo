
import AuthProviders from "./AuthProviders";
import './globals.css';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
import { fetchDataSetting } from "@/lib/utils/fetchData";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const globals = await fetchDataSetting()
  const data = globals
  const url = globals.logo
  return {
    title: {
      template: `%s | ${data?.title ?? 'Cao Trung'}`,
      default: data.title || 'Cao Trung',
    },
    viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no',
    description: data.description,
    openGraph: { images: (data.logo || '') },
    icons: {
      icon: [url],
    },
  }
}

const RootLayout = async ({ children }: {children: React.ReactNode}) => {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2621335011919074"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      </head>
      <body>
        <AuthProviders>
          {children}
          <SpeedInsights/>
          <Analytics/>
        </AuthProviders>
      </body>
    </html>
  );
};

export default RootLayout;
