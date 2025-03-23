// app/api/paystack/initialize/route.js
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

// Use your Paystack secret key from environment variables
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_API_KEY_LIVE;

// Initialize transaction function
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, price, callbackUrl, currency } = body;
    console.log(email, price, callbackUrl);

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: price * 100, // Amount in kobo
        callback_url: callbackUrl,
        currency,
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error initializing transaction:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
