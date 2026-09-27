import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getAllIposFromDb, createIpoInDb, updateIpoInDb, deleteIpoFromDb } from "@/lib/db";

async function verifyAdmin() {
  const session = await auth();
  if (!session?.user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  const role = (session.user as any).role;
  if (role !== "admin") {
    return { error: NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 }) };
  }
  return { user: session.user };
}

export async function GET() {
  const authRes = await verifyAdmin();
  if (authRes.error) return authRes.error;

  try {
    const ipos = await getAllIposFromDb();
    return NextResponse.json({ success: true, ipos: ipos || [] });
  } catch (err) {
    console.error("Error fetching ipos for admin:", err);
    return NextResponse.json({ error: "Failed to fetch IPOs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const authRes = await verifyAdmin();
  if (authRes.error) return authRes.error;

  try {
    const body = await req.json();
    if (!body.name) {
      return NextResponse.json({ error: "IPO Name is required" }, { status: 400 });
    }

    const newIpo = await createIpoInDb(body);
    return NextResponse.json({ success: true, ipo: newIpo });
  } catch (err) {
    console.error("Error creating IPO:", err);
    return NextResponse.json({ error: "Failed to create IPO" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const authRes = await verifyAdmin();
  if (authRes.error) return authRes.error;

  try {
    const body = await req.json();
    const { id, ...partial } = body;

    if (!id) {
      return NextResponse.json({ error: "IPO id is required" }, { status: 400 });
    }

    const updated = await updateIpoInDb(id, partial);
    if (!updated) {
      return NextResponse.json({ error: "IPO not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, ipo: updated });
  } catch (err) {
    console.error("Error updating IPO:", err);
    return NextResponse.json({ error: "Failed to update IPO" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const authRes = await verifyAdmin();
  if (authRes.error) return authRes.error;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id parameter required" }, { status: 400 });
    }

    const success = await deleteIpoFromDb(id);
    return NextResponse.json({ success });
  } catch (err) {
    console.error("Error deleting IPO:", err);
    return NextResponse.json({ error: "Failed to delete IPO" }, { status: 500 });
  }
}
