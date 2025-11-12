import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import User from "../../../../models/User";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId parameter" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find user by ID and return total_time
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Return user data with total_time
    return NextResponse.json({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      total_time: user.total_time || 0,
      subscription_date: user.subscription_date,
      subscription_amount: user.subscription_amount,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      profileImage: user.profileImage
    });

  } catch (error: any) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}
