import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  params: {
    params: { storeId: string; sizeId: string };
  }
) {
  try {
    const { storeId, sizeId } = params.params;

    if (!storeId)
      return new NextResponse("Store ID is required", { status: 400 });

    if (!sizeId)
      return new NextResponse("Size ID is required", { status: 400 });

    const size = await prismadb.size.findUnique({
      //storeId is not unique thats why not using delete
      where: {
        id: sizeId,
        storeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log("[SIZE][sizeId][Get]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, value } = body;
    const { storeId, sizeId } = params;

    if (!userId) return new NextResponse("Unauthenticated!", { status: 401 });

    if (!name) return new NextResponse("Name is required!", { status: 400 });

    if (!value) return new NextResponse("Value is required!", { status: 400 });

    if (!storeId)
      return new NextResponse("Store ID is required", { status: 400 });

    if (!sizeId)
      return new NextResponse("Size ID is required", { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!storeByUserId)
      return new NextResponse("Unauthorized!", { status: 403 });

    const size = await prismadb.size.updateMany({
      where: {
        id: sizeId,
        storeId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log("[SIZE][sizeId][Patch]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  params: {
    params: { storeId: string; sizeId: string };
  }
) {
  try {
    const { userId } = auth();
    const { storeId, sizeId } = params.params;

    if (!userId) return new NextResponse("Unauthenticated!", { status: 401 });

    if (!storeId)
      return new NextResponse("Store ID is required", { status: 400 });

    if (!sizeId)
      return new NextResponse("Size ID is required", { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!storeByUserId)
      return new NextResponse("Unauthorized!", { status: 403 });

    const size = await prismadb.size.deleteMany({
      //storeId is not unique thats why not using delete
      where: {
        id: sizeId,
        storeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log("[SIZE][sizeId][Delete]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
