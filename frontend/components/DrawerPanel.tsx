import Image from "next/image";
import React from "react";
import Header from "./Header";
import SearchBar from "./SearchBar";
import Chats from "./Chats";

type User = {
  name?: string | null | undefined;
  email?: string | null | undefined;
  image?: string | null | undefined;
};

const DrawerPanel = (props: { user?: User }) => {
  const { user } = props;

  return (
    <div className="flex flex-col min-w-[340px] max-w-[45%] flex-[0_0_45%] lg:max-w-[40%] lg:flex-[0_0_40%] xl:max-w-[30%] xl:flex-[0_0_30%]">
      <Header avatar={user?.image} />
      <SearchBar />
      <Chats />
    </div>
  );
};

export default DrawerPanel;
