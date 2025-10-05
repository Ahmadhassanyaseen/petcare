import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Transaction from "../../../models/Transaction";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const transactions = await Transaction.find({ userId })
      .sort({ createdAt: -1 })
      .select("plan amount currency status cardLast4 cardBrand createdAt stripePaymentIntentId");

    const transactionData = transactions.map((t: any) => ({
      _id: t._id.toString(),
      plan: t.plan,
      amount: t.amount,
      currency: t.currency,
      status: t.status,
      cardLast4: t.cardLast4,
      cardBrand: t.cardBrand,
      createdAt: t.createdAt.toISOString(),
      stripePaymentIntentId: t.stripePaymentIntentId,
    }));

    return NextResponse.json({
      transactions: transactionData,
    });

  } catch (error: any) {
    console.error("Error fetching transactions:", error);

    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
