import "./globals.css";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "InChat Messenger Web",
  description: "",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={roboto.className}>
      <body className="w-full flex justify-center items-center xl:p-5 bg-gradient-to-b from-emerald-500 from-25% to-25% to-gray-200 h-screen">
        {children}
      </body>
    </html>
  );
}
