import { NextRequest, NextResponse } from "next/server";
import { db } from "@/helpers/utils/db";

export async function GET(req: NextRequest) {
  try {
    const discountsDb = db.collection("discount-codes");
    let result: any = [];
    let snapshot = await discountsDb.get();
    if (snapshot.empty) {
      return NextResponse.json({
        success: true,
        message: "No discounts Found",
      });
    }
    snapshot.forEach((doc) => result.push({ id: doc.id, data: doc.data() }));
    return NextResponse.json({
      success: true,
      discounts: result,
    });
  } catch (err) {
    console.error("Error fetching discounts:", err);
    return NextResponse.json(
      { error: "Failed to fetch discounts" },
      { status: 500 }
    );
  }
}
