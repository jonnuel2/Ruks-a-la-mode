// app/api/paystack/verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

interface VerifyResponse {
  status: boolean;
  message: string;
  data: {
    amount: number;
    currency: string;
    customer: {
      email: string;
    };
    status: string;
    reference: string;
  };
}

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_API_KEY_LIVE;

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const txref = searchParams.get("txref");

  if (!txref) {
    return NextResponse.json({ error: "No txref provided" }, { status: 400 });
  }

  try {
    const response = await axios.get<VerifyResponse>(
      `https://api.paystack.co/transaction/verify/${txref}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
