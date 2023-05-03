import React, { useState } from "react";
import { ChatIcon, MoreIcon } from "./Icons";
import Avatar from "./Avatar";
import { signOut } from "next-auth/react";
import NewChat from "./NewChat";

const Header = ({ avatar = "" }: { avatar?: string | null | undefined }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <header className="w-full flex items-center bg-gray-100 py-2.5 px-4 justify-between gap-6">
        <div className="flex items-center gap-4">
          <Avatar size="w-10 h-10" src={avatar} />
        </div>

        <div className="flex items-center gap-2">
          <button
            className="flex text-gray-500 p-2"
            onClick={() => setShowModal(true)}
            title="Start a conversation"
          >
            <ChatIcon />
          </button>
          <button
            className="flex text-gray-500 p-2"
            onClick={() => signOut()}
            title="Sign out"
          >
            <MoreIcon />
          </button>
        </div>
      </header>
      <NewChat isOpen={showModal} setIsOpen={setShowModal} />
    </>
  );
};

export default Header;
