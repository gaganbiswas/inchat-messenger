import { PrismaClient } from "@prisma/client";
import { NextApiResponse, NextApiRequest } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId, publicKey } = JSON.parse(req.body);

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      //@ts-ignore
      publicKey: publicKey,
    },
  });

  res.status(200).send({ updated: 1 });
}
