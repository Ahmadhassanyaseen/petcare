import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { connectToDatabase } from "@/lib/mongoose";
import Transaction from "../../../models/Transaction";
import User from "../../../models/User";
import Subscription from "../../../models/Subscription";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

const PLAN_PRICES = {
  basic: 999, // $9.99
  premium: 1999, // $19.99
  professional: 2999, // $29.99
};

export async function POST(req: NextRequest) {
  try {
    const { paymentIntentId, userId, total_time } = await req.json();

    if (!paymentIntentId || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Get the payment intent to retrieve plan and amount info
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 400 }
      );
    }

    const plan = paymentIntent.metadata?.plan;
    const amount = paymentIntent.amount;

    if (!plan || !amount) {
      return NextResponse.json(
        { error: "Invalid payment intent" },
        { status: 400 }
      );
    }

    // Create transaction record
    const transaction = await Transaction.create({
      userId,
      plan,
      amount,
      currency: "usd",
      stripePaymentIntentId: paymentIntent.id,
      status: "completed",
    });

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    user.total_time = (user.total_time || 0) + parseInt(total_time);
    await user.save();

    if (paymentIntent.status === "succeeded") {
      // Get the charge details
      const charges = await stripe.charges.list({
        payment_intent: paymentIntent.id,
        limit: 1,
      });

      if (charges.data.length > 0) {
        const charge = charges.data[0];

        // Update transaction with charge details
        transaction.stripeChargeId = charge.id;
        if (charge.payment_method_details?.card) {
          transaction.cardLast4 = charge.payment_method_details.card.last4 || undefined;
          transaction.cardBrand = charge.payment_method_details.card.brand || undefined;
        }
        await transaction.save();

        // Create or update subscription
        await Subscription.findOneAndUpdate(
          { userId },
          {
            userId,
            plan,
            status: "active",
            stripeCustomerId: charge.customer as string || "",
            stripeSubscriptionId: paymentIntent.id,
          },
          { upsert: true, new: true }
        );
      }
    }

    return NextResponse.json({
      success: true,
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
      transactionId: transaction._id,
    });

  } catch (error: any) {
    console.error("Payment processing error:", error);

    // Handle specific Stripe errors
    if (error.type === "StripeCardError") {
      return NextResponse.json(
        { error: error.message || "Your card was declined. Please try a different payment method." },
        { status: 400 }
      );
    }

    if (error.type === "StripeRateLimitError") {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a moment." },
        { status: 429 }
      );
    }

    if (error.type === "StripeInvalidRequestError") {
      return NextResponse.json(
        { error: "Invalid payment information. Please check your details and try again." },
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

    // Handle database errors
    if (error.name === "ValidationError") {
      return NextResponse.json(
        { error: "Invalid data provided. Please check your information." },
        { status: 400 }
      );
    }

    if (error.name === "MongoNetworkError" || error.name === "MongoTimeoutError") {
      return NextResponse.json(
        { error: "Database temporarily unavailable. Please try again." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Payment processing failed. Please try again or contact support if the issue persists." },
      { status: 500 }
    );
  }
}
