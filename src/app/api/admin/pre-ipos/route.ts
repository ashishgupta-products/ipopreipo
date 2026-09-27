import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getAllPreIposFromDb, createPreIpoInDb, updatePreIpoInDb, deletePreIpoFromDb } from "@/lib/db";

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
  // Can be accessed by anyone or admin; let's allow public or admin GET
  try {
    const list = await getAllPreIposFromDb();
    return NextResponse.json({ success: true, preIpos: list });
  } catch (err) {
    console.error("Error fetching pre-ipos:", err);
    return NextResponse.json({ error: "Failed to fetch pre-ipos" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const authRes = await verifyAdmin();
  if (authRes.error) return authRes.error;

  try {
    const body = await req.json();
    if (!body.companyName || !body.pricePerShare) {
      return NextResponse.json({ error: "companyName and pricePerShare are required" }, { status: 400 });
    }

    const created = await createPreIpoInDb(body);
    return NextResponse.json({ success: true, preIpo: created });
  } catch (err) {
    console.error("Error creating pre-ipo:", err);
    return NextResponse.json({ error: "Failed to create pre-ipo" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const authRes = await verifyAdmin();
  if (authRes.error) return authRes.error;

  try {
    const body = await req.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const updated = await updatePreIpoInDb(id, data);
    if (!updated) {
      return NextResponse.json({ error: "Pre-IPO not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, preIpo: updated });
  } catch (err) {
    console.error("Error updating pre-ipo:", err);
    return NextResponse.json({ error: "Failed to update pre-ipo" }, { status: 500 });
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

    const success = await deletePreIpoFromDb(id);
    return NextResponse.json({ success });
  } catch (err) {
    console.error("Error deleting pre-ipo:", err);
    return NextResponse.json({ error: "Failed to delete pre-ipo" }, { status: 500 });
  }
}
