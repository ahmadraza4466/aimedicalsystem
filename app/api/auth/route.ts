// import sgMail from "@sendgrid/mail";
// import { cookies } from "next/headers";
// import jwt from "jsonwebtoken";
// import { db } from "@/db";
// import { users } from "@/db/schema/schema";
// import { eq } from "drizzle-orm";
// const CryptoJS = require("crypto-js");

// type NewAccessTokenProps = {
//   id: string;
//   email: string;
//   avatarUrl: string;
//   emailVerified: boolean;
// };

// type UserDetailsProps = {
//   id: string;
//   email: string;
//   avatarUrl: string;
//   emailVerified: boolean;
// };

// export const setCookies = (name: string, value: string) => {
//   return cookies().set(name, value, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV !== "development",
//     sameSite: "strict",
//     path: "/",
//   });
// };

// export const encryptPassword = async (plainPassword: string) => {
//   return await CryptoJS.AES.encrypt(
//     plainPassword,
//     process.env.SECRET_KEY!
//   ).toString();
// };

// export const decryptPassword = async (password: string) => {
//   return await CryptoJS.AES.decrypt(password, process.env.SECRET_KEY!).toString(
//     CryptoJS.enc.Utf8
//   );
// };

// export const newAccessToken = ({
//   id,
//   email,
//   avatarUrl,
//   emailVerified,
// }: NewAccessTokenProps) => {
//   return jwt.sign(
//     {
//       id,
//       email,
//       avatarUrl,
//       emailVerified,
//       exp: Math.floor(Date.now() / 1000) + 600,
//     },
//     process.env.REFRESH_TOKEN!
//   );
// };

// export const refreshAccessToken = async (): Promise<string> => {
//   const prevAccessToken = cookies().get("accessToken")?.value;
//   const userDetails = jwt.decode(prevAccessToken!) as UserDetailsProps;
//   const newAccessToken = jwt.sign(
//     { ...userDetails, exp: Math.floor(Date.now() / 1000) + 600 },
//     process.env.REFRESH_TOKEN!
//   );
//   cookies().set("accessToken", newAccessToken, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV !== "development",
//     sameSite: "strict",
//     path: "/",
//   });
//   return newAccessToken;
// };

// export const decodeUserToken = async () => {
//   return jwt.decode(cookies().get("accessToken")!.value) as UserDetailsProps;
// };

// export const verifyToken = async (token: string) => {
//   try {
//     jwt.verify(token, process.env.REFRESH_TOKEN!);
//     const user = jwt.decode(token) as UserDetailsProps;
//     await db
//       .update(users)
//       .set({ emailVerified: true })
//       .where(eq(users.email, user.email));
//     cookies().set("accessToken", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV !== "development",
//       sameSite: "strict",
//       path: "/",
//     });
//     return "verification successful";
//   } catch (err) {
//     return "verification failed";
//   }
// };

// export const verifyEmail = async (email: string) => {
//   sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
//   const currentYear = new Date().getFullYear();
//   const accessToken = cookies().get("accessToken")?.value;
//   cookies().delete("accessToken");
//   const url = `${process.env.CURRENT_HOSTNAME}/verification?token=${accessToken}`;

//   const msg = {
//     to: email,
//     from: "sheryar@infotechies.com",
//     subject: "Verify your AiBot email address",
//     html: `
//           <head>
//             <title>Verify your AiBot email address</title>
//             <style>
//               body {
//                 font-family: Arial, sans-serif;
//               }
//               .container {
//                 width: 80%;
//                 margin: auto;
//                 padding: 20px;
//                 border: 1px solid #ddd;
//                 border-radius: 5px;
//               }
//               .logo {
//                 width: 65px;
//                 margin: 0.7em 0;
//               }
//               .button {
//                 background-color: #3395ff;
//                 border: none;
//                 color: white;
//                 padding: 15px 32px;
//                 text-align: center;
//                 text-decoration: none;
//                 display: inline-block;
//                 font-size: 16px;
//                 margin: 4px 2px;
//                 cursor: pointer;
//               }
//               .small-text {
//                 font-size: smaller;
//               }
//             </style>
//           </head>
//           <body>
//             <div class="container">
//               <img
//                 class="logo"
//                 src="https://i.ibb.co/LhRQChH/aibot-logo.png"
//                 alt="AiBot Logo"
//               />
//               <h2>Verify your AiBot email address</h2>
//               <p>Hi there,</p>
//               <p>
//                 Thank you for getting started with AiBot! we want to make sure it's really you.<br/>
//                 Please click the button below to verify your email address.
//               </p>
//               <a href=${url} class="button">Verify Email</a>
//               <p>This link will expire 10 minutes after it was sent.</p>
//               <p>
//                 If you did not make this request, you can safely ignore this email.
//               </p>
//               <p class="small-text">&copy; ${currentYear} AiBot, All Rights Reserved</p>
//             </div>
//           </body>
//       `,
//   };

//   try {
//     await sgMail.send(msg);
//     return "request successful";
//   } catch (err) {
//     return "request failed";
//   }
// };
