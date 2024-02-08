import { Separator } from "@/components/ui/separator";
import { BillboardClient } from "./components/client";

export default function Billboards() {
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient />
      </div>
    </div>
  );
}
