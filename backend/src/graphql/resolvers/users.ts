import { User } from "@prisma/client";
import { GraphQLError } from "graphql";
import { GraphQLContext } from "../../util/types";

const resolvers = {
  Query: {
    searchUsers: async function searchUsers(
      _: any,
      args: { email: string },
      context: GraphQLContext
    ): Promise<Array<User>> {
      const { email: searchedEmail } = args;
      const { prisma, session } = context;

      if (!session?.user) {
        throw new GraphQLError("Not authorized");
      }

      if (!searchedEmail) {
        throw new GraphQLError("No email address provided.");
      }

      const {
        user: { email: myEmail },
      } = session;

      try {
        const users = await prisma.user.findMany({
          where: {
            email: {
              contains: searchedEmail,
              not: myEmail,
              mode: "insensitive",
            },
          },
        });

        return users;
      } catch (error: any) {
        console.log("error", error);
        throw new GraphQLError(error?.message);
      }
    },
  },
};

export default resolvers;
