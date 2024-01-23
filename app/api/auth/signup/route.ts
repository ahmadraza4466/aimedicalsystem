import { db } from "@/db";
import { users } from "@/db/schema/schema";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import { faker } from "@faker-js/faker";
import { cookies } from "next/headers";
const CryptoJS = require("crypto-js");
import jwt from "jsonwebtoken";
import sgMail from "@sendgrid/mail";

export async function POST(req: NextRequest) {
  const userData = await req.json();
  if (userData.password !== userData.confirmPassword)
    return Response.json(
      { message: "passwords do not match" },
      { status: 400 }
    );

  if (Object.values(userData).some((v) => v === null || v === ""))
    return Response.json(
      { message: "please fill all fields" },
      { status: 400 }
    );

  const existingUser = await db
    .select()
    .from(users)
    .limit(1)
    .where(eq(users.email, userData.email));

  if (existingUser.length !== 0) {
    return Response.json({ message: "user already exists" }, { status: 400 });
  } else {
    const encryptedPassword = await CryptoJS.AES.encrypt(
      userData.password,
      process.env.SECRET_KEY!
    ).toString();
    const avatarUrl = faker.image.avatarGitHub();
    await db.insert(users).values({
      name: userData.username,
      email: userData.email,
      password: encryptedPassword,
      avatarUrl: avatarUrl,
    });

    const newUser = await db
      .select()
      .from(users)
      .limit(1)
      .where(eq(users.email, userData.email));

    const accessToken = jwt.sign(
      {
        id: newUser[0].id,
        email: newUser[0].email,
        avatarUrl: newUser[0].avatarUrl,
        emailVerified: newUser[0].emailVerified!,
        exp: Math.floor(Date.now() / 1000) + 600,
      },
      process.env.REFRESH_TOKEN!
    );

    cookies().set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      path: "/",
    });

    sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
    const currentYear = new Date().getFullYear();
    const currentAccessToken = cookies().get("accessToken")?.value;
    cookies().delete("accessToken");
    const url = `${
      new URL(req.url).origin
    }/verification?token=${currentAccessToken}`;

    const msg = {
      to: newUser[0].email,
      from: "sheryar@infotechies.com",
      subject: "Verify your AiBot email address",
      html: `
          <head>
            <title>Verify your AiBot email address</title>
            <style>
              body {
                font-family: Arial, sans-serif;
              }
              .container {
                width: 80%;
                margin: auto;
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 5px;
              }
              .logo {
                width: 65px;
                margin: 0.7em 0;
              }
              .button {
                background-color: #3395ff;
                border: none;
                color: white;
                padding: 15px 32px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 16px;
                margin: 4px 2px;
                cursor: pointer;
              }
              .small-text {
                font-size: smaller;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <img
                class="logo"
                src="https://i.ibb.co/LhRQChH/aibot-logo.png"
                alt="AiBot Logo"
              />
              <h2>Verify your AiBot email address</h2>
              <p>Hi there,</p>
              <p>
                Thank you for getting started with AiBot! we want to make sure it's really you.<br/>
                Please click the button below to verify your email address.
              </p>
              <a href=${url} class="button">Verify Email</a>
              <p>This link will expire 10 minutes after it was sent.</p>
              <p>
                If you did not make this request, you can safely ignore this email.
              </p>
              <p class="small-text">&copy; ${currentYear} AiBot, All Rights Reserved</p>
            </div>
          </body>
      `,
    };

    try {
      await sgMail.send(msg);
      return Response.json(
        { message: "verification email sent" },
        { status: 201 }
      );
    } catch (err) {
      return Response.json({ message: "request failed" }, { status: 500 });
    }
  }
}
