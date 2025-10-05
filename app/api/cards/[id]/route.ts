import { NextRequest, NextResponse } from "next/server";
import { getAuthFromCookies } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import Card from "@/models/Card";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getAuthFromCookies();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { isDefault } = body;

    await connectToDatabase();

    const cardId = params.id;

    // Find the card first to ensure it belongs to the user
    const card = await Card.findOne({
      _id: cardId,
      userId: session.sub,
    });

    if (!card) {
      return NextResponse.json(
        { error: "Card not found" },
        { status: 404 }
      );
    }

    // If setting as default, unset other default cards
    if (isDefault) {
      await Card.updateMany(
        { userId: session.sub },
        { isDefault: false }
      );
    }

    // Update the specific card
    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      { isDefault },
      { new: true }
    );

    return NextResponse.json({
      card: {
        _id: updatedCard!._id,
        cardNumber: updatedCard!.cardNumber,
        cardBrand: updatedCard!.cardBrand,
        cardholderName: updatedCard!.cardholderName,
        expiryMonth: updatedCard!.expiryMonth,
        expiryYear: updatedCard!.expiryYear,
        isDefault: updatedCard!.isDefault,
        createdAt: updatedCard!.createdAt,
      }
    });
  } catch (error) {
    console.error("Error updating card:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getAuthFromCookies();

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const cardId = params.id;

    // Find and delete the card, ensuring it belongs to the authenticated user
    const deletedCard = await Card.findOneAndDelete({
      _id: cardId,
      userId: session.sub,
    });

    if (!deletedCard) {
      return NextResponse.json(
        { error: "Card not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Card deleted successfully" });
  } catch (error) {
    console.error("Error deleting card:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
