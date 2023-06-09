import {
  ConversationCreatedSubscriptionPayload,
  ConversationUpdatedSubscriptionPayload,
} from "./../../util/types";
import { Prisma } from "@prisma/client";
import { ConversationPopulated, GraphQLContext } from "../../util/types";
import { GraphQLError } from "graphql";
import { withFilter } from "graphql-subscriptions";
import { userIsConversationParticipant } from "../../util/function";

const resolvers = {
  Query: {
    conversations: async (
      _: any,
      __: any,
      context: GraphQLContext
    ): Promise<Array<ConversationPopulated>> => {
      const { session, prisma } = context;

      if (!session?.user) {
        throw new GraphQLError("Not authorized");
      }

      const {
        user: { id: userId },
      } = session;

      try {
        const conversations = await prisma.conversation.findMany({
          include: conversationPopulated,
        });

        return conversations.filter(
          (conversation) =>
            !!conversation.participants.find((p) => p.userId === userId)
        );
      } catch (error: any) {
        console.log("Conversation error", error);
        throw new GraphQLError(error?.message);
      }
    },
  },

  Mutation: {
    createConversation: async (
      _: any,
      args: { participantIds: Array<string> },
      context: GraphQLContext
    ): Promise<{ conversationId: string }> => {
      const { session, prisma, pubsub } = context;
      const { participantIds } = args;

      if (!session?.user) {
        throw new GraphQLError("Not authorized");
      }

      const {
        user: { id: userId },
      } = session;

      if (participantIds.length === 2) {
        try {
          const conversations = await prisma.conversation.findMany({
            include: conversationPopulated,
          });

          const existingConversations = conversations
            .filter(
              (conversation) =>
                !!conversation.participants.find((p) => p?.userId === userId)
            )
            .map((c) => ({
              id: c?.id,
              participants: c.participants?.map((p) => p.userId).sort(),
            }));

          const existingConversation = existingConversations.find((c) => {
            const withParticipant = participantIds.filter(
              (p) => p !== userId
            )[0];

            return c.participants?.includes(withParticipant);
          })?.id;

          if (existingConversation)
            return {
              conversationId: existingConversation,
            };
          else {
            const newConversation = await prisma.conversation.create({
              data: {
                participants: {
                  createMany: {
                    data: participantIds.map((id) => ({
                      userId: id,
                      hasSeenLatestMessage: id === userId,
                    })),
                  },
                },
              },
              include: conversationPopulated,
            });

            pubsub.publish("CONVERSATION_CREATED", {
              conversationCreated: newConversation,
            });

            return {
              conversationId: newConversation.id,
            };
          }
        } catch (error: any) {
          console.log("existingConversationError", error);
          throw new GraphQLError("Error getting existing conversation");
        }
      } else {
        try {
          const conversation = await prisma.conversation.create({
            data: {
              participants: {
                createMany: {
                  data: participantIds.map((id) => ({
                    userId: id,
                    hasSeenLatestMessage: id === userId,
                  })),
                },
              },
            },
            include: conversationPopulated,
          });

          // emit a CONVERSATION_CREATED event using pubsub
          pubsub.publish("CONVERSATION_CREATED", {
            conversationCreated: conversation,
          });

          return {
            conversationId: conversation.id,
          };
        } catch (error) {
          console.log("createConversationError", error);
          throw new GraphQLError("Error creating conversation");
        }
      }
    },
    markConversationAsRead: async function (
      _: any,
      args: { userId: string; conversationId: string },
      context: GraphQLContext
    ): Promise<boolean> {
      const { session, prisma } = context;
      const { userId, conversationId } = args;

      if (!session?.user) {
        throw new GraphQLError("Not authorized");
      }

      try {
        const participant = await prisma.conversationParticipant.findFirst({
          where: {
            userId,
            conversationId,
          },
        });

        if (!participant) {
          throw new GraphQLError("Participant entity not found");
        }

        await prisma.conversationParticipant.update({
          where: {
            id: participant.id,
          },
          data: {
            hasSeenLatestMessage: true,
          },
        });
        return true;
      } catch (error: any) {
        console.log("markConversationAsRead error", error);
        throw new GraphQLError(error?.message);
      }
    },
  },
  Subscription: {
    conversationCreated: {
      subscribe: withFilter(
        (_: any, __: any, context: GraphQLContext) => {
          const { pubsub } = context;
          return pubsub.asyncIterator(["CONVERSATION_CREATED"]);
        },
        (
          payload: ConversationCreatedSubscriptionPayload,
          _: any,
          context: GraphQLContext
        ) => {
          const { session } = context;

          if (!session?.user) {
            throw new GraphQLError("Not authorized");
          }

          const {
            conversationCreated: { participants },
          } = payload;

          const userIsParticipant = userIsConversationParticipant(
            participants,
            session.user.id
          );

          return userIsParticipant;
        }
      ),
    },
    conversationUpdated: {
      subscribe: withFilter(
        (_: any, __: any, context: GraphQLContext) => {
          const { pubsub } = context;

          return pubsub.asyncIterator(["CONVERSATION_UPDATED"]);
        },
        (
          payload: ConversationUpdatedSubscriptionPayload,
          _: any,
          context: GraphQLContext
        ) => {
          const { session } = context;

          if (!session?.user) {
            throw new GraphQLError("Not authorized");
          }

          const { id: userId } = session.user;
          const {
            conversationUpdated: {
              conversation: { participants },
            },
          } = payload;

          return userIsConversationParticipant(participants, userId);
        }
      ),
    },
  },
};

export const participantPopulated =
  Prisma.validator<Prisma.ConversationParticipantInclude>()({
    user: {
      select: {
        id: true,
        email: true,
        image: true,
        name: true,
        //@ts-ignore
        publicKey: true,
      },
    },
  });

export const conversationPopulated =
  Prisma.validator<Prisma.ConversationInclude>()({
    participants: {
      //@ts-ignore
      include: participantPopulated,
    },
    latestMessage: {
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
          },
        },
      },
    },
  });

export default resolvers;
