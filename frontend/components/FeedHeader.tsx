import React from "react";
import Avatar from "./Avatar";
import RoomInfo from "./RoomInfo";

const FeedHeader = ({ avatar = "" }: { avatar?: string }) => {
  return (
    <header className="w-full flex items-center bg-gray-100 py-2.5 px-4 justify-between gap-6">
      <div className="flex items-center gap-4">
        <Avatar size="w-10 h-10" src={avatar} />
        <RoomInfo />
      </div>
    </header>
  );
};

export default FeedHeader;
