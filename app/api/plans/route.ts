import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Plan from "@/models/Plan";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    // Only fetch active plans
    const plans = await Plan.find({ isActive: true }).sort({ price: 1 });
    return NextResponse.json(plans);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch plans" }, { status: 500 });
  }
}
