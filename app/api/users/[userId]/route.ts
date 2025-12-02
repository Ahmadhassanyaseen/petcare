import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/Users";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await User.findById(userId).select(
      "email name total_time profileImage stripeCustomerId renew subscription_date subscription_amount createdAt"
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      total_time: user.total_time || 0,
      profileImage: user.profileImage,
      stripeCustomerId: user.stripeCustomerId,
      renew: user.renew,
      subscription_date: user.subscription_date,
      subscription_amount: user.subscription_amount,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}
