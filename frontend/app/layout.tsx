import "./globals.css";

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
    <html lang="en" className="font-sans">
      <body className="w-full flex justify-center items-center xl:p-5 bg-gradient-to-b from-sky-500 from-15% to-15% to-gray-200 h-screen">
        {children}
      </body>
    </html>
  );
}
