import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";

interface DashboardPageProps {
  params: { storeId: string };
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
    },
  });

  return <div> Active Store: {store?.name}</div>;
}
