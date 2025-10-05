import { NextRequest, NextResponse } from "next/server";
import { getAuthFromCookies } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import Card from "@/models/Card";

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthFromCookies();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const cards = await Card.find({ userId: session.sub })
      .sort({ isDefault: -1, createdAt: -1 })
      .select("cardNumber cardBrand cardholderName expiryMonth expiryYear isDefault createdAt");

    return NextResponse.json({ cards });
  } catch (error) {
    console.error("Error fetching cards:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthFromCookies();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      stripeCardId,
      cardNumber,
      cardBrand,
      cardholderName,
      expiryMonth,
      expiryYear,
      isDefault = false
    } = body;

    // Validate required fields
    if (!cardNumber || !cardBrand || !expiryMonth || !expiryYear) {
      return NextResponse.json(
        { error: "Missing required card information" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // If this is set as default, unset other default cards
    if (isDefault) {
      await Card.updateMany(
        { userId: session.sub },
        { isDefault: false }
      );
    }

    const newCard = new Card({
      userId: session.sub,
      stripeCardId,
      cardNumber,
      cardBrand,
      cardholderName,
      expiryMonth,
      expiryYear,
      isDefault,
    });

    const savedCard = await newCard.save();

    // Return the saved card without sensitive information
    const cardResponse = {
      _id: savedCard._id,
      cardNumber: savedCard.cardNumber,
      cardBrand: savedCard.cardBrand,
      cardholderName: savedCard.cardholderName,
      expiryMonth: savedCard.expiryMonth,
      expiryYear: savedCard.expiryYear,
      isDefault: savedCard.isDefault,
      createdAt: savedCard.createdAt,
    };

    return NextResponse.json({ card: cardResponse }, { status: 201 });
  } catch (error) {
    console.error("Error creating card:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
