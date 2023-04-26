import React from "react";
import Avatar from "./Avatar";

const ChatCard = () => {
  return (
    <>
      <div className="w-full flex py-2.5 px-4 gap-3 cursor-pointer hover:bg-gray-50">
        <Avatar />
        <div className="w-[calc(100%_-_60px)] flex-col">
          <div className="flex items-center justify-between">
            <p className="text-base leading-snug text-gray-900">Gagan Biswas</p>
            <span className="text-xs text-gray-600">12:03pm</span>
          </div>

          <p className="truncate text-sm text-gray-600">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            Reprehenderit eligendi eaque, error vel quis natus.
          </p>
        </div>
      </div>
      <div className="ml-[76px] h-[1px] bg-gray-100" />
    </>
  );
};

export default ChatCard;
