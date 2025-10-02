import { NextRequest, NextResponse } from "next/server";
import { getAuthFromCookies } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import Transaction from "@/models/Transaction";

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthFromCookies();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const transactions = await Transaction.find({ userId: session.sub })
      .sort({ createdAt: -1 })
      .select("plan amount currency status cardLast4 cardBrand createdAt stripePaymentIntentId");

    return NextResponse.json({ transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
