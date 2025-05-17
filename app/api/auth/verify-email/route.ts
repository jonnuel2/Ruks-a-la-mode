import { type NextRequest, NextResponse } from "next/server"
import { db, admin } from "@/helpers/utils/db"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { token } = body

    console.log("Received verification request for token:", token)

    if (!token) {
      return NextResponse.json({ success: false, message: "Verification token is required" }, { status: 400 })
    }

    // Find the user with this verification token
    const usersRef = db.collection("users")
    const userSnapshot = await usersRef.where("verificationToken", "==", token).get()

    if (userSnapshot.empty) {
      console.log("No user found with token:", token)
      return NextResponse.json({ success: false, message: "Invalid verification token" }, { status: 400 })
    }

    const userDoc = userSnapshot.docs[0]
    const userData = userDoc.data()
    console.log("Found user:", userDoc.id)

    // Check if token is expired (24 hours)
    if (userData.tokenCreatedAt) {
      const tokenCreatedAt = userData.tokenCreatedAt.toDate ? userData.tokenCreatedAt.toDate() : userData.tokenCreatedAt
      const now = new Date()
      const tokenAgeHours = (now.getTime() - tokenCreatedAt.getTime()) / (1000 * 60 * 60)

      if (tokenAgeHours > 24) {
        console.log("Token expired. Age in hours:", tokenAgeHours)
        return NextResponse.json(
          { success: false, message: "Verification token has expired. Please request a new one." },
          { status: 400 },
        )
      }
    }

    // Update user as verified
    console.log("Updating user as verified")
    await userDoc.ref.update({
      isVerified: true,
      verificationToken: null,
      tokenCreatedAt: null,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    })

    console.log("User verified successfully")
    return NextResponse.json({ success: true, message: "Email verified successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error verifying email:", error)
    return NextResponse.json(
      { success: false, message: "Failed to verify email", error: error.message },
      { status: 500 },
    )
  }
}
