import { NextRequest, NextResponse } from "next/server";
import { db } from "@/helpers/utils/db";
import { DateTime } from "luxon";

export async function PUT(req: NextRequest) {
  const now = DateTime.now().toLocaleString(DateTime.DATETIME_SHORT);
  try {
    const body = await req.json();
    const { id, status } = body;

    // Ensure the order ID is provided
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Order ID is required" },
        { status: 400 }
      );
    }

    // Reference the order in Firestore
    const orderRef = db.collection("orders").doc(id);
    const orderSnapshot = await orderRef.get();

    // Check if order exists
    if (!orderSnapshot.exists) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    // Update order in Firestore
    await orderRef.update({
      status,
      updatedAt: now,
    });

    return NextResponse.json(
      { success: true, message: "Order updated successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error updating order:", err);
    return NextResponse.json(
      { success: false, message: "Failed to update order" },
      { status: 500 }
    );
  }
}
