import gql from "graphql-tag";

const typeDefs = gql`
  type Conversation {
    id: String
    latestMessage: Message
    participants: [Participant]
    createdAt: Date
    updatedAt: Date
  }

  type Participant {
    id: String
    user: User
    hasSeenLatestMessage: Boolean
  }

  type Query {
    conversations: [Conversation]
  }

  type Mutation {
    createConversation(participantIds: [String]): CreateConversationResponse
  }

  type Mutataion {
    markConversationAsRead(userId: String!, conversationId: String!): Boolean
  }

  type CreateConversationResponse {
    conversationId: String
  }

  type ConversationUpdatedSubscriptionPayload {
    conversation: Conversation
  }

  type Subscription {
    conversationCreated: Conversation
  }

  type Subscription {
    conversationUpdated: ConversationUpdatedSubscriptionPayload
  }
`;

export default typeDefs;
