import gql from "graphql-tag";

const typeDefs = gql`
  type User {
    id: String
    email: String
    name: String
    image: String
  }

  type Query {
    searchUsers(email: String!): [User]
  }
`;

export default typeDefs;
