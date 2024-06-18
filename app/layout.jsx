import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/ui/dashboard/sidebar/sidebar";
import Navbar from "@/components/ui/dashboard/navbar/navbar";
import Footer from "@/components/ui/dashboard/footer/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "KPN Senior Project 1",
  description: "A team management for rental property hosts.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div>
          <Navbar /> 
        </div>
        <div>
          <Sidebar />
          {children}
          <Footer />
        </div>
        
        </body>
    </html>
  );
}
