import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { db } from "@/db";
import { chatMessages, chats } from "@/db/schema/schema";
import { desc, eq } from "drizzle-orm";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

type UserDetailsProps = {
  id: string;
  email: string;
  avatarUrl: string;
  emailVerified: boolean;
};

const chatModel = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
});

const chatPrompt = ChatPromptTemplate.fromMessages([
  ["system", "You response should not be more than 20 words"],
  ["user", "{input}"],
]);

const chatChain = chatPrompt.pipe(chatModel);

export async function GET(req: NextRequest) {
  try {
    const user = jwt.decode(
      cookies().get("accessToken")!.value
    ) as UserDetailsProps;

    const userChats = await db
      .select()
      .from(chats)
      .orderBy(desc(chats.createdAt))
      .where(eq(chats.userId, user.id));

    return Response.json({ message: "request successful", chats: userChats });
  } catch (error) {
    return Response.json({ message: "request failed", error });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { chatId, prompt } = await req.json();

    const res = await chatChain.invoke({
      input: prompt,
    });

    await db
      .insert(chatMessages)
      .values({ chatId, content: prompt, userType: "user" });

    await db.insert(chatMessages).values({
      chatId,
      content: res.content.toString(),
      userType: "assistant",
    });

    return Response.json({
      message: "request successful",
      content: res.content,
    });
  } catch (error) {
    return Response.json({
      message: "request failed",
      error,
    });
  }
}
