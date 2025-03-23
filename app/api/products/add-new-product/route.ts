import { NextRequest, NextResponse } from "next/server";
import { db } from "@/helpers/utils/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate required fields (modify as needed)
    if (!body.name || !body.price || !body.category) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Prepare product data
    const newProduct = {
      name: body.name,
      description: body.description || "",
      price: body.price,
      images: body.images || [],
      category: body.category,
      colors: body.colors || [],
      quantity: body.quantity || 0,
      components: body.components || [],
      createdAt: new Date().toISOString(),
    };

    // Add to Firestore
    const docRef = await db.collection("products").add(newProduct);

    return NextResponse.json(
      { success: true, message: "Product added", id: docRef.id },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error adding product:", err);
    return NextResponse.json(
      { success: false, message: "Failed to add product" },
      { status: 500 }
    );
  }
}
