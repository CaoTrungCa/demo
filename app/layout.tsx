
import AuthProviders from "./AuthProviders";
import './globals.css';

const RootLayout = async ({ children }: {children: React.ReactNode}) => {
  return (
    <html lang="en">
      <body>
        <AuthProviders>{children}</AuthProviders>
      </body>
    </html>
  );
};

export default RootLayout;
