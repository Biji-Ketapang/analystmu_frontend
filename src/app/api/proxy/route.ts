import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // Ambil body JSON dari request frontend
  const body = await req.text();
  // Kirim ke endpoint ngrok
  const response = await fetch('https://aspiratory-jamey-winterly.ngrok-free.dev/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  });
  // Ambil response dari backend AI
  const result = await response.text();
  // Forward response ke frontend
  return new NextResponse(result, {
    status: response.status,
    headers: {
      'Content-Type': response.headers.get('Content-Type') || 'application/json',
    },
  });
}
