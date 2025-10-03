import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

const MINUTES_PRICES = {
  "20": 499, // $4.99 for 20 minutes
  "40": 999, // $9.99 for 40 minutes
  "60": 1499, // $14.99 for 60 minutes
};

export async function POST(req: NextRequest) {
  try {
    const { minutes } = await req.json();

    if (!minutes || !MINUTES_PRICES[minutes as keyof typeof MINUTES_PRICES]) {
      return NextResponse.json(
        { error: "Invalid minutes package selected" },
        { status: 400 }
      );
    }

    const amount = MINUTES_PRICES[minutes as keyof typeof MINUTES_PRICES];

    // Create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      metadata: {
        type: "minutes",
        minutes: minutes.toString(),
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });

  } catch (error: any) {
    console.error("Minutes PaymentIntent creation error:", error);

    // Handle specific Stripe errors
    if (error.type === "StripeCardError") {
      return NextResponse.json(
        { error: error.message || "Invalid card information." },
        { status: 400 }
      );
    }

    if (error.type === "StripeInvalidRequestError") {
      return NextResponse.json(
        { error: "Invalid payment request. Please check your minutes selection." },
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
      { error: "Failed to create payment intent. Please try again or contact support if the issue persists." },
      { status: 500 }
    );
  }
}
