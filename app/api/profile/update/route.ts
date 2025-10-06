import { NextResponse } from "next/server";
import { getAuthFromCookies } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/User";
import { z } from "zod";

const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name must be less than 50 characters").optional(),
  profileImage: z.string().url("Must be a valid URL").optional(),
  total_time: z.number().min(0, "Total time must be non-negative").optional(),
  id: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    // const session = await getAuthFromCookies();
    // if (!session) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const body = await req.json();
    const parsed = updateProfileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, profileImage , id, total_time } = parsed.data;

    await connectToDatabase();

    // Build update object with only provided fields
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (profileImage !== undefined) updateData.profileImage = profileImage;
    if (total_time !== undefined) updateData.total_time = total_time;

    const user = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select("email name total_time profileImage createdAt");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        profileImage: user.profileImage,
        total_time: user.total_time,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error("/api/profile/update error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
