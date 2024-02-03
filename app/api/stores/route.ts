import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId } = auth();

    const { name } = body;

    if (!userId) return new NextResponse("Unauthorized!", { status: 500 });

    if (!name) return new NextResponse("Name is required!", { status: 400 });

    const store = prismadb.store.create({
      data: {
        name,
        userId,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log("[STORES][Post]", error);
  }
}
