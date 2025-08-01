
import { NextRequest, NextResponse } from "next/server";
import { db, firebase } from "@/helpers/utils/db";
import bcrypt from "bcryptjs";
import crypto from "crypto";
const nodemailer = require("nodemailer");

// Helper to send email
const sendEmail = async (email: string, verificationLink: string, firstName: string) => {
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
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Verification</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');
                /* Add all your styles here from the provided template */
            </style>
        </head>
        <body>
            <div class="email-wrapper">
                <div class="email-container">
                    <div class="logo-header">
                        <div class="logo"><span class="brand-name">RUKS Á LA MODE</span></div>
                    </div>
                    <div class="verification-header">EMAIL VERIFICATION REQUIRED</div>
                    <div class="email-body">
                        <div class="greeting-section">
                            <h2>Verify Your Email Address</h2>
                            <p>Hello ${firstName}! Please verify that this is your email address:</p>
                            <p><strong>${email}</strong></p>
                        </div>
                        <div class="verification-section">
                            <p>Click the button below to verify your email:</p>
                            <a href="${verificationLink}" class="verification-button" target="_blank">VERIFY EMAIL</a>
                            <p>Or copy and paste this link into your browser:</p>
                            <div class="verification-code">${verificationLink}</div>
                            <p>This verification link will expire in 24 hours.</p>
                        </div>
                        <div class="support-section">
                            <p>If you didn't request this email, you can safely ignore it.</p>
                            <p>Need help? Contact us at <a href="mailto:ruksalamode@gmail.com
">ruksalamode@gmail.com
</a></p>
                        </div>
                    </div>
                    <div class="email-footer">
                        <p>&copy; 2025 <span class="brand-name">RUKS Á LA MODE</span>. All Rights Reserved.</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
      `;
  
      const mailOptions = {
        from: process.env.EMAIL_FROM || '"RUKS Á LA MODE" <no-reply@ruksalamode.com>',
        to: email,
        subject: "Email Verification Required",
        html: htmlContent,
      };
  
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Failed to send verification email:", error);
      throw new Error("Email sending failed");
    }
  };
  

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, password, confirmPassword } = body;

    // Validate input
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: "Passwords do not match" },
        { status: 400 }
      );
    }

    // Check if the user already exists
    const usersRef = db.collection("users");
    const existingUserSnapshot = await usersRef.where("email", "==", email).get();
    if (!existingUserSnapshot.empty) {
      return NextResponse.json(
        { success: false, message: "User already exists" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Create the new user in Firestore
    const newUser = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      verificationToken,
      tokenCreatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      isVerified: false,
    };

    const newUserRef = await usersRef.add(newUser);

    // Construct the verification link
    // const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verificationToken}`;

    // Send the verification email
    // await sendEmail(email, verificationLink, firstName);

    return NextResponse.json(
      { success: true, message: "User registered successfully."},
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during user signup:", error);
    return NextResponse.json(
      { success: false, message: "Failed to register user" },
      { status: 500 }
    );
  }
}
