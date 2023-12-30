"use client";
import { refreshAccessToken } from "@/actions/auth";
import { redirect } from "next/navigation";
import { useEffect, useRef } from "react";

export default async function Home() {
  redirect("/chats");
}
