import { NextRequest, NextResponse } from "next/server";
import { db } from "@/helpers/utils/db";

export async function GET(req: NextRequest) {
  try {
    const bannersDb = db.collection("banners");
    let result: any = [];
    let snapshot = await bannersDb.get();
    if (snapshot.empty) {
      return NextResponse.json({
        success: true,
        message: "No banners found",
      });
    }
    snapshot.forEach((doc) => result.push({ id: doc.id, data: doc.data() }));
    return NextResponse.json({
      success: true,
      banners: result,
    });
  } catch (err) {
    console.error("Error fetching banners:", err);
    return NextResponse.json(
      { error: "Failed to fetch banners" },
      { status: 500 }
    );
  }
}
