import { Inter, Pacifico } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import { CartProvider } from '@/context/CartContext';

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const pacifico = Pacifico({ weight: "400", subsets: ["latin"], variable: '--font-pacifico' });

export const metadata = {
  title: "Spike Garment",
  description: "Swag is a Lifestyle",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/remixicon/4.2.0/remixicon.min.css" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} ${pacifico.variable} antialiased bg-white text-gray-900`}>
        <CartProvider>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
        </CartProvider>
      </body>
    </html>
  );
}