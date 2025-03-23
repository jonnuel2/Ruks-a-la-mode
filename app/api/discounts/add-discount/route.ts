import { NextRequest, NextResponse } from "next/server";
import { db } from "@/helpers/utils/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate required fields (modify as needed)
    if (!body.code || !body.rate || !body.count) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Prepare discount data
    const newDiscount = {
      count: body.count,
      rate: body.rate,
      duration: body.duration,
      createdAt: new Date().toISOString(),
    };

    // Add to Firestore
    const docRef = await db
      .collection("discount-codes")
      .doc(body?.code)
      .create(newDiscount);

    return NextResponse.json(
      { success: true, message: "Discount added", writetime: docRef.writeTime },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error adding Discount:", err);
    return NextResponse.json(
      { success: false, message: "Failed to add Discount" },
      { status: 500 }
    );
  }
}
