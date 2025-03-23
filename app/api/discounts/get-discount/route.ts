import { NextRequest, NextResponse } from "next/server";
import { db } from "@/helpers/utils/db";
import { DateTime } from "luxon";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const code = searchParams.get("code");

    const discountRef = db.collection("discount-codes").doc(code ?? "");

    const doc = await discountRef.get();

    const now = DateTime.now();

    if (!doc.exists) {
      return NextResponse.json({
        success: true,
        message: "discount not found",
      });
    }
    if (doc?.data()?.count < 0) {
      return NextResponse.json({
        success: true,
        message: "discount not applicable",
      });
    }
    if (
      now >
      DateTime.fromISO(doc?.data()?.createdAt).plus({
        hours: doc?.data()?.duration,
      })
    ) {
      return NextResponse.json({
        success: true,
        message: "discount has expired",
      });
    }

    const rate = doc.data()?.rate;

    return NextResponse.json({
      success: true,
      discount: rate,
    });
  } catch (err) {
    console.error("Error fetching discount:", err);
    return NextResponse.json(
      { error: "Failed to fetch discount" },
      { status: 500 }
    );
  }
}
