// import { NextRequest, NextResponse } from "next/server";
// import Stripe from "stripe";
// import { connectToDatabase } from "@/lib/mongoose";
// import User from "../../../models/User";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2025-08-27.basil",
// });

// const MINUTES_PRICES = {
//   "20": 499, // $4.99 for 20 minutes
//   "40": 999, // $9.99 for 40 minutes
//   "60": 1499, // $14.99 for 60 minutes
// };

// export async function POST(req: NextRequest) {
//   try {
//     const { minutes, userId } = await req.json();

//     if (!minutes || !MINUTES_PRICES[minutes as keyof typeof MINUTES_PRICES]) {
//       return NextResponse.json(
//         { error: "Invalid minutes package selected" },
//         { status: 400 }
//       );
//     }

//     if (!userId) {
//       return NextResponse.json(
//         { error: "User ID is required" },
//         { status: 400 }
//       );
//     }

//     const amount = MINUTES_PRICES[minutes as keyof typeof MINUTES_PRICES];

//     await connectToDatabase();

//     // Get user and check if they already have a Stripe customer ID
//     const user = await User.findById(userId);
//     if (!user) {
//       return NextResponse.json(
//         { error: "User not found" },
//         { status: 404 }
//       );
//     }

//     let customerId = user.stripeCustomerId;

//     // Create customer if user doesn't have one
//     if (!customerId) {
//       const customer = await stripe.customers.create({
//         email: user.email,
//         name: user.name || undefined,
//         metadata: {
//           userId: user._id.toString(),
//         },
//       });

//       customerId = customer.id;

//       // Save customer ID to user
//       user.stripeCustomerId = customerId;
//       await user.save();
//     }
//     // Create PaymentIntent with customer
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount,
//       currency: "usd",
//       customer: customerId,
//       setup_future_usage: "off_session", // This enables saving the payment method for future use
//       metadata: {
//         type: "minutes",
//         minutes: minutes.toString(),
//         userId: userId,
//       },
//     });

//     return NextResponse.json({
//       clientSecret: paymentIntent.client_secret,
//       customerId: customerId,
//     });

//   } catch (error: any) {
//     console.error("Minutes PaymentIntent creation error:", error);

//     // Handle specific Stripe errors
//     if (error.type === "StripeCardError") {
//       return NextResponse.json(
//         { error: error.message || "Invalid card information." },
//         { status: 400 }
//       );
//     }

//     if (error.type === "StripeInvalidRequestError") {
//       return NextResponse.json(
//         { error: "Invalid payment request. Please check your minutes selection." },
//         { status: 400 }
//       );
//     }

//     if (error.type === "StripeAPIError") {
//       return NextResponse.json(
//         { error: "Payment service temporarily unavailable. Please try again later." },
//         { status: 503 }
//       );
//     }

//     if (error.type === "StripeConnectionError") {
//       return NextResponse.json(
//         { error: "Network error. Please check your connection and try again." },
//         { status: 503 }
//       );
//     }

//     if (error.type === "StripeAuthenticationError") {
//       return NextResponse.json(
//         { error: "Payment service configuration error. Please contact support." },
//         { status: 500 }
//       );
//     }

//     return NextResponse.json(
//       { error: "Failed to create payment intent. Please try again or contact support if the issue persists." },
//       { status: 500 }
//     );
//   }
// }


// import { NextRequest, NextResponse } from "next/server";
// import Stripe from "stripe";
// import { connectToDatabase } from "@/lib/mongoose";
// import User from "../../../models/User";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2025-08-27.basil",
// });

// // Replace these with your real recurring Stripe Price IDs from the Dashboard.
// // Each Price should have "recurring: { interval: 'month' }" in Stripe.
// const MINUTES_PRICE_IDS = {
//   "20": "price_1SD0vjHuep56bOE2ZKn6drAV",   // e.g. $4.99/month
//   "40": "price_1SD0vjHuep56bOE2ZKn6drAV",   // e.g. $9.99/month
//   "60": "price_1SD0xlHuep56bOE23jdUO4w3",   // e.g. $14.99/month
// };

// export async function POST(req: NextRequest) {
//   try {
//     const { minutes, userId } = await req.json();

//     // ✅ Validate input
//     if (!minutes || !MINUTES_PRICE_IDS[minutes as keyof typeof MINUTES_PRICE_IDS]) {
//       return NextResponse.json(
//         { error: "Invalid minutes package selected" },
//         { status: 400 }
//       );
//     }

//     if (!userId) {
//       return NextResponse.json(
//         { error: "User ID is required" },
//         { status: 400 }
//       );
//     }

