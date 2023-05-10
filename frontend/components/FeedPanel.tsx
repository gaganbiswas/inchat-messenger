import React, { useRef } from "react";
import MessageFooter from "@/components/MessageFooter";
import Messages from "@/components/Messages";
import { useRecoilState } from "recoil";
import { conversationState } from "@/recoil/atom";
import FeedHeader from "./FeedHeader";
import { User } from "@/typings";
import NoConversation from "./NoConversation";

const FeedPanel = ({ user }: { user?: User }) => {
  const [conversationId] = useRecoilState(conversationState);
  const endOfMessageRef = useRef(null);

  return (
    <>
      {conversationId ? (
        <>
          <FeedHeader userId={user?.id} />
          <Messages
            userId={user?.id}
            conversationId={conversationId}
            endOfMessageRef={endOfMessageRef}
          />
          <MessageFooter
            conversationId={conversationId}
            user={user}
            endOfMessageRef={endOfMessageRef}
          />
        </>
      ) : (
        <NoConversation />
      )}
    </>
  );
};

export default FeedPanel;
