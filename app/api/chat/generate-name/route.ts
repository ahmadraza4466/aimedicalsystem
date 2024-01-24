import { db } from "@/db";
import { chats } from "@/db/schema/schema";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { StringOutputParser } from "@langchain/core/output_parsers";

type UserDetailsProps = {
  id: string;
  email: string;
  avatarUrl: string;
  emailVerified: boolean;
};

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

const outputParser = new StringOutputParser();

const nameChain = namePrompt.pipe(chatModel).pipe(outputParser);

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    const res = await nameChain.invoke({ input: prompt });
    const user = jwt.decode(
      cookies().get("accessToken")!.value
    ) as UserDetailsProps;
    await db.insert(chats).values({ name: res, userId: user.id });
    return Response.json({
      message: "request successful",
      content: res,
    });
  } catch (error) {
    return Response.json({ message: "request failed", error });
  }
}
