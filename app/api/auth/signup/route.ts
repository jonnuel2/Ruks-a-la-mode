import { NextRequest, NextResponse } from "next/server";
import { db, firebase } from "@/helpers/utils/db"; // Adjust this import to match your project structure
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, password, confirmPassword } = body;

    // Validate input
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: "Passwords do not match" },
        { status: 400 }
      );
    }

    // Check if the user already exists
    const usersRef = db.collection("users");
    const existingUserSnapshot = await usersRef.where("email", "==", email).get();
    if (!existingUserSnapshot.empty) {
      return NextResponse.json(
        { success: false, message: "User already exists" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user in Firestore
    const newUser = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    };
    await usersRef.add(newUser);

    return NextResponse.json(
      { success: true, message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during user signup:", error);
    return NextResponse.json(
      { success: false, message: "Failed to register user" },
      { status: 500 }
    );
  }
}
