import { NextRequest, NextResponse } from "next/server";
import { db } from "@/helpers/utils/db";
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

    // Query all users and find one with a matching reset token
    const userQuery = await db.collection("users").get();
    let matchingUser = null;

    for (const doc of userQuery.docs) {
      const userData = doc.data();
      if (userData.resetToken && await bcrypt.compare(token, userData.resetToken)) {
        matchingUser = doc;
        break;
      }
    }

    if (!matchingUser) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 404 }
      );
    }

    const userDoc = matchingUser;
    const userData = userDoc.data();

    // Check if the token has expired
    if (Date.now() > userData.resetTokenExpiry) {
      return NextResponse.json(
        { success: false, message: "Token has expired" },
        { status: 410 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user data
    await userDoc.ref.update({
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
      passwordUpdatedAt: new Date().toISOString(),
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
