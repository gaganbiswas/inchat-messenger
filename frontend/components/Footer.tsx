import React from "react";
import { SmileIcon } from "./Icons";

const Footer = () => {
  return (
    <div className="px-4 py-2.5 bg-gray-100 flex items-center gap-4">
      <button className="flex text-gray-500">
        <SmileIcon />
      </button>
      <input
        className="px-4 py-2 flex-1 rounded-lg focus:outline-none"
        placeholder="Type a message"
      />
    </div>
  );
};

export default Footer;
