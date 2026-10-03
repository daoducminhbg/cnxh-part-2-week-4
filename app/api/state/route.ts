import { NextResponse } from 'next/server';
import { ParliamentSessionState } from '@/lib/types';
import { INITIAL_SESSION_STATE } from '@/lib/realtime';

export const dynamic = 'force-dynamic';

// In-memory server-side state for local network / classroom WiFi synchronization
let serverSessionState: ParliamentSessionState = { ...INITIAL_SESSION_STATE };

export async function GET() {
  return NextResponse.json(serverSessionState, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    serverSessionState = {
      ...serverSessionState,
      ...body,
      lastUpdated: Date.now(),
    };
    return NextResponse.json({ success: true, state: serverSessionState });
  } catch {
    return NextResponse.json({ error: 'Invalid state update' }, { status: 400 });
  }
}
