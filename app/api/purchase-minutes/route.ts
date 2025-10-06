// import { NextRequest, NextResponse } from "next/server";
// import Stripe from "stripe";
// import { connectToDatabase } from "@/lib/mongoose";
// import Transaction from "../../../models/Transaction";
// import User from "../../../models/User";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2025-08-27.basil",
// });

// const MINUTES_PACKAGES = {
//   "20": { minutes: 20, price: 499 },
//   "40": { minutes: 40, price: 999 },
//   "60": { minutes: 60, price: 1499 },
// };

// export async function POST(req: NextRequest) {
//   try {
//     const { paymentIntentId, userId } = await req.json();

//     if (!paymentIntentId || !userId) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     await connectToDatabase();

//     // Get the payment intent to retrieve minutes and amount info
//     const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

//     console.log("Retrieved PaymentIntent:", {
//       id: paymentIntent.id,
//       status: paymentIntent.status,
//       payment_method: paymentIntent.payment_method,
//       customer: paymentIntent.customer,
//       amount: paymentIntent.amount,
//       metadata: paymentIntent.metadata,
//     });

//     if (paymentIntent.status !== "succeeded") {
//       return NextResponse.json(
//         { error: "Payment not completed" },
//         { status: 400 }
//       );
//     }

//     const minutesStr = paymentIntent.metadata?.minutes;
//     const type = paymentIntent.metadata?.type;
//     const amount = paymentIntent.amount;
//     const customerId = paymentIntent.customer as string;

//     if (type !== "minutes" || !minutesStr || !amount) {
//       return NextResponse.json(
//         { error: "Invalid payment intent for minutes purchase" },
//         { status: 400 }
//       );
//     }

//     // If we have a customer ID from the PaymentIntent, ensure it's saved to the user
//     if (customerId) {
//       const user = await User.findById(userId);
//       if (user && !user.stripeCustomerId) {
//         user.stripeCustomerId = customerId;
//         await user.save();
//       }
//     }

//     const minutesPackage = MINUTES_PACKAGES[minutesStr as keyof typeof MINUTES_PACKAGES];
//     if (!minutesPackage) {
//       return NextResponse.json(
//         { error: "Invalid minutes package" },
//         { status: 400 }
//       );
//     }

//     // Create transaction record
//     const transaction = await Transaction.create({
//       userId,
//       plan: `${minutesPackage.minutes} Minutes`,
//       amount,
//       currency: "usd",
//       stripePaymentIntentId: paymentIntent.id,
//       status: "completed",
//     });

//     if (paymentIntent.status === "succeeded") {
//       // Get the charge details
//       const charges = await stripe.charges.list({
//         payment_intent: paymentIntent.id,
//         limit: 1,
//       });

//       console.log("Charges retrieved:", {
//         count: charges.data.length,
//         paymentIntentId: paymentIntent.id,
//       });

//       if (charges.data.length > 0) {
//         const charge = charges.data[0];

//         // Update transaction with charge details
//         transaction.stripeChargeId = charge.id;
//         if (charge.payment_method_details?.card) {
//           transaction.cardLast4 = charge.payment_method_details.card.last4 || undefined;
//           transaction.cardBrand = charge.payment_method_details.card.brand || undefined;
//         }
//         await transaction.save();

//         // IMPORTANT: Ensure the payment method is saved for future use
//         if (charge.payment_method && customerId) {
//           try {
//             console.log("Processing payment method for charge:", charge.id);
//             console.log("Payment method ID from charge:", charge.payment_method);
//             console.log("Customer ID:", customerId);

//             // Retrieve the payment method to check its status
//             const paymentMethod = await stripe.paymentMethods.retrieve(charge.payment_method as string);
//             console.log("Retrieved payment method:", {
//               id: paymentMethod.id,
//               customer: paymentMethod.customer,
//               type: paymentMethod.type,
//               created: paymentMethod.created,
//             });

//             // Attach payment method to customer if not already attached
//             if (!paymentMethod.customer) {
//               console.log("Attaching unattached payment method to customer:", customerId);
//               await stripe.paymentMethods.attach(charge.payment_method as string, {
//                 customer: customerId,
//               });
//               console.log("Payment method attached successfully");
//             } else if (paymentMethod.customer !== customerId) {
//               console.log("Payment method attached to different customer, reattaching to:", customerId);
//               await stripe.paymentMethods.attach(charge.payment_method as string, {
//                 customer: customerId,
//               });
//               console.log("Payment method reattached successfully");
//             } else {
//               console.log("Payment method already attached to correct customer:", customerId);
//             }
//           } catch (pmError) {
//             console.error("Error handling payment method:", pmError);
//           }
//         } else {
//           console.log("No payment method found in charge or no customerId");
//           console.log("Charge details:", {
//             id: charge.id,
//             payment_method: charge.payment_method,
//             customer: customerId,
//           });
//         }

