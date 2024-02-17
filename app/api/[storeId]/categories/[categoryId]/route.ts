import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  params: { storeId: string; categoryId: string }
) {
  try {
    const { storeId, categoryId } = params;

    if (!storeId)
      return new NextResponse("Store ID is required", { status: 400 });

    if (!categoryId)
      return new NextResponse("Category ID is required", { status: 400 });

    const category = await prismadb.category.findUnique({
      //storeId is not unique thats why not using delete
      where: {
        id: categoryId,
        storeId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORY][categoryId][Get]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, billboardId } = body;
    const { storeId, categoryId } = params;

    if (!userId) return new NextResponse("Unauthenticated!", { status: 401 });

    if (!name) return new NextResponse("Name is required!", { status: 400 });

    if (!billboardId)
      return new NextResponse("Billboard ID is required!", { status: 400 });

    if (!storeId)
      return new NextResponse("Store ID is required", { status: 400 });

    if (!categoryId)
      return new NextResponse("Category ID is required", { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!storeByUserId)
      return new NextResponse("Unauthorized!", { status: 403 });

    const category = await prismadb.category.updateMany({
      where: {
        id: categoryId,
        storeId,
      },
      data: {
        name,
        billboardId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORY][categoryId][Patch]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  params: { params: { storeId: string; categoryId: string } }
) {
  try {
    const { userId } = auth();
    const { storeId, categoryId } = params.params;

    console.log("store id: ", storeId);
    console.log("category id: ", categoryId);

    if (!userId) return new NextResponse("Unauthenticated!", { status: 401 });

    if (!storeId)
      return new NextResponse("Store ID is required", { status: 400 });

    if (!categoryId)
      return new NextResponse("Category ID is required", { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!storeByUserId)
      return new NextResponse("Unauthorized!", { status: 403 });

    const category = await prismadb.category.deleteMany({
      //storeId is not unique thats why not using delete
      where: {
        id: categoryId,
        storeId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORY][categoryId][Delete]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
