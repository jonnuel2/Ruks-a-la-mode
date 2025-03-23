import { NextRequest, NextResponse } from "next/server";
import { db } from "@/helpers/utils/db";
import { DateTime } from "luxon";

export async function POST(req: NextRequest) {
  const now = DateTime.now().toLocaleString(DateTime.DATETIME_SHORT);
  try {
    const body = await req.json();
    const { text } = body;

    // Ensure the pretext ID is provided
    if (!text) {
      return NextResponse.json(
        { success: false, message: "text is required" },
        { status: 400 }
      );
    }

    // Reference the pretext in Firestore
    const pretextRef = db.collection("web-texts").doc("preheader");
    const pretextSnapshot = await pretextRef.get();

    // Check if pretext exists
    if (!pretextSnapshot.exists) {
      return NextResponse.json(
        { success: false, message: "pretext not found" },
        { status: 404 }
      );
    }

    // Update pretext in Firestore
    await pretextRef.update({
      text,
      updatedAt: now,
    });

    return NextResponse.json(
      { success: true, message: "pretext updated successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error updating pretext:", err);
    return NextResponse.json(
      { success: false, message: "Failed to update pretext" },
      { status: 500 }
    );
  }
}
