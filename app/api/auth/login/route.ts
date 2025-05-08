import { NextRequest, NextResponse } from "next/server";
import { db, firebase } from "@/helpers/utils/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // Ensure both email and password are provided
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Query Firestore for the user by email
    const userQuery = await db
      .collection("users")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (userQuery.empty) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const userDoc = userQuery.docs[0];
    const userData = userDoc.data();

    // Verify the password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, userData.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Update last login timestamp
    await userDoc.ref.update({
      lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "User logged in successfully",
        user: {
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error during login process:", err);
    return NextResponse.json(
      { success: false, message: "Failed to authenticate user" },
      { status: 500 }
    );
  }
}
