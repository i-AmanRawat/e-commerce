import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  params: {
    params: { storeId: string; billboardId: string };
  }
) {
  try {
    const { storeId, billboardId } = params.params;

    if (!storeId)
      return new NextResponse("Store ID is required", { status: 400 });

    if (!billboardId)
      return new NextResponse("Billboard ID is required", { status: 400 });

    const billBoard = await prismadb.billBoard.findUnique({
      //storeId is not unique thats why not using delete
      where: {
        id: billboardId,
        storeId,
      },
    });

    return NextResponse.json(billBoard);
  } catch (error) {
    console.log("[BILLBOARD][billboardId][Get]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { imageUrl, label } = body;
    const { storeId, billboardId } = params;

    if (!userId) return new NextResponse("Unauthenticated!", { status: 401 });

    if (!imageUrl)
      return new NextResponse("Image URL is required!", { status: 400 });

    if (!label) return new NextResponse("Label is required!", { status: 400 });

    if (!storeId)
      return new NextResponse("Store ID is required", { status: 400 });

    if (!billboardId)
      return new NextResponse("Billboard ID is required", { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!storeByUserId)
      return new NextResponse("Unauthorized!", { status: 403 });

    const billBoard = await prismadb.billBoard.updateMany({
      where: {
        id: billboardId,
        storeId,
      },
      data: {
        imageUrl,
        label,
      },
    });

    return NextResponse.json(billBoard);
  } catch (error) {
    console.log("[billboard][billboardId][Patch]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  params: {
    params: { storeId: string; billboardId: string };
  }
) {
  try {
    const { userId } = auth();
    const { storeId, billboardId } = params.params;

    if (!userId) return new NextResponse("Unauthenticated!", { status: 401 });

    if (!storeId)
      return new NextResponse("Store ID is required", { status: 400 });

    if (!billboardId)
      return new NextResponse("Billboard ID is required", { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!storeByUserId)
      return new NextResponse("Unauthorized!", { status: 403 });

    const billBoard = await prismadb.billBoard.deleteMany({
      //storeId is not unique thats why not using delete
      where: {
        id: billboardId,
        storeId,
      },
    });

    return NextResponse.json(billBoard);
  } catch (error) {
    console.log("[BILLBOARD][billboardId][Delete]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
