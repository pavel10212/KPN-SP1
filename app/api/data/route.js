import {NextResponse} from "next/server";

// Variable to store fetched data

export async function GET() {
  const response = await fetch("https://api.beds24.com/json/getBookings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      authentication: {
        apiKey: process.env.API_KEY,
        propKey: process.env.PROP_KEY,
      },
      includeInvoice: false,
      includeInfoItems: false,
    }),
  });

  const data = await response.json();
  return NextResponse.json(data);
}
