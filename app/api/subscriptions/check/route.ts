import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Transaction from "@/models/Transaction";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId parameter" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check if user has ANY transaction
    const transaction = await Transaction.findOne({ userId: userId });
    const hasTransaction = !!transaction;

    return NextResponse.json({
      hasTransaction
    });

  } catch (error: any) {
    console.error("Check subscription error:", error);
    return NextResponse.json(
      { error: "Failed to check subscription status" },
      { status: 500 }
    );
  }
}
