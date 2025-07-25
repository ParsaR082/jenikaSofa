import { NextResponse } from 'next/server';

export async function GET() {
  // Return a simple health check response
  return NextResponse.json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
}

export const dynamic = 'force-dynamic'; 