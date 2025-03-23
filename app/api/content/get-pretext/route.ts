import { NextRequest, NextResponse } from "next/server";
import { db } from "@/helpers/utils/db";

export async function GET(req: NextRequest) {
  try {
    const preTextRef = db.collection("web-texts").doc("preheader");

    const doc = await preTextRef.get();

    if (!doc.exists) {
      return NextResponse.json({
        success: true,
        message: "preText not Found",
      });
    }
    return NextResponse.json({
      success: true,
      preText: doc.data()?.text,
    });
  } catch (err) {
    console.error("Error fetching preText:", err);
    return NextResponse.json(
      { error: "Failed to fetch preText" },
      { status: 500 }
    );
  }
}
