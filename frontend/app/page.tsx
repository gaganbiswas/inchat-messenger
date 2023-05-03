import ClientPanel from "@/components/ClientPanel";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "pages/api/auth/[...nextauth]";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  return (
    <div className="w-full max-w-[1600px] bg-white h-full shadow-lg overflow-hidden">
      <div className="w-full flex h-full overflow-hidden divide-x divide-gray-200">
        <ClientPanel session={session} />
      </div>
    </div>
  );
}
