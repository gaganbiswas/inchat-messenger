import merge from "lodash.merge";
import userResolvers from "./users";
import conversationResolvers from "./conversation";

const resolvers = merge({}, userResolvers, conversationResolvers);

export default resolvers;
