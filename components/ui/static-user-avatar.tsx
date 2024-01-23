import { getUserDetails } from "@/actions/auth";
import { Avatar } from "@nextui-org/avatar";

export async function UserStaticAvatar({ className }: { className?: string }) {
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
