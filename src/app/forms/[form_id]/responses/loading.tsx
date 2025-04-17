import { Loader } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-full flex-grow items-center justify-center">
      <Loader className="h-8 w-8 animate-spin" />
    </div>
  );
}
