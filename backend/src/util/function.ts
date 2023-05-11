import fetch from "node-fetch";
import { ParticipantPopulated } from "./types";

export const getServerSession = async (cookie: string) => {
  const res = await fetch(process.env.NEXTAUTH_SESSION_URL, {
    headers: { cookie: cookie },
  });
  const session = await res.json();

  return session;
};

export function userIsConversationParticipant(
  participants: Array<ParticipantPopulated>,
  userId: string
): boolean {
  return !!participants.find((participant) => participant.userId === userId);
}
