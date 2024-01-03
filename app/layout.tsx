
import AuthProviders from "./AuthProviders";
import './globals.css';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react";

const RootLayout = async ({ children }: {children: React.ReactNode}) => {
  return (
    <html lang="en">
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
