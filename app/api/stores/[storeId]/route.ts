import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  params: {
    params: { storeId: string };
  }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name } = body;
    const { storeId } = params.params;

    if (!userId) return new NextResponse("Unauthorized!", { status: 401 });

    if (!name) return new NextResponse("Name is required!", { status: 400 });

    if (!storeId)
      return new NextResponse("Store ID is required", { status: 400 });

    const store = await prismadb.store.updateMany({
      where: {
        id: storeId,
        userId,
      },
      data: {
        name,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log("[STORES][storeId][Patch]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  params: {
    params: { storeId: string };
  }
) {
  try {
    const { userId } = auth();
    const { storeId } = params.params;

    if (!userId) return new NextResponse("Unauthorized!", { status: 401 });

    if (!storeId)
      return new NextResponse("Store ID is required", { status: 400 });

    const store = await prismadb.store.deleteMany({
      //userId is not unique thats why not using delete
      where: {
        id: storeId,
        userId,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log("[STORES][storeId][Delete]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