//         // Add minutes to user's total_time
//         console.log("About to update user with ID:", userId);
//         const user = await User.findById(userId);
//         if (user) {
//           console.log("User found:", user);
//           const currentMinutes = user.total_time || 0;
//           user.total_time = currentMinutes + minutesPackage.minutes;
//           user.subscription_date = new Date();
//           user.subscription_amount = minutesPackage.price / 100; // Convert cents to dollars
//           // Set default renewal setting if not already set
//           if (user.renew === undefined) {
//             user.renew = true;
//           }
//           user.markModified('subscription_date');
//           user.markModified('subscription_amount');
//           user.markModified('renew');
//           await user.save();
//           console.log("User updated:", user);
//         } else {
//           return NextResponse.json(
//             { error: "User not found" },
//             { status: 404 }
//           );
//         }
//       }
//     }

//     return NextResponse.json({
//       success: true,
//       paymentIntentId: paymentIntent.id,
//       status: paymentIntent.status,
//       transactionId: transaction._id,
//       minutesAdded: minutesPackage.minutes,
//     });

//   } catch (error: any) {
//     console.error("Minutes purchase processing error:", error);

//     // Handle specific Stripe errors
//     if (error.type === "StripeCardError") {
//       return NextResponse.json(
//         { error: error.message || "Your card was declined. Please try a different payment method." },
//         { status: 400 }
//       );
//     }

//     if (error.type === "StripeRateLimitError") {
//       return NextResponse.json(
//         { error: "Too many requests. Please try again in a moment." },
//         { status: 429 }
//       );
//     }

//     if (error.type === "StripeInvalidRequestError") {
//       return NextResponse.json(
//         { error: "Invalid payment information. Please check your details and try again." },
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

//     // Handle database errors
//     if (error.name === "ValidationError") {
//       return NextResponse.json(
//         { error: "Invalid data provided. Please check your information." },
//         { status: 400 }
//       );
//     }

//     if (error.name === "MongoNetworkError" || error.name === "MongoTimeoutError") {
//       return NextResponse.json(
//         { error: "Database temporarily unavailable. Please try again." },
//         { status: 503 }
//       );
//     }

//     return NextResponse.json(
//       { error: "Minutes purchase failed. Please try again or contact support if the issue persists." },
//       { status: 500 }
//     );
//   }
// }


// /app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/User";
import Transaction from "@/models/Transaction";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

// Keep your minute-to-price mapping here (in cents)
const MINUTES_PACKAGES: Record<string, { minutes: number; price: number }> = {
  "20": { minutes: 20, price: 499 },
  "40": { minutes: 40, price: 999 },
  "60": { minutes: 60, price: 1499 },
};

