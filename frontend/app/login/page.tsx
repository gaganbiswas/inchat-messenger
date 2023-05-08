import React from "react";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "pages/api/auth/[...nextauth]";
import Image from "next/image";
import Logo from "../../public/images/avatar.webp";
import GoogleButton from "@/components/GoogleButton";

const Login = async () => {
  const session = await getServerSession(authOptions);

  if (session) redirect("/");

  return (
    <div className="w-full max-w-5xl p-6 pt-0 self-start flex flex-col gap-6">
      <header className="mt-4 lg:mt-0 flex items-center gap-3">
        <Image
          src={Logo}
          alt="Logo"
          width="0"
          height="0"
          className="w-10 h-10 rounded-full"
          priority
        />
        <span className="text-white font-semibold uppercase">
          InChat Messenger
        </span>
      </header>
      <main className="w-full bg-white flex flex-col">
        <div className="px-6 py-12 flex flex-col items-center">
          <h1 className="text-2xl text-gray-700 text-center">
            Start using InChat Messenger
          </h1>
          <GoogleButton />
        </div>
        <div className="px-6 py-12 flex flex-col items-center bg-gray-50"></div>
      </main>
    </div>
  );
};

export default Login;
