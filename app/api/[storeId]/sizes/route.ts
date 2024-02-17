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

    const sizes = await prismadb.size.findMany({
      where: {
        storeId,
      },
    });

    return NextResponse.json(sizes);
  } catch (error) {
    console.log("[sizes][Get]", error);
  }
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const body = await req.json();
    const { userId } = auth();

    const { name, value } = body;
    const { storeId } = params;

    if (!userId) return new NextResponse("Unauthenticated!", { status: 500 });

    if (!name) return new NextResponse("Name is required!", { status: 400 });

    if (!value) return new NextResponse("Value is required!", { status: 400 });

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

    const size = await prismadb.size.create({
      data: {
        name,
        value,
        storeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log("[billboards][Post]", error);
  }
}
