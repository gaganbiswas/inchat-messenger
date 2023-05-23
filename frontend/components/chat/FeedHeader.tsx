import React from "react";
import Avatar from "../shared/Avatar";
import RoomInfo from "./RoomInfo";
import { useQuery } from "@apollo/client";
import { ConversationsData } from "@/typings";
import ConversationOperations from "@/graphql/operations/conversation";
import { useRecoilState } from "recoil";
import { conversationState } from "@/recoil/atom";
import { formatUsers, getImageUrl } from "@/utils/functions";
import { client } from "@/graphql/apollo-client";

type FeedHeaderProps = {
  userId?: string | null;
};

const FeedHeader = ({ userId }: FeedHeaderProps) => {
  const [conversationId, setConversationId] = useRecoilState(conversationState);
  const { data, loading } = useQuery<ConversationsData>(
    ConversationOperations.Queries.conversations,
    {
      client: client,
    }
  );

  const conversation = data?.conversations.find(
    (conversation) => conversation?.id === conversationId
  );

  if (data?.conversations && !loading && !conversation) {
    setConversationId("");
  }

  return (
    <header className="w-full flex items-center bg-gray-100 py-2.5 px-4 justify-between gap-6">
      <div className="flex items-center gap-3">
        <Avatar
          size="w-10 h-10"
          src={getImageUrl(conversation?.participants!, userId!)}
        />
        <RoomInfo
          roomName={formatUsers(conversation?.participants!, userId!)}
        />
      </div>
    </header>
  );
};

export default FeedHeader;
