import { Indie_Flower } from "next/font/google";
import "./globals.css";

const indieFlower = Indie_Flower({
  variable: "--font-indie-flower",
  subsets: ["latin"],
  weight: "400",
});

export const metadata = {
  title: "To-Do List",
  description: "A to-do list to keep track of plans.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${indieFlower.variable}`}>{children}</body>
    </html>
  );
}
