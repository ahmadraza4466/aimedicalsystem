import { Avatar } from "@nextui-org/avatar";

export async function UserStaticAvatar({ className }: { className?: string }) {
  const getUserDetails = async () => {
    const res = await fetch("/api/auth/current-user").then((res) => res.json());
    return res.user;
  };
  const avatarUrl = (await getUserDetails()).avatarUrl;

  return (
    <Avatar
      className={className}
      size="sm"
      isBordered
      color="primary"
      src={avatarUrl}
    />
  );
}
