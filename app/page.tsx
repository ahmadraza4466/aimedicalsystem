import { Spinner } from "@nextui-org/spinner";

export default async function Page() {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <Spinner />
    </div>
  );
}
