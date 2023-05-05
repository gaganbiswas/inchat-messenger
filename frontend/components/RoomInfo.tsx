import React from "react";

type RoomInfoProps = {
  roomName: String;
  lastSeen?: Date;
};

const RoomInfo = ({ roomName, lastSeen }: RoomInfoProps) => {
  return (
    <div className="flex flex-col">
      <span className="text-base text-gray-900 leading-none">{roomName}</span>
      <span className="mt-0.5 text-xs text-gray-600">
        <i>Tap for more info</i>
      </span>
    </div>
  );
};

export default RoomInfo;
