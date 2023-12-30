"use client";

import { Avatar } from "@nextui-org/avatar";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import { logout, getUserDetails } from "@/actions/auth";
import { useEffect, useState } from "react";
import { Spinner } from "@nextui-org/spinner";

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
