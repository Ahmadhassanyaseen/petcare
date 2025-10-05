import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { connectToDatabase } from "@/lib/mongoose";
import Transaction from "../../../models/Transaction";
import User from "../../../models/User";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

const MINUTES_PACKAGES = {
  "20": { minutes: 20, price: 499 },
  "40": { minutes: 40, price: 999 },
  "60": { minutes: 60, price: 1499 },
};

export async function POST(req: NextRequest) {
  try {
    const { subscriptionId, userId } = await req.json();

    if (!subscriptionId || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const subscription: Stripe.Subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['latest_invoice.payment_intent'],
    });

    console.log("Retrieved subscription:", {
      id: subscription.id,
      status: subscription.status,
      current_period_start: subscription.current_period_start,
      current_period_end: subscription.current_period_end,
    });

    if (subscription.status !== "active") {
      return NextResponse.json(
        { error: "Subscription not active" },
        { status: 400 }
      );
    }

    const minutesStr = subscription.metadata?.minutes;
    const type = subscription.metadata?.type;
    const customerId = subscription.customer as string;

    if (type !== "minutes_subscription" || !minutesStr) {
      return NextResponse.json(
        { error: "Invalid subscription for minutes" },
        { status: 400 }
      );
    }

    const minutesPackage = MINUTES_PACKAGES[minutesStr as keyof typeof MINUTES_PACKAGES];
    if (!minutesPackage) {
      return NextResponse.json(
        { error: "Invalid minutes package" },
        { status: 400 }
      );
    }

    // Create initial transaction record for subscription
    const transaction = await Transaction.create({
      userId,
      plan: `${minutesPackage.minutes} Minutes Monthly Subscription`,
      amount: minutesPackage.price,
      currency: "usd",
      stripeSubscriptionId: subscription.id,
      status: "active",
      subscription: true,
    });

    // Update user with subscription details
    const user = await User.findById(userId);
    if (user) {
      console.log("About to update user with ID:", userId);
      console.log("User found:", user);

      // Add initial minutes
      const currentMinutes = user.total_time || 0;
      user.total_time = currentMinutes + minutesPackage.minutes;

      // Set subscription details
      user.subscription_date = new Date();
      user.subscription_amount = minutesPackage.price / 100; // Convert cents to dollars

      // Set renewal setting - subscriptions are recurring by default
      if (user.renew === undefined) {
        user.renew = true;
      }

      // Mark fields as modified for Mongoose
      user.markModified('subscription_date');
      user.markModified('subscription_amount');
      user.markModified('renew');

      await user.save();
      console.log("User updated:", user);
    } else {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      subscriptionId: subscription.id,
      status: subscription.status,
      transactionId: transaction._id,
      minutesAdded: minutesPackage.minutes,
      nextBillingDate: new Date(subscription.current_period_end * 1000),
    });

  } catch (error: any) {
    console.error("Subscription confirmation error:", error);

    // Handle specific Stripe errors
    if (error.type === "StripeCardError") {
      return NextResponse.json(
        { error: error.message || "Your card was declined. Please try a different payment method." },
        { status: 400 }
      );
    }

    if (error.type === "StripeInvalidRequestError") {
      return NextResponse.json(
        { error: "Invalid subscription information. Please check your details and try again." },
        { status: 400 }
      );
    }

    if (error.type === "StripeAPIError") {
      return NextResponse.json(
        { error: "Payment service temporarily unavailable. Please try again later." },
        { status: 503 }
      );
    }

    if (error.type === "StripeConnectionError") {
      return NextResponse.json(
        { error: "Network error. Please check your connection and try again." },
        { status: 503 }
      );
    }

    if (error.type === "StripeAuthenticationError") {
      return NextResponse.json(
        { error: "Payment service configuration error. Please contact support." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Subscription confirmation failed. Please try again or contact support if the issue persists." },
      { status: 500 }
    );
  }
}
