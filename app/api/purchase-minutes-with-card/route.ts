// ============================================
// FILE 1: app/api/minutes/purchase/route.ts
// ============================================
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getAuthFromCookies } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import Card from "@/models/Card";
import Transaction from "@/models/Transaction";
import User from "@/models/User";

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
    const session = await getAuthFromCookies();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { minutes, userId, cardId } = await req.json();

    if (!minutes || !userId || !cardId) {
      return NextResponse.json(
        { error: "Missing required parameters: minutes, userId, cardId" },
        { status: 400 }
      );
    }

    const minutesPackage = MINUTES_PACKAGES[minutes.toString() as keyof typeof MINUTES_PACKAGES];

    if (!minutesPackage) {
      return NextResponse.json(
        { error: `Invalid minutes package: ${minutes}. Available packages: 20, 40, 60 minutes` },
        { status: 400 }
      );
    }

    if (userId !== session.sub) {
      return NextResponse.json(
        { error: "Unauthorized to use this card" },
        { status: 403 }
      );
    }

    console.log("Card authorization check passed for user:", session.sub);

    await connectToDatabase();

    const card = await Card.findOne({
      _id: cardId,
      userId: session.sub,
    });

    if (!card) {
      return NextResponse.json(
        { error: "Card not found" },
        { status: 404 }
      );
    }

    console.log("Card found:", {
      id: card._id,
      userId: card.userId,
      cardBrand: card.cardBrand,
      last4: card.last4,
      stripePaymentMethodId: card.stripePaymentMethodId ? 'present' : 'missing'
    });

    // Check if we have a valid Stripe payment method ID
    if (!card.stripePaymentMethodId) {
      return NextResponse.json(
        { error: "No valid payment method found for this card. Please add a new card." },
        { status: 400 }
      );
    }

    const paymentMethodId = card.stripePaymentMethodId;

    console.log("Creating PaymentIntent:", {
      amount: minutesPackage.price,
      currency: "usd",
      paymentMethodId: paymentMethodId?.slice(-4),
      minutes: minutes
    });

    // Create and confirm PaymentIntent in one step
    const paymentIntent = await stripe.paymentIntents.create({
      amount: minutesPackage.price,
      currency: "usd",
      payment_method: paymentMethodId,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
      metadata: {
        type: "minutes",
        minutes: minutes.toString(),
        userId: session.sub,
      },
      return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/payment/success`,
    });

    console.log("PaymentIntent created and confirmed:", {
      id: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount
    });

    if (paymentIntent.status !== "succeeded") {
      console.error("PaymentIntent failed:", paymentIntent.last_payment_error);
      return NextResponse.json(
        { error: `Payment failed: ${paymentIntent.last_payment_error?.message || 'Unknown error'}` },
        { status: 400 }
      );
    }

    // Create transaction record
    const transaction = await Transaction.create({
      userId: session.sub,
      plan: `${minutesPackage.minutes} Minutes`,
      amount: minutesPackage.price,
      currency: "usd",
      stripePaymentIntentId: paymentIntent.id,
      status: "completed",
    });

    // Update transaction with charge details
    const charges = await stripe.charges.list({
      payment_intent: paymentIntent.id,
      limit: 1,
    });

    if (charges.data.length > 0) {
      const charge = charges.data[0];
      transaction.stripeChargeId = charge.id;
      if (charge.payment_method_details?.card) {
        transaction.cardLast4 = charge.payment_method_details.card.last4 || undefined;
        transaction.cardBrand = charge.payment_method_details.card.brand || undefined;
      }
      await transaction.save();
    }

    // Add minutes to user's total_time
    const user = await User.findById(session.sub);
    if (user) {
      const currentMinutes = user.total_time || 0;
      user.total_time = currentMinutes + minutesPackage.minutes;
      await user.save();
    } else {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
      transactionId: transaction._id,
      minutesAdded: minutesPackage.minutes,
    });

  } catch (error: any) {
    console.error("Minutes purchase with card error:", error);

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
      { error: "Minutes purchase failed. Please try again or contact support if the issue persists." },
      { status: 500 }
    );
  }
}