//     await connectToDatabase();

//     // ✅ Find user in database
//     const user = await User.findById(userId);
//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     // ✅ Ensure customer exists in Stripe
//     let customerId = user.stripeCustomerId;
//     if (!customerId) {
//       const customer = await stripe.customers.create({
//         email: user.email,
//         name: user.name || undefined,
//         metadata: {
//           userId: user._id.toString(),
//         },
//       });
//       customerId = customer.id;
//       user.stripeCustomerId = customerId;
//       await user.save();
//     }

//     // ✅ Create checkout session for subscription
//     const session = await stripe.checkout.sessions.create({
//       customer: customerId,
//       mode: "subscription",
//       payment_method_types: ["card"],
//       line_items: [
//         {
//           price: MINUTES_PRICE_IDS[minutes as keyof typeof MINUTES_PRICE_IDS],
//           quantity: 1,
//         },
//       ],
//       success_url: `https://vet365.vercel.app/success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `https://vet365.vercel.app/cancel`,
//       metadata: {
//         userId: userId,
//         minutes: minutes.toString(),
//       },
//       subscription_data: {
//         metadata: {
//           userId: userId,
//           minutes: minutes.toString(),
//         },
//       },
//     });

//     return NextResponse.json({ url: session.url });
//   } catch (error: any) {
//     console.error("Subscription creation error:", error);

//     if (error.type === "StripeCardError") {
//       return NextResponse.json({ error: error.message }, { status: 400 });
//     }

//     if (error.type === "StripeInvalidRequestError") {
//       return NextResponse.json(
//         { error: error.message },
//         { status: 400 }
//       );
//     }

//     if (error.type === "StripeAPIError") {
//       return NextResponse.json(
//         { error: "Payment service temporarily unavailable. Please try again later." },
//         { status: 503 }
//       );
//     }

//     if (error.type === "StripeConnectionError") {
//       return NextResponse.json(
//         { error: "Network error. Please check your connection and try again." },
//         { status: 503 }
//       );
//     }

//     if (error.type === "StripeAuthenticationError") {
//       return NextResponse.json(
//         { error: "Payment service configuration error. Please contact support." },
//         { status: 500 }
//       );
//     }

//     return NextResponse.json(
//       { error: "Failed to create subscription. Please try again later." },
//       { status: 500 }
//     );
//   }
// }



import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { connectToDatabase } from "@/lib/mongoose";
import User from "../../../models/User";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

// ⚙️ Replace these with your real recurring Stripe Price IDs from your Dashboard.
// Each Price must be set to "recurring" (e.g. interval: month)
const MINUTES_PRICE_IDS = {
  "20": "price_1SD0vjHuep56bOE2ZKn6drAV", // $4.99/month
  "40": "price_1SD0vjHuep56bOE2ZKn6drAV", // $9.99/month (example placeholder)
  "60": "price_1SD0xlHuep56bOE23jdUO4w3", // $14.99/month
};

export async function POST(req: NextRequest) {
  try {
    const { minutes, userId } = await req.json();

    // 🔒 Validate input
    if (!minutes || !MINUTES_PRICE_IDS[minutes as keyof typeof MINUTES_PRICE_IDS]) {
      return NextResponse.json(
        { error: "Invalid minutes package selected" },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // 🧩 Connect to MongoDB
    await connectToDatabase();

    // 🔍 Find user in database
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 🧾 Ensure Stripe customer exists
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
        metadata: { userId: user._id.toString() },
      });

      customerId = customer.id;
      user.stripeCustomerId = customerId;
      await user.save();
    }

    // 💳 Create a Stripe Checkout Session for Subscription
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: MINUTES_PRICE_IDS[minutes as keyof typeof MINUTES_PRICE_IDS],
          quantity: 1,
        },
      ],
      success_url: `https://vet365.vercel.app/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://vet365.vercel.app/cancel`,
      metadata: {
        userId: userId,
        minutes: minutes.toString(),
      },
      subscription_data: {
        metadata: {
          userId: userId,
          minutes: minutes.toString(),
        },
      },
    });

    // 🔁 Return the Checkout Session URL so frontend can redirect user
    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Subscription creation error:", error);

    // 🎯 Handle Stripe-specific errors
    if (error.type === "StripeCardError") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (error.type === "StripeInvalidRequestError") {
      return NextResponse.json({ error: error.message }, { status: 400 });
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

    // 💥 Default catch-all
    return NextResponse.json(
      { error: "Failed to create subscription. Please try again later." },
      { status: 500 }
    );
  }
}

