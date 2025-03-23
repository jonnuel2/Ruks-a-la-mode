import { NextRequest, NextResponse } from "next/server";
import { db } from "@/helpers/utils/db";

export async function GET(req: NextRequest) {
  try {
    const productsDb = db.collection("products");
    let result: any = [];
    let snapshot = await productsDb.get();
    if (snapshot.empty) {
      return NextResponse.json({
        success: true,
        message: "No Products Found",
      });
    }
    snapshot.forEach((doc) => result.push({ id: doc.id, data: doc.data() }));
    return NextResponse.json({
      success: true,
      products: result,
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
