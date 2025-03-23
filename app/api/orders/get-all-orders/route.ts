import { NextRequest, NextResponse } from "next/server";
import { db } from "@/helpers/utils/db";

export async function GET(req: NextRequest) {
  try {
    const ordersDb = db.collection("orders");
    let result: any = [];
    let snapshot = await ordersDb.get();
    if (snapshot.empty) {
      return NextResponse.json({
        success: true,
        message: "No Orders Found",
      });
    }
    snapshot.forEach((doc) => result.push({ id: doc.id, data: doc.data() }));
    return NextResponse.json({
      success: true,
      orders: result,
    });
  } catch (err) {
    console.error("Error fetching orders:", err);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
