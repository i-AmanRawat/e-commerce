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

    const colors = await prismadb.color.findMany({
      where: {
        storeId,
      },
    });

    return NextResponse.json(colors);
  } catch (error) {
    console.log("[colors][Get]", error);
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

    const color = await prismadb.color.create({
      data: {
        name,
        value,
        storeId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log("[colors][Post]", error);
  }
}
