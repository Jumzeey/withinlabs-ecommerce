import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Forward the request to your JSON server
  const res = await fetch(`http://localhost:3001/products?${searchParams}`);
  const data = await res.json();

  return NextResponse.json(data);
}
