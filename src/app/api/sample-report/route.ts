import { NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';
import { parseReportBuffer } from '@/lib/parser';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sample = searchParams.get('sample') || 'forecast';

  const filename = sample === 'customer'
    ? 'customer_behavior_dashboard.pbix'
    : 'Forecast_Analysis_Dashboard.pbix';

  const filePath = path.resolve(process.cwd(), filename);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json(
      { success: false, error: `Sample report file "${filename}" not found.` },
      { status: 404 }
    );
  }

  try {
    const buffer = fs.readFileSync(filePath);
    const parseResult = await parseReportBuffer(buffer, filename);

    return NextResponse.json(parseResult);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to parse sample report.' },
      { status: 500 }
    );
  }
}
