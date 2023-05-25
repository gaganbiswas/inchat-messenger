import React, { MutableRefObject, useRef, useState } from "react";
import { SendIcon, SmileIcon } from "../shared/Icons";
import TextareaAutosize from "react-textarea-autosize";
import { MessagesData, User } from "@/typings";
import { useMutation } from "@apollo/client";
import MessageOperations from "@/graphql/operations/message";
import { SendMessageArguments } from "@/../backend/src/util/types";
import { client } from "@/graphql/apollo-client";
import { ObjectID } from "bson";
import { scrollToBottom } from "@/utils/functions";
import dynamic from "next/dynamic";
import { EmojiStyle, Theme } from "emoji-picker-react";
import { encryptMessage } from "@/protocol/mtp";

const Picker = dynamic(
  () => {
    return import("emoji-picker-react");
  },
  { ssr: false }
);

type MessageFooterProps = {
  user?: User;
  conversationId: string;
  endOfMessageRef: MutableRefObject<HTMLDivElement | null>;
};

const MessageFooter = ({
  user,
  conversationId,
  endOfMessageRef,
}: MessageFooterProps) => {
  const [showPicker, setShowPicker] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [message, setMessage] = useState<string>("");
  const [sendMessage] = useMutation<
    { sendMessage: boolean },
    SendMessageArguments
  >(MessageOperations.Mutation.sendMessage, {
    client: client,
    onError: (error: any) => {
      console.log(error?.message);
    },
  });

  const onSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!message) return;

    try {
      const senderId = user?.id!;
      const messageId = new ObjectID().toString();
      const encryptedMessage = encryptMessage(conversationId, message);

      const newMessage: SendMessageArguments = {
        id: messageId,
        senderId,
        conversationId,
        body: encryptedMessage,
      };

      const { data, errors } = await sendMessage({
        variables: {
          ...newMessage,
        },
        optimisticResponse: {
          sendMessage: true,
        },
        update: (cache) => {
          setMessage("");
          scrollToBottom(endOfMessageRef);
          const existing = cache.readQuery<MessagesData>({
            query: MessageOperations.Query.messages,
            variables: { conversationId },
          }) as MessagesData;

          cache.writeQuery<MessagesData, { conversationId: string }>({
            query: MessageOperations.Query.messages,
            variables: { conversationId },
            data: {
              ...existing,
              messages: [
                {
                  id: messageId,
                  body: encryptedMessage,
                  senderId: user?.id,
                  conversationId,
                  sender: {
                    id: user?.id,
                    email: user?.email,
                  },
                  createdAt: new Date(Date.now()),
                  updatedAt: new Date(Date.now()),
                },
                ...existing.messages,
              ],
            },
          });
        },
      });

      if (!data?.sendMessage || errors) {
        throw new Error("Failed to send message");
      }

      // setMessage("");
    } catch (error: any) {
      console.log("onSendMessage Error", error);
    }
  };

  return (
    <div className="px-4 py-2.5 bg-gray-100 items-start flex gap-4">
      <div className="h-10 flex justify-center items-center">
        <div className="relative">
          <div className={`absolute bottom-12 ${showPicker ? "" : "hidden"}`}>
            <Picker
              onEmojiClick={(emoji) => setMessage((prev) => prev + emoji.emoji)}
              emojiStyle={EmojiStyle.GOOGLE}
              skinTonesDisabled={true}
              previewConfig={{
                showPreview: false,
              }}
              theme={Theme.LIGHT}
            />
          </div>
          <button
            className="flex text-gray-500 justify-center items-center"
            onClick={() => setShowPicker((prev) => !prev)}
          >
            <SmileIcon />
          </button>
        </div>
      </div>

      <form
        onSubmit={onSendMessage}
        className="flex gap-4 items-start flex-1"
        ref={formRef}
      >
        <TextareaAutosize
          className="flex-1 px-4 py-2 max-h-32 rounded-md resize-none focus:outline-none text-gray-900 whitespace-pre-wrap break-words"
          placeholder="Type a message"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (e.shiftKey) {
                setMessage((prev) => prev + "\n");
              } else {
                formRef.current?.requestSubmit();
              }
            }
          }}
        />

        {!message ? null : (
          <div className="h-10 flex justify-center items-center">
            <button
              className="flex text-gray-500 justify-center items-center"
              type="submit"
            >
              <SendIcon />
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default MessageFooter;
