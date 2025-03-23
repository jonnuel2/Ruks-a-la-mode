import { NextRequest, NextResponse } from "next/server";
import { firebase, db } from "@/helpers/utils/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate required fields
    if (!body.items || !body.shippingInfo) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check for duplicate transactions
    const verifyRef = db.collection("orders").where("txref", "==", body?.txref);
    const snap = await verifyRef.get();

    if (!snap.empty) {
      return NextResponse.json(
        { success: true, message: "Duplicate transaction" },
        { status: 201 }
      );
    }

    // Create a new order reference
    const orderRef = db.collection("orders").doc();
    const batch = db.batch();

    // Prepare order data
    const newOrder = {
      txref: body?.txref,
      items: body?.items,
      price: body?.price,
      discount: body?.discount,
      shippingInfo: body?.shippingInfo,
      createdAt: body?.createdAt,
      status: "pending",
    };

    // Add new order to the batch
    batch.set(orderRef, newOrder);

    // Reduce stock for each purchased product and update 'sold'
    for (const commodity of body?.items) {
      const { id, color } = commodity?.item;
      const productRef = db.collection("products").doc(id);

      const productSnap = await productRef.get();
      if (!productSnap.exists) {
        return NextResponse.json(
          { success: false, message: `Product with ID ${id} not found` },
          { status: 404 }
        );
      }

      const product = productSnap.data();

      // Find and update the specific color's stock
      const updatedColors = product?.colors.map((c: any) => {
        if (c.name === color.name) {
          return {
            ...c,
            stock: Math.max(c.stock - commodity.quantity, 0), // Ensure stock doesn't go below 0
          };
        }
        return c;
      });

      // Add product update to the batch
      batch.update(productRef, {
        colors: updatedColors,
        sold: firebase.firestore.FieldValue.increment(commodity.quantity),
      });
    }

    // Commit the batch (order + stock updates)
    await batch.commit();

    return NextResponse.json(
      { success: true, message: "Order created" },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error creating order:", err);
    return NextResponse.json(
      { success: false, message: "Failed to create order" },
      { status: 500 }
    );
  }
}
