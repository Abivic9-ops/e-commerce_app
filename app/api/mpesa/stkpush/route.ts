import { NextResponse } from 'next/server';

export async function POST() {
  try {
    return NextResponse.json({ message: 'STK Push Route Scaffolded' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
