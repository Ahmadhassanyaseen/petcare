import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Transaction, { ITransaction } from "../../../models/Transaction";

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

    // Find the latest transaction with plan = "basic" or "premium"
    const latestSubscription = await Transaction.findOne({
      userId: userId,
      plan: { $in: ["basic", "premium"] },
      status: "completed"
    }).sort({ createdAt: -1 }) as ITransaction | null; // Sort by createdAt descending to get the latest

    if (!latestSubscription) {
      return NextResponse.json({
        subscription: null,
        message: "No subscription found"
      });
    }

    return NextResponse.json({
      subscription: {
        id: (latestSubscription as any)._id.toString(),
        userId: latestSubscription.userId,
        plan: latestSubscription.plan,
        amount: latestSubscription.amount,
        currency: latestSubscription.currency,
        status: latestSubscription.status,
        createdAt: latestSubscription.createdAt,
        updatedAt: latestSubscription.updatedAt
      }
    });

  } catch (error: any) {
    console.error("Get latest subscription error:", error);
    return NextResponse.json(
      { error: "Failed to fetch latest subscription" },
      { status: 500 }
    );
  }
}
