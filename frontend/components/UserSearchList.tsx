import React from "react";
import Avatar from "./Avatar";

const UserSearchList = ({ users }: { users: Array<SearchedUser> }) => {
  return (
    <div className="mt-2 flex flex-col gap-4">
      {users.length === 0 ? (
        <span className="text-gray-800 text-center">No users found!</span>
      ) : (
        <div className="flex flex-col">
          {users.map((user) => (
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

              <button className="py-2 px-4 bg-blue-500 text-white text-sm rounded-md font-semibold">
                Select
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserSearchList;
