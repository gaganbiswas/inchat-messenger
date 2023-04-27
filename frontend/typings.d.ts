interface SearchUserInput {
  email: string;
}

interface SearchUsersData {
  searchUsers: Array<SearchedUser>;
}

interface SearchedUser {
  id: string;
  email: string;
  name: string;
  image: string;
}

interface CreateConversationData {
  createConversation: {
    conversationId: string;
  };
}

interface CreateConversationInput {
  participantIds: Array<string>;
}
