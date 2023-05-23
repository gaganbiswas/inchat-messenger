import React from "react";
import { NoChat } from "./NoChat";

const NoConversation = () => {
  return (
    <>
      <div className="h-full flex flex-col items-center justify-center bg-gray-100">
        <NoChat />
        <div className="mt-5">
          <h1 className="text-center text-3xl font-semibold text-gray-800">
            InChat Messenger
          </h1>
          <p className="mt-3 text-center text-gray-800 max-w-md">
            Click an existing conversation or create a new conversation and
            start messaging in realtime.
          </p>
        </div>
      </div>
      <div className="w-full h-2 bg-emerald-500 justify-self-end" />
    </>
  );
};

export default NoConversation;
