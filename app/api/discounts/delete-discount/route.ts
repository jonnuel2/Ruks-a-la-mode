import { NextRequest, NextResponse } from "next/server";
import { db } from "@/helpers/utils/db";

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const discountCode = searchParams.get("code");

    if (!discountCode) {
      return NextResponse.json(
        { error: "Discount code is required" },
        { status: 400 }
      );
    }

    // Reference the discount document using db.collection().doc()
    const discountRef = db.collection("discount-codes").doc(discountCode);

    await discountRef.delete();

    return NextResponse.json({
      success: true,
      message: "discount deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting discount:", error);
    return NextResponse.json(
      { error: "Failed to delete discount" },
      { status: 500 }
    );
  }
}
