import "./root.css";
import { Outfit, Lora } from 'next/font/google';
import ThemeProviderComponent from "@/components/ThemeProviderComponent";
import crypto from 'crypto';

// Outfit - Default font for the entire project
const outfit = Outfit({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: "--font-outfit",
  display: 'swap',
});

// Lora - Secondary font (apply with className="lora")
// Lora only supports weights: 400, 500, 600, 700
const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: "--font-lora",
  display: 'swap',
});

export const metadata = {
  title: "CareerConnect",
};

export default function RootLayout({ children }) {
  const nonce = crypto.randomBytes(16).toString('base64');

  return (
    <html lang="en" className={`${outfit.variable} ${lora.variable}`}>
      <body className={outfit.className}>
        <ThemeProviderComponent nonce={nonce}>
          <main>
            {children}
          </main>
        </ThemeProviderComponent>
      </body>
    </html>
  );
}
