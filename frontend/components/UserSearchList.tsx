import React, { Dispatch, SetStateAction } from "react";
import Avatar from "./Avatar";

const UserSearchList = ({
  users,
  addParticipant,
  participants,
}: {
  participants: Array<SearchedUser>;
  users: Array<SearchedUser>;
  addParticipant: (user: SearchedUser) => void;
}) => {
  return (
    <div className="mt-2 flex flex-col gap-4 overflow-y-auto">
      {users.length === 0 ? (
        <span className="text-gray-800 text-center">No users found!</span>
      ) : (
        users.map((user) => (
          <div
            className="flex justify-between gap-6 p-2 hover:bg-gray-50 rounded-lg items-center"
            key={user.id}
          >
            <div className="flex flex-row gap-3 items-center">
              <Avatar src={user.image} size="w-10 h-10" />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-800">
                  {user.name}
                </span>
                <span className="text-xs text-gray-600">{user.email}</span>
              </div>
            </div>

            <button
              className="py-2 px-4 bg-blue-500 text-white text-sm rounded-md font-semibold disabled:bg-gray-300"
              onClick={() => addParticipant(user)}
              disabled={participants.some((p) => p.id === user.id)}
            >
              Select
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default UserSearchList;
