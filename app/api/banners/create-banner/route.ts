import { NextRequest, NextResponse } from "next/server";
import { db } from "@/helpers/utils/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate required fields (modify as needed)
    if (!body.status || (!body.imageUrl && !body.videoUrl)) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

        // Ensure at least one of imageUrl or videoUrl is provided
        if (body.imageUrl && body.videoUrl) {
          return NextResponse.json(
            { success: false, message: "Provide only one of imageUrl or videoUrl" },
            { status: 400 }
          );
        }

    // Prepare product data
    const newBanner = {
      status: body.status,
      imageUrl: body.imageUrl || null, // Ensure imageUrl is null if not provided
      videoUrl: body.videoUrl || null,
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
