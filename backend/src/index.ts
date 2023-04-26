import { makeExecutableSchema } from "@graphql-tools/schema";
import { PrismaClient } from "@prisma/client";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import { createServer } from "http";
import resolvers from "./graphql/resolvers";
import typeDefs from "./graphql/typeDefs";
import { GraphQLContext, Session } from "./util/types";
import * as dotenv from "dotenv";
import cors from "cors";
import pkg from "body-parser";
import { getServerSession } from "./util/function";

const { json } = pkg;

const main = async () => {
  dotenv.config();

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const app = express();
  const httpServer = createServer(app);

  const prisma = new PrismaClient();

  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    cache: "bounded",
  });
  await server.start();

  const corsOptions = {
    origin: process.env.BASE_URL,
    credentials: true,
  };

  app.use(
    "/graphql",
    cors<cors.CorsRequest>(corsOptions),
    json(),
    expressMiddleware(server, {
      context: async ({ req }): Promise<GraphQLContext> => {
        const session = await getServerSession(req.headers.cookie);
        return { session: session as Session, prisma };
      },
    })
  );

  const PORT = 4000;

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: PORT }, resolve)
  );
  console.log(`Server is now running on http://localhost:${PORT}/graphql`);
};

main().catch((err) => console.log(err));
