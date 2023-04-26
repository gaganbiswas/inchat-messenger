"use client";

import React, { useRef } from "react";
import { FilterIcon, SearchIcon } from "./Icons";

const SearchBar = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputFocus = () => {
    inputRef?.current?.focus();
  };

  return (
    <div className="px-4 py-2.5 flex items-center gap-2 border-b border-gray-200">
      <div
        className="flex-1 px-4 h-[35px] flex items-center bg-gray-100 rounded-lg relative gap-4"
        onClick={handleInputFocus}
      >
        <label className="flex text-gray-400" htmlFor="search">
          <SearchIcon />
        </label>
        <input
          className="w-full font-normal text-sm focus:outline-none bg-transparent"
          placeholder="Search for a chat"
          id="search"
          ref={inputRef}
        />
      </div>

      <button className="flex p-1 text-gray-400">
        <FilterIcon />
      </button>
    </div>
  );
};

export default SearchBar;
