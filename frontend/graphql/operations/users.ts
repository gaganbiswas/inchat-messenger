import { gql } from "@apollo/client";

export default {
  Queries: {
    searchUsers: gql`
      query SearchUsers($email: String!) {
        searchUsers(email: $email) {
          id
          email
          image
          name
        }
      }
    `,
  },
};
