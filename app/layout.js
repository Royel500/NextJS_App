// app/layout.jsx (or RootLayout file you have)
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import NextAuthProvider from "./Provider/nextAuthProvider";
import { CartProvider } from "./Provider/CartContext/CartContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Learn Next.js App",
  description: "Trying to Learn Next.js For the Future ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <NextAuthProvider>
        {/* Put CartProvider here so Navbar and children are inside the same provider */}
        <CartProvider>
          <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            <div>
              <Navbar />
            </div>

            <main className="min-h-screen">
              {children}
            </main>

            <div>
              <Footer />
            </div>
          </body>
        </CartProvider>
      </NextAuthProvider>
    </html>
  );
}
