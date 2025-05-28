import { NextRequest, NextResponse } from "next/server";
import { db } from "@/helpers/utils/db";

interface DiscountUpdateBody {
    code: string;
    rate?: number;
    count?: number;
    duration?: number;
  }

export async function POST(req: NextRequest) {
  try {
    const body:DiscountUpdateBody = await req.json();

    // Validate required fields
    if (!body.code || (!body.rate && !body.count && !body.duration)) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Fetch the discount document to ensure it exists
    const discountDocRef = db.collection("discount-codes").doc(body.code);
    const discountDoc = await discountDocRef.get();

    if (!discountDoc.exists) {
      return NextResponse.json(
        { success: false, message: "Discount code not found" },
        { status: 404 }
      );
    }

    // Prepare the updated fields
    const updatedFields: Partial<DiscountUpdateBody> & { updatedAt?: string } = {};
    if (body.rate !== undefined) updatedFields.rate = body.rate;
    if (body.count !== undefined) updatedFields.count = body.count;
    if (body.duration !== undefined) updatedFields.duration = body.duration;
    updatedFields.updatedAt = new Date().toISOString();

    // Update the discount code in Firestore
    await discountDocRef.update(updatedFields);

    return NextResponse.json(
      { success: true, message: "Discount updated successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error updating discount:", err);
    return NextResponse.json(
      { success: false, message: "Failed to update discount" },
      { status: 500 }
    );
  }
}
