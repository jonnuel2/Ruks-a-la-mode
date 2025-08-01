import { NextRequest, NextResponse } from "next/server";
import { db, firebase } from "@/helpers/utils/db";
import { DateTime } from "luxon";

export async function PUT(req: NextRequest) {
  const now = DateTime.now().toLocaleString(DateTime.DATETIME_SHORT);
  try {
    const body = await req.json();
    const { id, tailorId, name, description } = body;

    // Validate required fields
    if (!id || !tailorId) {
      return NextResponse.json(
        { success: false, message: "Order ID and Tailor ID are required" },
        { status: 400 }
      );
    }

    // Reference the order in Firestore
    const orderRef = db.collection("orders").doc(id);
    const orderSnapshot = await orderRef.get();

    // Check if the order exists
    if (!orderSnapshot.exists) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    // Retrieve existing tailors
    const orderData = orderSnapshot.data();
    const tailors = orderData?.tailors || [];

    // Find the tailor to edit
    const tailorIndex = tailors.findIndex((t: { id: string }) => t.id === tailorId);
    if (tailorIndex === -1) {
      return NextResponse.json(
        { success: false, message: "Tailor not found in the order" },
        { status: 404 }
      );
    }

    // Update the tailor's details
    tailors[tailorIndex] = { ...tailors[tailorIndex], name, description };

    // Update Firestore document
    await orderRef.update({
      tailors,
      updatedAt: now,
    });

    return NextResponse.json(
      { success: true, message: "Tailor updated successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error updating tailor:", err);
    return NextResponse.json(
      { success: false, message: "Failed to update tailor" },
      { status: 500 }
    );
  }
}
