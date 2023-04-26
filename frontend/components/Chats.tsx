import React from "react";
import ChatCard from "./ChatCard";

const Chats = () => {
  return (
    <div
      className="w-full flex flex-col overflow-y-auto h-full"
      style={{ scrollbarWidth: "thin" }}
    >
      <ChatCard />
    </div>
  );
};

export default Chats;
