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
