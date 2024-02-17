import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  params: {
    params: { storeId: string; colorId: string };
  }
) {
  try {
    const { storeId, colorId } = params.params;

    if (!storeId)
      return new NextResponse("Store ID is required", { status: 400 });

    if (!colorId)
      return new NextResponse("Color ID is required", { status: 400 });

    const color = await prismadb.color.findUnique({
      //storeId is not unique thats why not using delete
      where: {
        id: colorId,
        storeId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log("[color][colorId][Get]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; colorId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, value } = body;
    const { storeId, colorId } = params;

    if (!userId) return new NextResponse("Unauthenticated!", { status: 401 });

    if (!name) return new NextResponse("Name is required!", { status: 400 });

    if (!value) return new NextResponse("Value is required!", { status: 400 });

    if (!storeId)
      return new NextResponse("Store ID is required", { status: 400 });

    if (!colorId)
      return new NextResponse("Color ID is required", { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!storeByUserId)
      return new NextResponse("Unauthorized!", { status: 403 });

    const color = await prismadb.color.updateMany({
      where: {
        id: colorId,
        storeId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log("[COLOR][colorId][Patch]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  params: {
    params: { storeId: string; colorId: string };
  }
) {
  try {
    const { userId } = auth();
    const { storeId, colorId } = params.params;

    if (!userId) return new NextResponse("Unauthenticated!", { status: 401 });

    if (!storeId)
      return new NextResponse("Store ID is required", { status: 400 });

    if (!colorId)
      return new NextResponse("Color ID is required", { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!storeByUserId)
      return new NextResponse("Unauthorized!", { status: 403 });

    const color = await prismadb.color.deleteMany({
      //storeId is not unique thats why not using delete
      where: {
        id: colorId,
        storeId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log("[COLOR][colorId][Delete]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
