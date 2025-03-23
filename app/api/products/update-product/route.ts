import { NextRequest, NextResponse } from "next/server";
import { db } from "@/helpers/utils/db";

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updatedData } = body;

    // Ensure the product ID is provided
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    // Reference the product in Firestore
    const productRef = db.collection("products").doc(id);
    const productSnapshot = await productRef.get();

    // Check if product exists
    if (!productSnapshot.exists) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // Update product in Firestore
    await productRef.update({
      ...updatedData,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json(
      { success: true, message: "Product updated successfully" },
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
