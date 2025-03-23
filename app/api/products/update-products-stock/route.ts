import { NextRequest, NextResponse } from "next/server";
import { db } from "@/helpers/utils/db";
import { firestore } from "firebase-admin"; // Assuming you use firebase-admin

export async function POST(req: NextRequest) {
  try {
    const { items } = await req.json(); // items should include product IDs and quantities
    if (!items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: "Invalid items data" },
        { status: 400 }
      );
    }

    const batch = db.batch();

    // Loop through purchased products
    items.forEach(({ id, quantity }) => {
      const productRef = db.collection("products").doc(id);
      batch.update(productRef, {
        quantity: firestore.FieldValue.increment(-quantity), // Reduce stock
      });
    });

    await batch.commit(); // Commit all updates atomically

    return NextResponse.json({
      success: true,
      message: "Stock updated successfully",
    });
  } catch (error) {
    console.error("Error updating stock:", error);
    return NextResponse.json(
      { error: "Failed to update stock" },
      { status: 500 }
    );
  }
}
