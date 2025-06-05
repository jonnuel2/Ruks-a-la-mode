// import { NextRequest, NextResponse } from "next/server";
// import { db } from "@/helpers/utils/db";
// import crypto from "crypto";
// import bcrypt from "bcryptjs";

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { email } = body;

//     // Validate input
//     if (!email) {
//       return NextResponse.json(
//         { success: false, message: "Email is required" },
//         { status: 400 }
//       );
//     }

//     // Check if the user exists
//     const userQuery = await db
//       .collection("users")
//       .where("email", "==", email)
//       .limit(1)
//       .get();

//     if (userQuery.empty) {
//       return NextResponse.json(
//         { success: false, message: "User not found" },
//         { status: 404 }
//       );
//     }

//     const userDoc = userQuery.docs[0];
//     const userData = userDoc.data();

//     // Generate a unique reset token
//     const resetToken = crypto.randomBytes(32).toString("hex");
//     const hashedToken = await bcrypt.hash(resetToken, 10);
//     const resetTokenExpiry = Date.now() + 3600000; // Token valid for 1 hour

//     // Update the user's document with the reset token and expiry
//     await userDoc.ref.update({
//       resetToken:hashedToken,
//       resetTokenExpiry,
//     });

//     // Construct and return the reset password link
//     const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;
//    //Remove resetLink from the response once email is sent on the frontend
//     // Here you would typically send the reset link via email
//     return NextResponse.json(
//       { success: true, resetLink },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error during forgot password:", error);
//     return NextResponse.json(
//       { success: false, message: "Failed to process forgot password request." },
//       { status: 500 }
//     );
//   }
// }


// app/api/users/forgot-password/route.ts

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/helpers/utils/db";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
    }

    const userQuery = await db
      .collection("users")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (userQuery.empty) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const userDoc = userQuery.docs[0];

    // Generate reset token and expiration
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = await bcrypt.hash(resetToken, 10);
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    await userDoc.ref.update({
      resetToken: hashedToken,
      resetTokenExpiry,
    });

    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/Auth/password-reset?token=${resetToken}`;

    // Send email using Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Ruks Á La Mode" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request",
      html: `
        <h2>Password Reset</h2>
        <p>Hello,</p>
        <p>You requested to reset your password. Click the link below to reset it:</p>
        <a href="${resetLink}" target="_blank">${resetLink}</a>
        <p>This link is valid for 1 hour. If you didn't request this, please ignore this email.</p>
      `,
    });

    return NextResponse.json({ success: true, message: "Reset email sent." }, { status: 200 });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ success: false, message: "Server error." }, { status: 500 });
  }
}
