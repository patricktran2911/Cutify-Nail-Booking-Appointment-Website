const PAYPAL_API = process.env.PAYPAL_API_URL ?? "https://api-m.sandbox.paypal.com";

async function getAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !secret) {
    throw new Error("PayPal credentials not configured");
  }

  const credentials = Buffer.from(`${clientId}:${secret}`).toString("base64");

  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    throw new Error("Failed to get PayPal access token");
  }

  const data = await res.json();
  return data.access_token;
}

export async function createOrder(amount: number): Promise<string> {
  const accessToken = await getAccessToken();

  const res = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: amount.toFixed(2),
          },
          description: "Cutify Nails — Appointment Deposit",
        },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to create PayPal order");
  }

  const data = await res.json();
  return data.id;
}

export async function captureOrder(
  orderId: string
): Promise<{ id: string; status: string }> {
  const accessToken = await getAccessToken();

  const res = await fetch(
    `${PAYPAL_API}/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to capture PayPal order");
  }

  const data = await res.json();
  return { id: data.id, status: data.status };
}
