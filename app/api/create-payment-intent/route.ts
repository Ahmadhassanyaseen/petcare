import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

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
    const { plan } = await req.json();

    if (!plan || !PLAN_PRICES[plan as keyof typeof PLAN_PRICES]) {
      return NextResponse.json(
        { error: "Invalid plan selected" },
        { status: 400 }
      );
    }

    const amount = PLAN_PRICES[plan as keyof typeof PLAN_PRICES];

    // Create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      metadata: {
        plan,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });

  } catch (error: any) {
    console.error("PaymentIntent creation error:", error);

    // Handle specific Stripe errors
    if (error.type === "StripeCardError") {
      return NextResponse.json(
        { error: error.message || "Invalid card information." },
        { status: 400 }
      );
    }

    if (error.type === "StripeInvalidRequestError") {
      return NextResponse.json(
        { error: "Invalid payment request. Please check your plan selection." },
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
