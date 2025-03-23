import { NextRequest, NextResponse } from "next/server";
import { db } from "@/helpers/utils/db";

export async function GET(req: NextRequest) {
  try {
    const adminsDb = db.collection("admins");
    let result: any = [];
    let snapshot = await adminsDb.get();
    if (snapshot.empty) {
      return NextResponse.json({
        success: true,
        message: "No admins Found",
      });
    }
    snapshot.forEach((doc) => result.push({ id: doc.id, data: doc.data() }));
    return NextResponse.json({
      success: true,
      admins: result,
    });
  } catch (err) {
    console.error("Error fetching admins:", err);
    return NextResponse.json(
      { error: "Failed to fetch admins" },
      { status: 500 }
    );
  }
}
