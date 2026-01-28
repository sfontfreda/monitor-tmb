import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const stopCode = searchParams.get('stop');

  if (!stopCode) {
    return NextResponse.json(
      { error: 'Stop code is required' },
      { status: 400 }
    );
  }

  const appId = process.env.TMB_APP_ID;
  const appKey = process.env.TMB_APP_KEY;

  try {
    const url = `https://api.tmb.cat/v1/itransit/bus/parades/${stopCode}?app_id=${appId}&app_key=${appKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`TMB API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error },
      { status: 500 }
    );
  }
}