import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { storeId } = params;

    if (!storeId)
      return new NextResponse("Store ID is required", { status: 400 });

    const billboards = await prismadb.billBoard.findMany({
      where: {
        storeId,
      },
    });

    return NextResponse.json(billboards);
  } catch (error) {
    console.log("[billboards][Get]", error);
  }
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const body = await req.json();
    const { userId } = auth();

    const { imageUrl, label } = body;
    const { storeId } = params;

    if (!userId) return new NextResponse("Unauthenticated!", { status: 500 });

    if (!imageUrl)
      return new NextResponse("Image is required!", { status: 400 });

    if (!label) return new NextResponse("Label is required!", { status: 400 });

    if (!storeId)
      return new NextResponse("Store ID is required", { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!storeByUserId)
      return new NextResponse("Unauthorized!", { status: 403 });

    const billboard = await prismadb.billBoard.create({
      data: {
        imageUrl,
        label,
        storeId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[billboards][Post]", error);
  }
}
