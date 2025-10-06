// // /app/api/create-subscription/route.ts
// import Stripe from "stripe";
// import { NextResponse } from "next/server";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// const MINUTES_PRICE_IDS = {
//     "20": "price_1SD0vjHuep56bOE2ZKn6drAV", // $4.99/month
//     "40": "price_1SD0vjHuep56bOE2ZKn6drAV", // $9.99/month (example placeholder)
//     "60": "price_1SD0xlHuep56bOE23jdUO4w3", // $14.99/month
//   };

// export async function POST(req: Request) {
//   try {
//     const { customerId, paymentMethodId, price } = await req.json();

//     // Attach payment method
//     await stripe.paymentMethods.attach(paymentMethodId, { customer: customerId });

//     // Set default payment method
//     await stripe.customers.update(customerId, {
//       invoice_settings: { default_payment_method: paymentMethodId },
//     });

//     // Create subscription
//     const subscription = await stripe.subscriptions.create({
//       customer: customerId,
//       items: [{ price: MINUTES_PRICE_IDS[price as keyof typeof MINUTES_PRICE_IDS] }],
//       expand: ["latest_invoice.payment_intent"],
//     });

//     return NextResponse.json({ subscription });
//   } catch (err: any) {
//     console.error("Subscription creation error:", err);
//     return NextResponse.json({ error: err.message }, { status: 400 });
//   }
// }


// /app/api/create-subscription/route.ts
import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const MINUTES_PRICE_IDS = {
  "20": "price_1SD0vjHuep56bOE2ZKn6drAV", // $4.99/month
  "40": "price_1SD0vjHuep56bOE2ZKn6drAV", // $9.99/month (placeholder)
  "60": "price_1SD0xlHuep56bOE23jdUO4w3", // $14.99/month
};

export async function POST(req: Request) {
  try {
    const { customerId, paymentMethodId, price } = await req.json();

    if (!customerId || !paymentMethodId || !price) {
      return NextResponse.json(
        { error: "Missing required parameters (customerId, paymentMethodId, price)" },
        { status: 400 }
      );
    }

    const priceId = MINUTES_PRICE_IDS[price as keyof typeof MINUTES_PRICE_IDS];
    if (!priceId) {
      return NextResponse.json({ error: "Invalid price selection" }, { status: 400 });
    }

    // ✅ Attach payment method if not already attached
    await stripe.paymentMethods.attach(paymentMethodId, { customer: customerId });

    // ✅ Set default payment method for the customer
    await stripe.customers.update(customerId, {
      invoice_settings: { default_payment_method: paymentMethodId },
    });

    // ✅ Check if the customer already has an active subscription
    const existingSubscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      expand: ["data.items"],
      limit: 1,
    });

    let subscription;

    if (existingSubscriptions.data.length > 0) {
      // 🟢 Update the existing subscription
      const existingSubscription = existingSubscriptions.data[0];
      const currentItemId = existingSubscription.items.data[0].id;

      console.log(`Updating existing subscription: ${existingSubscription.id}`);

      subscription = await stripe.subscriptions.update(existingSubscription.id, {
        cancel_at_period_end: false, // keep subscription active
        proration_behavior: "create_prorations", // handle price differences
        items: [
          {
            id: currentItemId,
            price: priceId,
          },
        ],
        expand: ["latest_invoice.payment_intent"],
      });
    } else {
      // 🆕 Create a new subscription
      console.log("Creating a new subscription for customer:", customerId);

      subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        payment_behavior: "default_incomplete",
        expand: ["latest_invoice.payment_intent"],
      });
    }
    console.log("Subscription created:", subscription);

    return NextResponse.json({
      subscriptionId: subscription.id,
      status: subscription.status,
    //   clientSecret: subscription.latest_invoice?.payment_intent?.client_secret || null,
    });
  } catch (err: any) {
    console.error("Subscription creation error:", err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
