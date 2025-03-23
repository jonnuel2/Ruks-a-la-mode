import { NextRequest, NextResponse } from "next/server";
import { db } from "@/helpers/utils/db";
import { DateTime } from "luxon";

export async function POST(req: NextRequest) {
  const now = DateTime.now().toLocaleString(DateTime.DATETIME_SHORT);
  try {
    const body = await req.json();
    const { admin } = body;

    // Ensure the admin email is provided
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "admin mail is required" },
        { status: 400 }
      );
    }

    // Reference the admin in Firestore
    const adminRef = db.collection("admins").doc(admin);
    const adminSnapshot = await adminRef.get();

    // Check if admin exists
    if (!adminSnapshot.exists) {
      return NextResponse.json(
        { success: false, message: "admin not found" },
        { status: 404 }
      );
    }

    // Update pretext in Firestore
    await adminRef.update({
      lastLogin: now,
    });

    return NextResponse.json(
      { success: true, message: "last seen updated successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error updating pretext:", err);
    return NextResponse.json(
      { success: false, message: "Failed to update last seen" },
      { status: 500 }
    );
  }
}
