import {
  MessagesData,
  MessagesVariables,
  MessagesSubscriptionData,
} from "@/typings";
import { useQuery } from "@apollo/client";
import MessageOperations from "@/graphql/operations/message";
import React, { useEffect } from "react";
import { client } from "@/graphql/apollo-client";
import MessageBox from "./MessageBox";

type MessageProps = {
  userId: string | null | undefined;
  conversationId: string;
};

const Messages = ({ userId, conversationId }: MessageProps) => {
  const { data, loading, error, subscribeToMore } = useQuery<
    MessagesData,
    MessagesVariables
  >(MessageOperations.Query.messages, {
    variables: {
      conversationId,
    },
    client: client,
  });

  const subscribeToMoreMessages = (conversationId: string) => {
    subscribeToMore({
      document: MessageOperations.Subscription.messageSent,
      variables: {
        conversationId,
      },
      updateQuery: (prev, { subscriptionData }: MessagesSubscriptionData) => {
        if (!subscriptionData.data) return prev;

        const newMessage = subscriptionData.data.messageSent;

        return Object.assign({}, prev, {
          messages:
            newMessage.sender.id === userId
              ? prev.messages
              : [newMessage, ...prev.messages],
        });
      },
    });
  };

  useEffect(() => {
    const unsub = subscribeToMoreMessages(conversationId);
    return unsub;
  }, [conversationId]);

  return (
    <div className="flex-1 h-full">
      {loading ? (
        <div>Loading...</div>
      ) : data?.messages ? (
        <div className="flex flex-col-reverse overflow-y-auto h-full">
          {data.messages.map((message, i, arr) => (
            <>
              {i === 0 ? <div className="h-4" /> : null}
              <MessageBox
                key={message.id}
                message={message}
                sentByMe={message.sender.id === userId}
                isPreviousByMe={
                  i === arr.length - 1
                    ? false
                    : arr[i + 1].sender.id === message.sender.id
                }
              />
            </>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default Messages;
