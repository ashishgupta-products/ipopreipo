import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { 
  getAllPaymentAppsFromDb, 
  createPaymentAppInDb, 
  updatePaymentAppInDb, 
  deletePaymentAppFromDb 
} from "@/lib/db";

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
  try {
    const list = await getAllPaymentAppsFromDb();
    return NextResponse.json({ success: true, paymentApps: list });
  } catch (err) {
    console.error("Error fetching payment apps:", err);
    return NextResponse.json({ error: "Failed to fetch payment apps" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const authRes = await verifyAdmin();
  if (authRes.error) return authRes.error;

  try {
    const body = await req.json();
    if (!body.name) {
      return NextResponse.json({ error: "App name is required" }, { status: 400 });
    }

    const created = await createPaymentAppInDb(body);
    return NextResponse.json({ success: true, paymentApp: created });
  } catch (err) {
    console.error("Error creating payment app:", err);
    return NextResponse.json({ error: "Failed to create payment app" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const authRes = await verifyAdmin();
  if (authRes.error) return authRes.error;

  try {
    const body = await req.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: "App ID is required" }, { status: 400 });
    }

    const updated = await updatePaymentAppInDb(id, data);
    if (!updated) {
      return NextResponse.json({ error: "Payment app not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, paymentApp: updated });
  } catch (err) {
    console.error("Error updating payment app:", err);
    return NextResponse.json({ error: "Failed to update payment app" }, { status: 500 });
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

    const success = await deletePaymentAppFromDb(id);
    return NextResponse.json({ success });
  } catch (err) {
    console.error("Error deleting payment app:", err);
    return NextResponse.json({ error: "Failed to delete payment app" }, { status: 500 });
  }
}
