import { NextRequest, NextResponse } from "next/server";
import { db } from "@/helpers/utils/db";

export async function GET(req: NextRequest) {
  try {
    // Fetch all users from the "users" collection
    const usersSnapshot = await db.collection("users").orderBy("createdAt", "desc").get();

    if (usersSnapshot.empty) {
      return NextResponse.json(
        { success: false, message: "No users found" },
        { status: 404 }
      );
    }

    // Map through the documents to retrieve user data
    const users = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(
      { success: true, message: "Users retrieved successfully", users },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching users:", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
