import { NextRequest, NextResponse } from "next/server";
import { db, firebase } from "@/helpers/utils/db";
import crypto from "crypto";
const nodemailer = require("nodemailer");

// Helper to send password reset email
const sendResetEmail = async (email: string, resetLink: string, firstName: string) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587", 10),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const htmlContent = `
      <p>Hello ${firstName},</p>
      <p>We received a request to reset your password. Click the link below to set a new password:</p>
      <a href="${resetLink}" style="color: #bb3a00; text-decoration: none;">Reset Password</a>
      <p>If you didn't request this, you can safely ignore this email.</p>
    `;

    const mailOptions = {
      from: process.env.EMAIL_FROM || '"RUKS Á LA MODE" <no-reply@ruksalamode.com>',
      to: email,
      subject: "Password Reset Request",
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Failed to send password reset email:", error);
    throw new Error("Email sending failed");
  }
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    // Validate input
    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    // Check if the user exists
    const userQuery = await db
      .collection("users")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (userQuery.empty) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const userDoc = userQuery.docs[0];
    const userData = userDoc.data();
    const firstName = userData.firstName || "User";

    // Generate a unique reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; // Token valid for 1 hour

    // Update the user's document with the reset token and expiry
    await userDoc.ref.update({
      resetToken,
      resetTokenExpiry,
    });

    // Construct the reset password link
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

    // Send the password reset email
    await sendResetEmail(email, resetLink, firstName);

    return NextResponse.json(
      { success: true, message: "Password reset email sent successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during forgot password:", error);
    return NextResponse.json(
      { success: false, message: "Failed to process forgot password request." },
      { status: 500 }
    );
  }
}
