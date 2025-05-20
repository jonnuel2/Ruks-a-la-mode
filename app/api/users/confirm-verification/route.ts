import { NextRequest, NextResponse } from "next/server";
import { db, firebase } from "@/helpers/utils/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token is required" },
        { status: 400 }
      );
    }

    // Query the database for the user with the given token
    const userQuery = await db
      .collection("users")
      .where("verificationToken", "==", token)
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

    // Check if the token has expired (e.g., after 24 hours)
    const tokenCreatedAt = userData.tokenCreatedAt?.toDate();
    const tokenExpiryTime = 24 * 60 * 60 * 1000; // 24 hours
    if (Date.now() - tokenCreatedAt > tokenExpiryTime) {
      return NextResponse.json(
        { success: false, message: "Token has expired" },
        { status: 410 }
      );
    }

    // Mark the user as verified
    await userDoc.ref.update({
      isVerified: true,
      verificationToken: null, // Clear the token
      tokenCreatedAt: null,
      verifiedAt: firebase.firestore.FieldValue.serverTimestamp(),
    });

    return NextResponse.json(
      { success: true, message: "Email verified successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error verifying email:", err);
    return NextResponse.json(
      { success: false, message: "Failed to verify email" },
      { status: 500 }
    );
  }
}
