import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { connectToDatabase } from "@/lib/mongoose";
import User from "../../../models/User";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
    }

    await connectToDatabase();

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription"],
    });

    if (!session || !session.subscription) {
      return NextResponse.json({ error: "Invalid or incomplete session" }, { status: 400 });
    }

    const subscription = session.subscription as Stripe.Subscription;
    const userId = session.metadata?.userId;

    if (!userId) {
      return NextResponse.json({ error: "User not found in metadata" }, { status: 400 });
    }

    // Update user with subscription details
    const user = await User.findById(userId);
    if (user) {
      user.stripeSubscriptionId = subscription.id;
      user.activePlan = session.metadata?.minutes;
      await user.save();
    }

    return NextResponse.json({
      success: true,
      subscription,
      minutes: session.metadata?.minutes,
    });
  } catch (err: any) {
    console.error("Verify subscription error:", err);
    return NextResponse.json({ error: "Failed to verify subscription" }, { status: 500 });
  }
}
