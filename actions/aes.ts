"use server";

const CryptoJS = require("crypto-js");

export const encryptPassword = async (plainPassword: string) => {
  return await CryptoJS.AES.encrypt(
    plainPassword,
    process.env.SECRET_KEY!
  ).toString();
};

export const decryptPassword = async (password: string) => {
  return await CryptoJS.AES.decrypt(password, process.env.SECRET_KEY!).toString(
    CryptoJS.enc.Utf8
  );
};
