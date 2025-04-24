import { NextRequest, NextResponse } from "next/server";
import { db } from "@/helpers/utils/db";

export const revalidate = 60;

export async function GET(req: NextRequest) {
  try {
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

    snapshot.forEach((doc) => {
      const product = doc.data();
      const totalStock = product.colors?.reduce(
        (sum: number, color: { stock: number }) => sum + (color.stock || 0),
        0
      );

      // Add product regardless of stock, we will check stock in frontend
      result.push({
        id: doc.id,
        data: {
          ...product,
          totalStock, // Include total stock in the response
        },
      });
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
