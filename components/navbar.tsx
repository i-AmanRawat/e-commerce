import { auth, UserButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { StoreSwitcher } from "@/components/store-switcher";
import MainNav from "@/components/main-nav";
import prismadb from "@/lib/prismadb";

export default async function Navbar() {
  const { userId } = auth();

  if (!userId) redirect("/sign-in");

  const stores = await prismadb.store.findMany({
    where: {
      userId,
    },
  });

  return (
    <div className="border-b">
      <div className="flex h-16 justify-center px-4">
        <div className="flex items-center pr-3">
          <StoreSwitcher items={stores} />
        </div>

        <MainNav />

        <div className="ml-auto flex items-center space-x-4">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
}
