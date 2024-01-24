"use client";

import { Avatar } from "@nextui-org/avatar";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import { getUserDetails } from "@/actions/auth";
import { useEffect, useState } from "react";
import { Spinner } from "@nextui-org/spinner";
import { useRouter } from "next/navigation";

type UserAvatarProps = {
  className?: string;
};

type UserDetailsProps = {
  id: string;
  email: string;
  avatarUrl: string;
};

export default function UserAvatar({ className }: UserAvatarProps) {
  const [userDetails, setUserDetails] = useState<UserDetailsProps>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const getUserDetails = async () => {
    const res = await fetch("/api/auth/current-user").then((res) => res.json());
    return res.user;
  };

  const logout = async () => {
    const res = await fetch("/api/auth/logout").then((res) => res.json());
    if (res.message === "request successful") router.replace("/auth/login");
  };

  useEffect(() => {
    setLoading(true);
    getUserDetails().then((details) => setUserDetails(details));
    setLoading(false);
  }, []);

  return (
    <Dropdown>
      <DropdownTrigger>
        {loading ? (
          <Spinner size="sm" />
        ) : (
          <Avatar
            className={className}
            size="sm"
            isBordered
            color="primary"
            src={userDetails?.avatarUrl}
          />
        )}
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem key="profile" onClick={() => getUserDetails()}>
          Profile
        </DropdownItem>
        <DropdownItem
          key="logout"
          className="text-[#ce3939] hover:bg-[#7e28286e]"
          onClick={() => logout()}
        >
          Logout
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
