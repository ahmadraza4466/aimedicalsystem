"use server";

import { db } from "@/db";
import { chats } from "@/db/schema/schema";
import { getUserDetails } from "./auth";
import { desc, eq } from "drizzle-orm";

export const getChats = async () => {
  try {
    const userId = (await getUserDetails()).id;
    const userChats = await db
      .select()
      .from(chats)
      .orderBy(desc(chats.createdAt))
      .where(eq(chats.userId, userId));
    return userChats;
  } catch (err) {
    console.log(err);
  }
};

// export const createChat = async () => {
//   try {
//     const userId = (await getUserDetails()).id;
//     await db.insert(chats).values({ userId });
//   } catch (err) {
//     console.log(err);
//   }
// };
