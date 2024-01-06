"use client";

import { logout } from "@/actions/auth";
import { verifyToken } from "@/actions/jwt";
import Logo from "@/components/ui/logo";
import Popup from "@/components/ui/popup";
import { cn } from "@/lib/utils";
import { Spinner } from "@nextui-org/spinner";
import { Righteous } from "next/font/google";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const righteous = Righteous({ subsets: ["latin"], weight: "400" });

enum VerificationStatus {
  Pending,
  Success,
  Fail,
}

export default function Verification() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token")!;
  const router = useRouter();

  const [verification, setVerification] = useState<VerificationStatus>(
    VerificationStatus.Pending
  );

  useEffect(() => {
    verifyToken(token).then((res) => {
      if (res === "verification successful")
        setVerification(VerificationStatus.Success);
      else setVerification(VerificationStatus.Fail);
    });
  }, []);

  return (
    <div className="flex flex-col h-screen justify-center items-center">
      {verification === VerificationStatus.Success ? (
        <Popup
          title="Verification Successful 🎉"
          text="Let's head to chats page & start chatting 😇"
          buttonText="Let's Go"
          onClick={() => router.replace("/chats")}
        />
      ) : verification === VerificationStatus.Fail ? (
        <Popup
          title="Verification Failed 😟"
          text={`This link has been expired kindly generate new one\n\nSteps:\n1. Go the login page and try to login\n2. We will send verification link to your email\n3. Go to your mail app and verify your email\n4. That's all 👍`}
          onClick={logout}
        />
      ) : null}
      <div className="flex gap-x-4 items-center mb-11">
        <Logo />
        <h2 className={cn("text-3xl", righteous.className)}>AiBot</h2>
      </div>
      {verification === VerificationStatus.Pending ? (
        <div>
          <p className="text-lg flex items-center gap-x-4 mb-5">
            Verifying your email <Spinner size="md" />
          </p>
          <p>You will be redirected to the home page in a few seconds.</p>
        </div>
      ) : (
        false
      )}
    </div>
  );
}
