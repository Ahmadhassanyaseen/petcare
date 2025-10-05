import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import User from "../../../models/User";

export async function POST(req: NextRequest) {
  try {
    const { userId, renew } = await req.json();
    console.log("Updating renewal setting for user:", userId);
    console.log("Renewal setting:", renew);

    if (!userId || typeof renew !== "boolean") {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await User.findById(userId);
    console.log("User found:", user);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Update the renewal setting
    user.renew = renew;
    await user.save();
    console.log("User updated:", user);

    return NextResponse.json({
      success: true,
      renew: user.renew,
    });

  } catch (error: any) {
    console.error("Renewal setting update error:", error);

    // Handle database errors
    if (error.name === "ValidationError") {
      return NextResponse.json(
        { error: "Invalid data provided" },
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
      { error: "Failed to update renewal setting. Please try again." },
      { status: 500 }
    );
  }
}
