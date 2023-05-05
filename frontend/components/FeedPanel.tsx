import React from "react";
import MessageFooter from "@/components/MessageFooter";
import Messages from "@/components/Messages";
import { useRecoilState } from "recoil";
import { conversationState } from "@/recoil/atom";
import FeedHeader from "./FeedHeader";
import { User } from "@/typings";

const FeedPanel = ({ user }: { user?: User }) => {
  const [conversationId] = useRecoilState(conversationState);

  return (
    <>
      {conversationId ? (
        <>
          <FeedHeader userId={user?.id} />
          <Messages userId={user?.id} conversationId={conversationId} />
          <MessageFooter conversationId={conversationId} user={user} />
        </>
      ) : (
        <div>No conversation</div>
      )}
    </>
  );
};

export default FeedPanel;
