import React from "react";
import Avatar from "@/components/shared/Avatar";
import { ConversationPopulated } from "@/../backend/src/util/types";
import { formatUsers, getImageUrl } from "@/utils/functions";
import { formatRelative } from "date-fns";
import enUS from "date-fns/locale/en-US";

const formatRelativeLocale = {
  lastWeek: "eeee",
  yesterday: "'Yesterday",
  today: "p",
  other: "MM/dd/yy",
};

type ChatCardProps = {
  conversation: ConversationPopulated;
  userId?: string | null;
  isSelected: boolean;
  onClick: () => void;
  hasSeenLatestMessage: boolean | undefined;
};

const ChatCard = ({
  userId,
  conversation,
  isSelected,
  onClick,
  hasSeenLatestMessage,
}: ChatCardProps) => {
  return (
    <>
      <div
        className={`w-full flex py-2.5 px-4 gap-3 cursor-pointer hover:bg-gray-50 ${
          isSelected ? "bg-gray-50" : ""
        } ${!conversation.latestMessage?.body ? "items-center" : ""}`}
        onClick={onClick}
      >
        <Avatar src={getImageUrl(conversation?.participants!, userId!)} />
        <div className="w-[calc(100%_-_60px)] flex-col">
          <div className="flex items-center justify-between">
            <span className="text-base text-gray-900 truncate flex-1">
              {formatUsers(conversation?.participants!, userId!)}
            </span>
            <span className="text-xs text-gray-600 ml-4">
              {formatRelative(conversation?.updatedAt!, new Date(), {
                locale: {
                  ...enUS,
                  formatRelative: (token) =>
                    formatRelativeLocale[
                      token as keyof typeof formatRelativeLocale
                    ],
                },
              })}
            </span>
          </div>

          <div className="flex items-center justify-between">
            {conversation.latestMessage?.body ? (
              <span className="truncate text-sm text-gray-600 flex-1">
                {conversation.latestMessage?.body}
              </span>
            ) : null}

            {hasSeenLatestMessage === false && (
              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full ml-4" />
            )}
          </div>
        </div>
      </div>
      <div
        className={`ml-[76px] h-[1px] ${
          isSelected ? "bg-transaprent" : "bg-gray-100"
        }`}
      />
    </>
  );
};

export default ChatCard;
