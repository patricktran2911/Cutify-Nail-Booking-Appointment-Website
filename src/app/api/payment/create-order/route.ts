import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/lib/paypal";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const amount = body.amount;

    if (typeof amount !== "number" || amount <= 0 || amount > 100) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }

    const orderId = await createOrder(amount);
    return NextResponse.json({ id: orderId });
  } catch (error) {
    console.error("PayPal create order error:", error);
    return NextResponse.json(
      { error: "Failed to create payment order" },
      { status: 500 }
    );
  }
}
