import { db } from "@/db";
import { chatMessages } from "@/db/schema/schema";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const chatId = searchParams.get("chat-id");

  if (chatId) {
    const messages = await db
      .select({ content: chatMessages.content })
      .from(chatMessages)
      .where(eq(chatMessages.chatId, chatId))
      .orderBy(chatMessages.id);

    return Response.json({ messages });
  }
}
