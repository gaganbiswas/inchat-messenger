import {
  conversationPopulated,
  participantPopulated,
} from "./../graphql/resolvers/conversation";
import { Prisma, PrismaClient } from "@prisma/client";
import { ISODateString } from "next-auth";
import { PubSub } from "graphql-subscriptions";
import { Context } from "graphql-ws/lib/server";
import { messagePopulated } from "../graphql/resolvers/messages";

export interface GraphQLContext {
  session: Session | null;
  prisma: PrismaClient;
  pubsub: PubSub;
}

export interface SubscriptionContext extends Context {
  connectionParams: {
    session?: Session;
  };
}

export interface Session {
  user?: User;
  expires: ISODateString;
}

export interface User {
  id: string;
  email: string;
  image: string;
  name: string;
  emailVerified: boolean;
}

export type ConversationPopulated = Prisma.ConversationGetPayload<{
  include: typeof conversationPopulated;
}>;

export type ParticipantPopulated = Prisma.ConversationParticipantGetPayload<{
  include: typeof participantPopulated;
}>;

export interface ConversationCreatedSubscriptionPayload {
  conversationCreated: ConversationPopulated;
}

export interface ConversationUpdatedSubscriptionPayload {
  conversationUpdated: {
    conversation: ConversationPopulated;
    addedUserIds: Array<string>;
    removedUserIds: Array<string>;
  };
}

export interface ConversationDeletedSubscriptionPayload {
  conversationDeleted: ConversationPopulated;
}

export interface SendMessageArguments {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
}

export interface SendMessageSubscriptionPayload {
  messageSent: MessagePopulated;
}

export type MessagePopulated = Prisma.MessageGetPayload<{
  include: typeof messagePopulated;
}>;
