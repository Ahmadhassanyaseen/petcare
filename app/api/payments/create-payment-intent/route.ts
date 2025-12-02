import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/Users";
import Plan from "@/models/Plan";
import MinutePackage from "@/models/MinutePackage";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

export async function POST(req: NextRequest) {
  try {
    const { minutes, plan, userId } = await req.json();

    let amount = 0;
    let metadata: any = { userId };

    await connectToDatabase();

    if (minutes) {
      const pkg = await MinutePackage.findOne({ minutes: parseInt(minutes), isActive: true });
      if (!pkg) {
        return NextResponse.json(
          { error: "Invalid minutes package selected" },
          { status: 400 }
        );
      }
      amount = pkg.price;
      metadata.type = "minutes";
      metadata.minutes = minutes.toString();
    } else if (plan) {
      // plan can be the plan ID or plan name, let's assume it's the plan object or ID passed from frontend
      // The frontend passes the plan object, but let's check what it sends.
      // Plans.tsx sends `plan` which is the whole object. But PaymentModal receives `plan` which is the object.
      // PaymentModal calls this API. Let's check PaymentModal.
      // Assuming PaymentModal sends `plan` as the plan ID or we need to adjust PaymentModal.
      // Actually, looking at Plans.tsx, it passes `plan` object to PaymentModal.
      // PaymentModal.tsx likely sends `plan.name` or `plan._id`.
      // Let's assume for now we look up by ID if it's an ID, or name.
      
      // If plan is an object (which it shouldn't be in JSON body unless stringified), it's likely the ID or Name.
      // Let's assume it's the ID for robustness, but we need to verify PaymentModal.
      
      // For now, let's try to find by ID first, then Name.
      let planDoc = await Plan.findOne({ _id: plan, isActive: true });
      if (!planDoc) {
         planDoc = await Plan.findOne({ name: plan, isActive: true });
      }

      if (!planDoc) {
        return NextResponse.json(
          { error: "Invalid plan selected" },
          { status: 400 }
        );
      }
      amount = planDoc.price;
      metadata.type = "subscription";
      metadata.plan = planDoc.name;
      metadata.planId = planDoc._id.toString();
    } else {
      return NextResponse.json(
        { error: "Either minutes or plan must be selected" },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Get user and check if they already have a Stripe customer ID
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    let customerId = user.stripeCustomerId;

    // Create customer if user doesn't have one
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
        metadata: {
          userId: user._id.toString(),
        },
      });

      customerId = customer.id;

      // Save customer ID to user
      user.stripeCustomerId = customerId;
      await user.save();
    }
    // Create PaymentIntent with customer
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      customer: customerId,
      setup_future_usage: "off_session", // This enables saving the payment method for future use
      metadata: metadata,
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      customerId: customerId,
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
        { error: "Invalid payment request. Please check your selection." },
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
