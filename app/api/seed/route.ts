import { NextResponse } from 'next/server';
import { seedDatabase, forceSeedDatabase } from '@/app/actions/seed';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const force = body?.force === true;

    const result = force ? await forceSeedDatabase() : await seedDatabase();

    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Seed failed' },
      { status: 500 }
    );
  }
}
