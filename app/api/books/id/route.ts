import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const book = await prisma.book.findUnique({
        where: { id },
    });
    return NextResponse.json(book);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const body = await request.json();

    if (!body.title || !body.author) {
        return NextResponse.json({ error: "Title and author are required" }, { status: 400 });
    }

    const book = await prisma.book.update({
        where: { id },
        data: body,
    });

    return NextResponse.json(book);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const book = await prisma.book.delete({
        where: { id },
    });
    return NextResponse.json(book);
}