"use server";

import { db } from "@/db";
import { users } from "@/db/schema/schema";
import { faker } from "@faker-js/faker";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import sgMail from "@sendgrid/mail";
import { decodeUserToken, newAccessToken } from "./jwt";
import { updateCookies } from "./cookies";
import { decryptPassword, encryptPassword } from "./aes";

type LoginProps = {
  email: string;
  password: string;
};

export const login = async ({ email, password }: LoginProps) => {
  const user = await db
    .select()
    .from(users)
    .limit(1)
    .where(eq(users.email, email));

  if (user.length !== 0) {
    const plainPassword = await decryptPassword(user[0].password);
    if (plainPassword === password) {
      const accessToken = newAccessToken({
        id: user[0].id,
        email: user[0].email,
        avatarUrl: user[0].avatarUrl,
        emailVerified: user[0].emailVerified!,
      });
      updateCookies("accessToken", accessToken);
      if (user[0].emailVerified !== true) {
        verifyEmail(user[0].email);
        return "Email not verified";
      }
      return "Login successful";
    } else {
      return "Email or password is incorrect";
    }
  } else {
    return "User does not exist";
  }
};

type SignupProps = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export const signup = async ({
  username,
  email,
  password,
  confirmPassword,
}: SignupProps) => {
  try {
    if (password !== confirmPassword) return "Passwords do not match";

    const existingUser = await db
      .select()
      .from(users)
      .limit(1)
      .where(eq(users.email, email));

    if (existingUser.length !== 0) {
      return "User already exists";
    } else {
      const encryptedPassword = await encryptPassword(password);
      const avatarUrl = faker.image.avatarGitHub();
      await db.insert(users).values({
        name: username,
        email: email,
        password: encryptedPassword,
        avatarUrl: avatarUrl,
      });

      const newUser = await db
        .select()
        .from(users)
        .limit(1)
        .where(eq(users.email, email));

      const accessToken = newAccessToken({
        id: newUser[0].id,
        email: newUser[0].email,
        avatarUrl: newUser[0].avatarUrl,
        emailVerified: newUser[0].emailVerified!,
      });

      updateCookies("accessToken", accessToken);
      verifyEmail(newUser[0].email);

      return "Verification email sent";
    }
  } catch (err) {
    return "Something went wrong, please try again later 🤕";
  }
};

export const logout = async () => {
  cookies().delete("accessToken");
  redirect("/auth/login");
};

type UserDetailsProps = {
  id: string;
  email: string;
  avatarUrl: string;
  emailVerified: boolean;
};

export const getUserDetails = async (): Promise<UserDetailsProps> => {
  return await decodeUserToken();
};

export const verifyEmail = async (email: string) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
  const currentYear = new Date().getFullYear();
  const accessToken = cookies().get("accessToken")?.value;
  cookies().delete("accessToken");
  const url = `${process.env.CURRENT_HOSTNAME}/verification?token=${accessToken}`;

  const msg = {
    to: email,
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
    return "request successful";
  } catch (err) {
    return "request failed";
  }
};
