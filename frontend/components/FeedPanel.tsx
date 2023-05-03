import React from "react";
import Footer from "@/components/Footer";
import Messages from "@/components/Messages";
import { useRecoilState } from "recoil";
import { conversationState } from "@/recoil/atom";
import FeedHeader from "./FeedHeader";

const FeedPanel = () => {
  const [conversationId] = useRecoilState(conversationState);
  return (
    <>
      {conversationId ? (
        <>
          <FeedHeader />
          <Messages />
          <Footer />
        </>
      ) : null}
    </>
  );
};

export default FeedPanel;
