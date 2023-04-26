import DrawerPanel from "@/components/DrawerPanel";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Messages from "@/components/Messages";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "pages/api/auth/[...nextauth]";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  return (
    <div className="w-full max-w-[1600px] bg-white h-full shadow-lg overflow-hidden">
      <div className="w-full flex h-full overflow-hidden divide-x divide-gray-200">
        <DrawerPanel user={session.user} />
        <div className="h-full flex-grow">
          <div className="flex h-full w-full bg-orange-50 bg-chat-bg">
            <div className="flex flex-1 h-full flex-col">
              <Header isChatRoom={true} />
              <Messages />
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