// Configure Next to NOT parse the body (we need raw body for signature verification)
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper: read raw body from NextRequest (ReadableStream -> Buffer)
async function buffer(readable: ReadableStream<Uint8Array> | null) {
  if (!readable) return Buffer.from([]);
  const reader = readable.getReader();
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }
  return Buffer.concat(chunks);
}

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature") || null;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
  let event: Stripe.Event | null = null;

  try {
    // Read raw body
    const rawBuf = await buffer(req.body ?? null);

    // Development bypass: if no signature header and NODE_ENV=development,
    // parse the JSON body directly (ONLY for local testing).
    if (!sig && process.env.NODE_ENV === "development") {
      try {
        const text = rawBuf.toString("utf8");
        event = JSON.parse(text) as Stripe.Event;
        console.warn("⚠️ Webhook signature missing — DEVELOPMENT BYPASS engaged. Do NOT use in production.");
      } catch (devParseErr) {
        console.error("Dev bypass failed to parse JSON body:", devParseErr);
        return NextResponse.json({ error: "Invalid webhook body" }, { status: 400 });
      }
    } else {
      // Production / normal flow: verify signature
      if (!sig) {
        return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
      }
      if (!webhookSecret) {
        console.error("STRIPE_WEBHOOK_SECRET not set in environment.");
        return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
      }

      try {
        event = stripe.webhooks.constructEvent(rawBuf, sig, webhookSecret);
      } catch (err: any) {
        console.error("❌ Webhook signature verification failed:", err.message);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
      }
    }

    // At this point we have a verified (or dev-parsed) event
    if (!event) {
      return NextResponse.json({ error: "Unable to parse webhook event" }, { status: 400 });
    }

    // Connect to DB
    await connectToDatabase();

    // Handle invoice.payment_succeeded (first invoice + renewals)
    if (event.type === "invoice.payment_succeeded") {
      const invoice = event.data.object as Stripe.Invoice;
      const subscriptionId = invoice.subscription as string | null;
      const customerId = invoice.customer as string | null;
      const paymentIntentId = invoice.payment_intent as string | Stripe.PaymentIntent | null;

      console.log("Webhook: invoice.payment_succeeded", {
        invoiceId: invoice.id,
        subscriptionId,
        customerId,
        paymentIntentId,
        amount_paid: invoice.amount_paid,
      });

      // If we don't have a subscription or customer, quit gracefully
      if (!subscriptionId || !customerId) {
        console.warn("Webhook: missing subscriptionId or customerId on invoice");
        return NextResponse.json({ received: true });
      }

      // Retrieve subscription (to find the price/plan)
      const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
        expand: ["items.data.price"],
      });

      if (!subscription || !subscription.items || subscription.items.data.length === 0) {
        console.warn("Webhook: subscription missing items", subscriptionId);
        return NextResponse.json({ received: true });
      }

      // Map subscription price to minutes package.
      // Prefer environment price IDs: STRIPE_PRICE_ID_20, STRIPE_PRICE_ID_40, STRIPE_PRICE_ID_60
      const item = subscription.items.data[0];
      const priceId = item.price.id;
      let minutesKey: string | undefined;

      // Try mapping using environment variables first (recommended)
      for (const key of Object.keys(MINUTES_PACKAGES)) {
        const envVar = process.env[`STRIPE_PRICE_ID_${key}`];
        if (envVar && envVar === priceId) {
          minutesKey = key;
          break;
        }
      }

      // If not found, try a fallback: check if price nickname or product contains the minutes key.
      if (!minutesKey) {
        // fallback heuristic: check price.nickname or price.product or price.id includes the minutes number
        const priceObj = item.price as Stripe.Price;
        const fallbackCandidates = [priceObj.nickname, priceObj.product as string | undefined, priceObj.id];
        for (const key of Object.keys(MINUTES_PACKAGES)) {
          if (fallbackCandidates.some((v) => typeof v === "string" && v?.includes(key))) {
            minutesKey = key;
            break;
          }
        }
      }

      if (!minutesKey) {
        console.warn("Webhook: couldn't map priceId to a minutes package", { priceId });
        return NextResponse.json({ received: true });
      }

      const minutesPackage = MINUTES_PACKAGES[minutesKey as keyof typeof MINUTES_PACKAGES];

      // Lookup user by stripeCustomerId
      const user = await User.findOne({ stripeCustomerId: customerId });
      if (!user) {
        console.error("Webhook: no user found for customerId", customerId);
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // Update user's minutes and subscription metadata
      user.total_time = (user.total_time || 0) + minutesPackage.minutes;
      user.subscription_date = new Date();
      user.subscription_amount = minutesPackage.price / 100;
      user.renew = true;
      await user.save();

      // Create transaction record
      await Transaction.create({
        userId: user._id,
        plan: `${minutesPackage.minutes} Minutes (Subscription)`,
        amount: minutesPackage.price,
        currency: "usd",
        stripePaymentIntentId: typeof paymentIntentId === "string" ? paymentIntentId : (paymentIntentId?.id ?? null),
        stripeSubscriptionId: subscriptionId,
        stripeInvoiceId: invoice.id,
        status: "completed",
      });

      console.log(`Webhook: added ${minutesPackage.minutes} minutes to user ${user._id}`);

      return NextResponse.json({ success: true });
    }

    // Handle failed invoice payments (optional)
    if (event.type === "invoice.payment_failed") {
      const invoice = event.data.object as Stripe.Invoice;
      console.warn("Webhook: invoice.payment_failed", { invoiceId: invoice.id, customer: invoice.customer });
      // Optional: notify user, set user.renew = false, etc.
      return NextResponse.json({ received: true });
    }

    // For other events just acknowledge
    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Webhook processing error:", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}

