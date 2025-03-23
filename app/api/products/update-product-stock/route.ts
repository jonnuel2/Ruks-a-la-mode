import { NextRequest, NextResponse } from "next/server";
import { db } from "@/helpers/utils/db";
import { DateTime } from "luxon";

export async function PUT(req: NextRequest) {
  const now = DateTime.now().toLocaleString(DateTime.DATETIME_SHORT);
  try {
    const body = await req.json();
    const { id, quantity } = body;

    // Ensure the banner ID is provided
    if (!id) {
      return NextResponse.json(
        { success: false, message: "product ID is required" },
        { status: 400 }
      );
    }

    // Reference the product in Firestore
    const productRef = db.collection("products").doc(id);
    const productSnapshot = await productRef.get();

    // Check if product exists
    if (!productSnapshot.exists) {
      return NextResponse.json(
        { success: false, message: "product not found" },
        { status: 404 }
      );
    }

    // Update product in Firestore
    await productRef.update({
      quantity: productSnapshot?.data()?.quantity - quantity,
      updatedAt: now,
    });

    return NextResponse.json(
      { success: true, message: "product updated successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error updating product:", err);
    return NextResponse.json(
      { success: false, message: "Failed to update product" },
      { status: 500 }
    );
  }
}
