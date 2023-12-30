"use client";

import { useState } from "react";

type ErrorProps = {
  message: string;
};

export default function Error({ message }: ErrorProps) {
  const [error, setError] = useState("Please fill all fields");
  return <div className="text-sm text-red-500 pl-2 pb-2">{message}</div>;
}
