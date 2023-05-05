import React, { useEffect } from "react";
import ChatCard from "./ChatCard";
import { gql, useMutation, useQuery } from "@apollo/client";
import ConversationOperations from "../graphql/operations/conversation";
import { client } from "@/graphql/apollo-client";
import { ConversationsData } from "@/typings";
import {
  ConversationPopulated,
  ParticipantPopulated,
} from "@/../backend/src/util/types";
import { useRecoilState } from "recoil";
import { conversationState } from "@/recoil/atom";
import { User } from "@/typings";

const Chats = ({ user }: { user?: User }) => {
  const [conversationId, setConversationId] = useRecoilState(conversationState);
  const userId = user?.id!;
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

  const [markConversationAsRead] = useMutation<
    { markConversationAsRead: boolean },
    { userId: string; conversationId: string }
  >(ConversationOperations.Mutations.markConversationAsRead);

  const onViewConversation = async (
    conversationId: string,
    hasSeenLatestMessage: boolean
  ) => {
    setConversationId(conversationId);

    if (hasSeenLatestMessage) return;

    try {
      await markConversationAsRead({
        variables: {
          userId,
          conversationId,
        },
        optimisticResponse: {
          markConversationAsRead: true,
        },
        update: (cache) => {
          const participantsFragment = cache.readFragment<{
            pariticipants: Array<ParticipantPopulated>;
          }>({
            id: `Conversation:${conversationId}`,
            fragment: gql`
              fragment Participants on Conversation {
                participants {
                  user {
                    id
                    email
                  }
                  hasSeenLatestMessage
                }
              }
            `,
          });

          if (!participantsFragment) return;

          const participants = [...participantsFragment.pariticipants];

          const userParticipantIdx = participants.findIndex(
            (p) => p.user.id === userId
          );

          if (userParticipantIdx === -1) return;

          const userParticipant = participants[userParticipantIdx];
          participants[userParticipantIdx] = {
            ...userParticipant,
            hasSeenLatestMessage: true,
          };

          /**
           * Update Cache
           */
          cache.writeFragment({
            id: `Conversation:${conversationId}`,
            fragment: gql`
              fragment UpdatedParticipant on Conversation {
                participants
              }
            `,
            data: {
              participants,
            },
          });
        },
      });
    } catch (error: any) {
      throw new Error("onViewConversation error", error);
    }
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
        conversationsData?.conversations.map((conversation) => {
          const participant = conversation.participants.find(
            (p) => p.user.id === user?.id
          );

          return (
            <ChatCard
              userId={user?.id}
              key={conversation.id}
              conversation={conversation}
              onClick={() =>
                onViewConversation(
                  conversation.id,
                  participant?.hasSeenLatestMessage!
                )
              }
              hasSeenLatestMessage={participant?.hasSeenLatestMessage!}
              isSelected={conversation.id === conversationId}
            />
          );
        })
      )}
    </div>
  );
};

export default Chats;
