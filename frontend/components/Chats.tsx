import React, { useEffect } from "react";
import ChatCard from "./ChatCard";
import { gql, useMutation, useQuery, useSubscription } from "@apollo/client";
import ConversationOperations from "../graphql/operations/conversation";
import { client } from "@/graphql/apollo-client";
import { ConversationUpdatedData, ConversationsData } from "@/typings";
import {
  ConversationPopulated,
  ParticipantPopulated,
} from "@/../backend/src/util/types";
import { useRecoilState } from "recoil";
import { conversationState } from "@/recoil/atom";
import { User } from "@/typings";
import { ChatSkeleton } from "./Skeletons";

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
  >(ConversationOperations.Mutations.markConversationAsRead, {
    client: client,
  });

  useSubscription<ConversationUpdatedData>(
    ConversationOperations.Subscriptions.conversationUpdated,
    {
      client: client,
      onData: ({ client, data }) => {
        const { data: subscriptionData } = data;

        if (!subscriptionData) return;

        const {
          conversationUpdated: { conversation: updatedConversation },
        } = subscriptionData;

        if (updatedConversation.id === conversationId) {
          onViewConversation(conversationId, false);
        }
      },
    }
  );

  const onViewConversation = async (
    conversationId: string,
    hasSeenLatestMessage: boolean | undefined
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
            participants: Array<ParticipantPopulated>;
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

          const participants = [...participantsFragment.participants];

          const userParticipantIdx = participants.findIndex(
            (p) => p.user.id === userId
          );

          if (userParticipantIdx === -1) return;

          const userParticipant = participants[userParticipantIdx];

          participants[userParticipantIdx] = {
            ...userParticipant,
            hasSeenLatestMessage: true,
          };

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
    } catch (error) {
      console.log("onViewConversation error", error);
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

  const sortedConversations = conversationsData?.conversations
    ? [...conversationsData?.conversations].sort(
        (a, b) => b.updatedAt.valueOf() - a.updatedAt.valueOf()
      )
    : [];

  useEffect(() => {
    const unsub = subscribeToNewConversations();
    return unsub;
  }, []);

  return (
    <div
      className="w-full flex flex-col overflow-y-auto"
      style={{ scrollbarWidth: "thin" }}
    >
      {loading
        ? Array(4)
            .fill(null)
            .map((e, i) => <ChatSkeleton key={i} />)
        : sortedConversations?.map((conversation) => {
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
                    participant?.hasSeenLatestMessage
                  )
                }
                hasSeenLatestMessage={participant?.hasSeenLatestMessage}
                isSelected={conversation.id === conversationId}
              />
            );
          })}
    </div>
  );
};

export default Chats;
