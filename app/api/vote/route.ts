import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({ status: 'ok', service: 'parliament-vote-endpoint' });
}

export async function POST(req: Request) {
  try {
    const { voterId, optionId } = await req.json();

    if (!voterId || !['A', 'B', 'C', 'D'].includes(optionId)) {
      return NextResponse.json({ error: 'Dữ liệu biểu quyết không hợp lệ' }, { status: 400 });
    }

    return NextResponse.json({ success: true, voterId, choice: optionId });
  } catch {
    return NextResponse.json({ error: 'Lỗi ghi nhận biểu quyết' }, { status: 500 });
  }
}
