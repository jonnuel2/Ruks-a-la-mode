import { NextRequest, NextResponse } from "next/server";
import { db } from "@/helpers/utils/db";

export const revalidate = 60;

export async function GET(req: NextRequest) {
  try {
    // Fetch all products (filtering by quantity in Firestore is no longer possible)
    const productsDb = db.collection("products");
    let result: any = [];
    let snapshot = await productsDb.get();

    if (snapshot.empty) {
      return NextResponse.json(
        {
          success: true,
          message: "No Products Found",
        },
        { headers: { "Cache-Control": "no-store, max-age=0" } }
      );
    }

    // Filter active products (where total color stock > 0)
    snapshot.forEach((doc) => {
      const product = doc.data();

      // Calculate total stock from colors
      const totalStock = product.colors?.reduce(
        (sum: number, color: { stock: number }) => sum + (color.stock || 0),
        0
      );

      if (totalStock > 0) {
        result.push({ id: doc.id, data: { ...product } });
      }
    });

    return NextResponse.json(
      {
        success: true,
        products: result,
      },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (err) {
    console.error("Error fetching products:", err);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
