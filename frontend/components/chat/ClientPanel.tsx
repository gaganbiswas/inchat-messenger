"use client";

import React, { useEffect } from "react";
import { RecoilRoot } from "recoil";
import DrawerPanel from "./DrawerPanel";
import FeedPanel from "./FeedPanel";
import { Session } from "next-auth";
import { generateKeys } from "../../protocol/mtp";

const ClientPanel = ({ session }: { session: Session }) => {
  const generateAndStoreKeys = async () => {
    //@ts-ignore
    const privateKey = localStorage.getItem(session?.user?.id);

    if (privateKey) return;

    //@ts-ignore
    await generateKeys(session?.user?.id);
  };

  useEffect(() => {
    generateAndStoreKeys();
  }, []);

  return (
    <RecoilRoot>
      <DrawerPanel user={session.user} />
      <div className="h-full flex-grow">
        <div className="flex h-full w-full bg-orange-50 bg-chat-bg">
          <div className="flex flex-1 h-full flex-col">
            <FeedPanel user={session.user} />
          </div>
        </div>
      </div>
    </RecoilRoot>
  );
};

export default ClientPanel;
