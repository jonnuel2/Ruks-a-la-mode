import { NextRequest, NextResponse } from "next/server";
import { db } from "@/helpers/utils/db";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get("id");

    const productRef = db.collection("products").doc(id ?? "");

    const doc = await productRef.get();

    if (!doc.exists) {
      return NextResponse.json({
        success: true,
        message: "product not found",
      });
    }
    const result = { id: doc.id, data: doc.data() };
    return NextResponse.json({
      success: true,
      product: result,
    });
  } catch (err) {
    console.error("Error fetching product:", err);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
