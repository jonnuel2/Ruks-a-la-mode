// app/api/delete-banner/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/helpers/utils/db";

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Banner ID is required" },
        { status: 400 }
      );
    }

    const bannerRef = db.collection("banners").doc(id);
    const bannerSnap = await bannerRef.get();

    if (!bannerSnap.exists) {
      return NextResponse.json(
        { success: false, message: "Banner not found" },
        { status: 404 }
      );
    }

    await bannerRef.delete();

    return NextResponse.json(
      { success: true, message: "Banner deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete banner" },
      { status: 500 }
    );
  }
}
