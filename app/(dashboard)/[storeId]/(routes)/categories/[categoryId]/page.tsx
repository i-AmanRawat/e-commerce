import prismadb from "@/lib/prismadb";
import { CategoryForm } from "./components/category-form";

export default async function BillboardPage({
  params,
}: {
  params: { categoryId: string; billboardId: string };
}) {
  const category = await prismadb.category.findUnique({
    where: {
      id: params.categoryId,
    },
  });

  const billboards = await prismadb.billBoard.findMany({
    where: {
      id: params.billboardId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm initialData={category} billboards={billboards} />
      </div>
    </div>
  );
}
