import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";

export const metadata = {
  title: "KPN Senior Project 1",
  description: "Team/Task management app for rental property hosts",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
