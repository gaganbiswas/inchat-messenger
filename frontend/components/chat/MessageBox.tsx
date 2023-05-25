import React from "react";
import { MessagePopulated } from "@/../backend/src/util/types";
import { Arrow } from "../shared/Icons";
import { format } from "date-fns";
import { decryptMessage } from "@/protocol/mtp";

type MessageBoxProps = {
  conversationId: string;
  message: MessagePopulated & {
    body: string;
  };
  sentByMe: boolean;
  isPreviousByMe: boolean;
};

const MessageBox = ({
  conversationId,
  message,
  sentByMe,
  isPreviousByMe,
}: MessageBoxProps) => {
  const decryptedMessage = decryptMessage(conversationId, message.body);

  return (
    <div
      className={`flex flex-col w-full px-5 ${
        isPreviousByMe ? "mt-0.5" : "mt-3"
      }`}
    >
      <div
        className={`relative pl-[9px] pt-1.5 pb-2 pr-2 py-1 rounded-md ${
          isPreviousByMe ? "" : sentByMe ? "rounded-tr-none" : "rounded-tl-none"
        } max-w-[75%] ${
          sentByMe ? "bg-emerald-200 self-end" : "bg-gray-200 self-start"
        }`}
      >
        {!isPreviousByMe ? (
          <span
            className={`absolute top-0 ${
              sentByMe ? "text-emerald-200 -right-2" : "text-gray-200 -left-2"
            }`}
          >
            <Arrow sentByMe={sentByMe} />
          </span>
        ) : null}
        <span className="whitespace-pre-wrap break-words text-gray-900 text-sm">
          {decryptedMessage}
          <span className="text-xs text-gray-600 mt-2 ml-2 float-right">
            {format(new Date(message.createdAt), "h:mm a")}
          </span>
        </span>
      </div>
    </div>
  );
};

export default MessageBox;
