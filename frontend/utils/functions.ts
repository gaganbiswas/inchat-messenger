import { ParticipantPopulated } from "../../backend/src/util/types";

export const formatUsers = (
  participants: Array<ParticipantPopulated>,
  myUserId: string
): string => {
  const names = participants
    .filter((participant) => participant.user.id != myUserId)
    .map((participant) => participant.user.name);

  return names.join(", ");
};

export const getImageUrl = (
  participants: Array<ParticipantPopulated>,
  myUserId: string
): string | null => {
  const imageUrl = participants
    .filter((participant) => participant.user.id != myUserId)
    .map((participant) => participant.user.image)[0];

  return imageUrl;
};
