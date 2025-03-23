import { NextRequest, NextResponse } from "next/server";
import { db } from "@/helpers/utils/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate required fields (modify as needed)
    if (!body.imageUrl || !body.status) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Prepare product data
    const newBanner = {
      status: body.status,
      imageUrl: body.imageUrl,
    };

    console.log(newBanner);
    // Add to Firestore
    const docRef = await db.collection("banners").add(newBanner);

    return NextResponse.json(
      { success: true, message: "Banner added", id: docRef.id },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error adding Banner:", err);
    return NextResponse.json(
      { success: false, message: "Failed to add Banner" },
      { status: 500 }
    );
  }
}
