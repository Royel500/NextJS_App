import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import NextAuthProvider from "./Provider/nextAuthProvider";
// import '../app/Components/index.css'
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div>
          <Navbar></Navbar>

        </div>
        <main className="min-h-screen ">
        {children}
        </main>
        <div>
      <Footer></Footer>
        </div>
    
      </body>
      </NextAuthProvider>

    </html>
  );
}
