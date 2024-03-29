import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "@/assets/styles/globals.css";
import Background from "@/components/Background";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth-options";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return redirect("/sign-in");
  }
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <Background>{children}</Background>
      </body>
    </html>
  );
}
