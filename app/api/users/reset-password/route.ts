import { NextRequest, NextResponse } from "next/server";
import { db, firebase } from "@/helpers/utils/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, newPassword, confirmPassword } = body;

    // Validate input
    if (!token || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { success: false, message: "Token, newPassword, and confirmPassword are required" },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: "Passwords do not match" },
        { status: 400 }
      );
    }

    // Query the database for the user with the given reset token
    const userQuery = await db
      .collection("users")
      .where("resetToken", "==", token)
      .limit(1)
      .get();

    if (userQuery.empty) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 404 }
      );
    }

    const userDoc = userQuery.docs[0];
    const userData = userDoc.data();

    // Check if the token has expired
    const tokenExpiry = userData.resetTokenExpiry;
    if (Date.now() > tokenExpiry) {
      return NextResponse.json(
        { success: false, message: "Token has expired" },
        { status: 410 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and clear the reset token and expiry
    await userDoc.ref.update({
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
      passwordUpdatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    });

    return NextResponse.json(
      { success: true, message: "Password reset successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json(
      { success: false, message: "Failed to reset password" },
      { status: 500 }
    );
  }
}
