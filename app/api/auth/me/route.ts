import { NextResponse } from "next/server";
import { getAuthFromCookies } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/User";

export async function GET() {
  try {
    const payload = await getAuthFromCookies();
    if (!payload) return NextResponse.json({ user: null }, { status: 401 });

    await connectToDatabase();

    const user = await User.findById(payload.sub).select("email name createdAt");
    if (!user) return NextResponse.json({ user: null }, { status: 401 });

    return NextResponse.json({ user: { id: user._id.toString(), email: user.email, name: user.name, createdAt: user.createdAt } });
  } catch (err) {
    console.error("/api/auth/me error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
