import { NextResponse } from 'next/server';
import axios from 'axios';

interface PaystackResponse {
  status: string;
  data: {
    status: string;
    [key: string]: any;
  };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const reference = searchParams.get('reference');

  if (!reference) {
    return NextResponse.json({ status: 'error', message: 'Reference is required' }, { status: 400 });
  }

  try {
    const response = await axios.get<PaystackResponse>(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_PUBLIC_KEY}`,
      },
    });

    if (response.data.data.status === "success") {
      return NextResponse.json({ status: "success", data: response.data.data }, { status: 200 });
    } else {
      return NextResponse.json({ status: "failed", message: response.data.data.message }, { status: 400 });
    }
  } catch (error) {
    console.error("Error verifying transaction:", error);
    return NextResponse.json({ status: "error", message: "Something went wrong while verifying the transaction" }, { status: 500 });
  }
}