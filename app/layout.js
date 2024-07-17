import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { LoadingWrapper } from "@/components/loading/loadingWrapper";

export const metadata = {
  title: "KPN Senior Project 1",
  description: "Team/Task management app for rental property hosts",
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
        <SpeedInsights />
      </body>
    </html>
  );
}
