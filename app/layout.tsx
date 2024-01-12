
import AuthProviders from "./AuthProviders";
import './globals.css';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";

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
