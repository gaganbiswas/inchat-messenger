import { PrismaClient } from "@prisma/client";
import { ISODateString } from "next-auth";

export interface GraphQLContext {
  session: Session | null;
  prisma: PrismaClient;
}

export interface Session {
  user?: User;
  expires: ISODateString;
}

export interface User {
  id: string;
  email: string;
  image: string;
  name: string;
  emailVerified: boolean;
}
