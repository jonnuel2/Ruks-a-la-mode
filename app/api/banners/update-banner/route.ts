import { NextRequest, NextResponse } from "next/server";
import { db } from "@/helpers/utils/db";
import { DateTime } from "luxon";

export async function PUT(req: NextRequest) {
  const now = DateTime.now().toLocaleString(DateTime.DATETIME_SHORT);
  try {
    const body = await req.json();
    const { id, imageUrl, status } = body;

    // Ensure the banner ID is provided
    if (!id) {
      return NextResponse.json(
        { success: false, message: "banner ID is required" },
        { status: 400 }
      );
    }

    // Reference the banner in Firestore
    const bannerRef = db.collection("banners").doc(id);
    const bannerSnapshot = await bannerRef.get();

    // Check if banner exists
    if (!bannerSnapshot.exists) {
      return NextResponse.json(
        { success: false, message: "banner not found" },
        { status: 404 }
      );
    }

    // Update banner in Firestore
    await bannerRef.update({
      imageUrl,
      status,
      updatedAt: now,
    });

    return NextResponse.json(
      { success: true, message: "banner updated successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error updating banner:", err);
    return NextResponse.json(
      { success: false, message: "Failed to update banner" },
      { status: 500 }
    );
  }
}
