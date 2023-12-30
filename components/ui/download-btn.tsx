import { Button } from "@nextui-org/button";
import { Tooltip } from "@nextui-org/tooltip";
import { BiDownArrowAlt } from "react-icons/bi";

type DownloadButtonProps = {
  onClick?: any;
};
export default function DownloadButton({ onClick }: DownloadButtonProps) {
  return (
    <Tooltip showArrow content="Download as pdf">
      <Button
        isIconOnly
        size="sm"
        variant="bordered"
        className="fixed right-4 top-20 text-2xl border-primary"
        onClick={onClick}
      >
        <BiDownArrowAlt className="" />
      </Button>
    </Tooltip>
  );
}
