import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { LoadingWrapper } from "@/components/loading/loadingWrapper";
import { Toaster } from "sonner";

export const metadata = {
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        <SessionProvider>
          <LoadingWrapper>{children}</LoadingWrapper>
        </SessionProvider>
        <Toaster />
        <SpeedInsights />
      </body>
    </html>
  );
}
