// /app/api/create-subscription-setup-intent/route.ts
import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { customerId } = await req.json();

    console.log(customerId);

    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ["card"],
    });
    console.log("SetupIntent created:", setupIntent);

    return NextResponse.json({ clientSecret: setupIntent.client_secret });
  } catch (err: any) {
    console.error("SetupIntent error:", err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
