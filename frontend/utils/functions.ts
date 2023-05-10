import { MutableRefObject } from "react";
import { ParticipantPopulated } from "../../backend/src/util/types";

export const formatUsers = (
  participants: Array<ParticipantPopulated>,
  myUserId: string
): string => {
  const names = participants
    ?.filter((participant) => participant?.user?.id != myUserId)
    ?.map((participant) => participant?.user?.name);

  return names?.join(", ");
};

export const getImageUrl = (
  participants: Array<ParticipantPopulated>,
  myUserId: string
): string | null => {
  const imageUrl = participants
    ?.filter(
      (participant: ParticipantPopulated) => participant?.user?.id !== myUserId
    )
    ?.map((participant: ParticipantPopulated) => participant?.user?.image)?.[0];

  return imageUrl;
};

export const scrollToBottom = (
  ref: MutableRefObject<HTMLDivElement | null>
) => {
  ref?.current?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};
