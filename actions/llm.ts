"use server";

import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { db } from "@/db";
import { chatMessages, chats } from "@/db/schema/schema";
import { getUserDetails } from "./auth";
import { eq } from "drizzle-orm";

const chatModel = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
});

const namePrompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a copywriter with years of experience"],
  [
    "user",
    "Generate me a heading which is between 3 to 6 words in length and does not contain any special characters, that i can use to save the text given below \n{input}\n\n just generate the heading and dont do anything else",
  ],
]);

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You response should not be more than 20 words"],
  ["user", "{input}"],
]);

const chain = prompt.pipe(chatModel);
const nameChain = namePrompt.pipe(chatModel);

export const generateChatName = async ({ prompt }: { prompt: string }) => {
  const res = await nameChain.invoke({ input: prompt });
  const user = await getUserDetails();
  await db
    .insert(chats)
    .values({ name: res.content.toString().trim(), userId: user.id });
  return res.content;
};

export const askLLM = async ({
  chatId,
  prompt,
}: {
  chatId: string;
  prompt: string;
}) => {
  const res = await chain.invoke({
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

  return res.content;
};

export const getChatMessages = async ({ id }: { id: string }) => {
  const messages = await db
    .select({ content: chatMessages.content })
    .from(chatMessages)
    .where(eq(chatMessages.chatId, id))
    .orderBy(chatMessages.id);

  return messages;
};
