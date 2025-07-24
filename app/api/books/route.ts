import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const books = await prisma.book.findMany({
    orderBy: {
      title: "asc",
    },
  });
  return NextResponse.json(books);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.title || !body.author) {
    return NextResponse.json({ error: "Title and author are required" }, { status: 400 });
  }

  const book = await prisma.book.create({
    data: body,
  });

  return NextResponse.json(book);
}