import React, { useEffect } from "react";
import ChatCard from "./ChatCard";
import { useQuery } from "@apollo/client";
import ConversationOperations from "../graphql/operations/conversation";
import { client } from "@/graphql/apollo-client";
import { ConversationsData } from "@/typings";
import { ConversationPopulated } from "@/../backend/src/util/types";
import { useRecoilState } from "recoil";
import { conversationState } from "@/recoil/atom";
import { User } from "@/typings";

const Chats = ({ user }: { user?: User }) => {
  const {
    data: conversationsData,
    error,
    loading,
    subscribeToMore,
  } = useQuery<ConversationsData>(
    ConversationOperations.Queries.conversations,
    {
      client: client,
    }
  );
  const [conversationId, setConversationId] = useRecoilState(conversationState);

  const onViewConversation = async (conversationId: string) => {
    setConversationId(conversationId);
  };

  const subscribeToNewConversations = () => {
    subscribeToMore({
      document: ConversationOperations.Subscriptions.conversationCreated,
      updateQuery: (
        prev,
        {
          subscriptionData,
        }: {
          subscriptionData: {
            data: { conversationCreated: ConversationPopulated };
          };
        }
      ) => {
        if (!subscriptionData.data) return prev;
        const newConversation = subscriptionData.data.conversationCreated;
        return Object.assign({}, prev, {
          conversations: [newConversation, ...prev.conversations],
        });
      },
    });
  };

  useEffect(() => {
    const unsub = subscribeToNewConversations();
    return unsub;
  }, []);

  return (
    <div
      className="w-full flex flex-col overflow-y-auto h-full"
      style={{ scrollbarWidth: "thin" }}
    >
      {!conversationsData ? (
        <div>Loading...</div>
      ) : (
        conversationsData?.conversations.map((conversation) => (
          <ChatCard
            userId={user?.id}
            key={conversation.id}
            conversation={conversation}
            onClick={() => onViewConversation(conversation.id)}
            isSelected={conversation.id === conversationId}
          />
        ))
      )}
    </div>
  );
};

export default Chats;
