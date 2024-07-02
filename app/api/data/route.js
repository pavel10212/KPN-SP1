import { NextResponse } from "next/server";

// Variable to store fetched data
let cachedData = null;

export async function GET() {
  // Check if data is already fetched
  if (cachedData) {
    return NextResponse.json(cachedData);
  }

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
  // Store fetched data in the cache
  cachedData = data;
  return NextResponse.json(data);
}
