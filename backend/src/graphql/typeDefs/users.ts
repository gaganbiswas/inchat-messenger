import gql from "graphql-tag";

const typeDefs = gql`
  scalar Date

  type User {
    id: String
    email: String
    name: String
    image: String
    emailVerified: Boolean
    publicKey: String
  }

  type Query {
    searchUsers(email: String!): [User]
  }
`;

export default typeDefs;
