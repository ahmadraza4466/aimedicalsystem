"use client";

import Error from "@/components/ui/error";
import Input from "@/components/ui/input";
import Logo from "@/components/ui/logo";
import Popup from "@/components/ui/popup";
import SubmitButton from "@/components/ui/submit-button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaGoogle, FaFacebookF } from "react-icons/fa6";
import { MdPerson, MdMail, MdPassword } from "react-icons/md";

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const submitForm = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(formData),
    }).then((res) => res.json());
    if (res.message === "verification email sent") {
      setError("");
      setEmailSent(true);
      setLoading(false);
    } else {
      setLoading(false);
      setError(res.message);
    }
  };

  return (
    <div className="px-7 md:px-0 h-screen flex flex-col md:flex-row md:justify-normal md:py-0 bg-gradient-to-br from-[#15222E] md:from-[#191919] via-[#191919] to-[#191919] md:bg-[#191919] text-white">
      <div className="md:pl-16 md:h-full mt-5 md:mt-0 md:w-[45%] mb-20 md:flex md:flex-col justify-center md:bg-gradient-to-r from-[#15222E] to-[#0a0a0a]">
        <Logo />
        <h1 className="text-3xl font-bold">Get your answers in seconds.</h1>
      </div>
      <div className="md:w-[55%] md:flex md:flex-col md:justify-center md:items-center">
        <form className="md:w-[50%]" onSubmit={submitForm}>
          <p className="pb-2">Continue with</p>
          <Input
            onChange={(e) => {
              setFormData({ ...formData, username: e.target.value });
            }}
            type="text"
            required={true}
            placeholder="Name"
            startContent={<MdPerson className="pl-2 text-3xl" />}
            className="mb-2"
          />
          <Input
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            type="email"
            required={true}
            placeholder="Email"
            startContent={<MdMail className="pl-2 text-3xl" />}
            className="mb-2"
          />
          <Input
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            type="text-or-password"
            required={true}
            placeholder="Password"
            startContent={<MdPassword className="pl-2 text-3xl" />}
            className="mb-2"
            endContent={true}
          />
          <Input
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            type={"text-or-password"}
            required={true}
            placeholder="Confirm Password"
            startContent={<MdPassword className="pl-2 text-3xl" />}
            className="mb-2"
            endContent={true}
          />
          <Error message={error} />
          <SubmitButton text="Sign Up" loading={loading} />
        </form>
        {emailSent ? (
          <Popup
            text={`A verification link has been sent to ${formData.email}, kindly verify your email`}
          />
        ) : null}
        <h3 className="text-center py-2 md:w-[50%]">or</h3>
        <div className="grid grid-cols-2 gap-2 md:w-[50%]">
          <button className="bg-[#121212] border border-[#2A2929] rounded-lg h-14 flex justify-center items-center active:scale-95 duration-100">
            <FaGoogle className="text-xl" />
          </button>
          <button className="bg-[#121212] border border-[#2A2929] rounded-lg h-14 flex justify-center items-center active:scale-95 duration-100">
            <FaFacebookF className="text-xl" />
          </button>
        </div>
        <div className="text-sm font-light pt-2 text-center  md:w-[50%]">
          <span>
            Already have an account ?{" "}
            <Link href={"/auth/login"} className="underline font-bold">
              Log In
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
