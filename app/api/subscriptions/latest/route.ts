import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import Transaction, { ITransaction } from "@/models/Transaction";
import Plan from "@/models/Plan";

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

    // Fetch all active plan names from the database
    const activePlans = await Plan.find({ isActive: true }).select('name');
    const planNames = activePlans.map(plan => plan.name);

    // Find the latest transaction with any active plan
    const latestSubscription = await Transaction.findOne({
      userId: userId,
      plan: { $in: planNames },
      status: "completed"
    }).sort({ createdAt: -1 }) as ITransaction | null; // Sort by createdAt descending to get the latest

    if (!latestSubscription) {
      return NextResponse.json({
        subscription: null,
        message: "No subscription found"
      });
    }

    // Fetch the plan details for the subscription
    const planDetails = await Plan.findOne({ name: latestSubscription.plan });

    return NextResponse.json({
      subscription: {
        id: (latestSubscription as any)._id.toString(),
        userId: latestSubscription.userId,
        plan: latestSubscription.plan,
        amount: latestSubscription.amount,
        currency: latestSubscription.currency,
        status: latestSubscription.status,
        createdAt: latestSubscription.createdAt,
        updatedAt: latestSubscription.updatedAt,
        planDetails: planDetails ? {
          name: planDetails.name,
          minutes: planDetails.minutes,
          price: planDetails.price,
          interval: planDetails.interval,
          description: planDetails.description,
          features: planDetails.features
        } : null
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
