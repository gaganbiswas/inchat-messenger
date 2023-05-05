import React from "react";
import { CloseIcon } from "./Icons";
import { SearchedUser } from "@/typings";

type ParticipantsProps = {
  participants: Array<SearchedUser>;
  removeParticipant: (userId: string) => void;
};

const Participants = ({
  participants,
  removeParticipant,
}: ParticipantsProps) => {
  return (
    <>
      <span className="font-semibold text-gray-800">Participants</span>
      <div className="flex flex-wrap items-center gap-2 overflow-y-auto">
        {participants.map((participant) => (
          <div
            key={participant.id}
            className="flex items-center gap-1 bg-gray-100 px-2 py-1.5 rounded-md"
          >
            <span className="text-sm text-gray-900">{participant.email}</span>
            <button
              onClick={() => removeParticipant(participant.id)}
              className="mt-0.5 text-gray-800"
            >
              <CloseIcon />
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default Participants;
