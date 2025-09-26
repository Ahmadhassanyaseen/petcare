import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1).optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
    }
    const { email, password, name } = parsed.data;

    await connectToDatabase();

    console.log("Registration attempt for email:", email);
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      console.log("User already exists:", existing.email);
      return NextResponse.json({ error: "Email is already in use" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);
    console.log("Password hashed successfully");

    const user = await User.create({ email: email.toLowerCase(), password: hashed, name });
    console.log("User created with ID:", user._id);

    return NextResponse.json({ id: user._id.toString(), email: user.email, name: user.name }, { status: 201 });
  } catch (err) {
    console.error("/api/auth/register error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
