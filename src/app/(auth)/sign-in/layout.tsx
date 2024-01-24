import { Montserrat } from "next/font/google";
import "@/assets/styles/globals.css";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import Background from "@/components/Background";
import { authOptions } from "@/app/auth-options";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (session) {
    return redirect("/");
  }

  return (
    <html lang="en">
      <body className={montserrat.className}>
        <Background className="flex flex-col justify-center items-center">
          {children}
        </Background>
      </body>
    </html>
  );
}
