import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import MinutePackage from "@/models/MinutePackage";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    // Only fetch active packages
    const packages = await MinutePackage.find({ isActive: true }).sort({ price: 1 });
    return NextResponse.json(packages);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch packages" }, { status: 500 });
  }
}
