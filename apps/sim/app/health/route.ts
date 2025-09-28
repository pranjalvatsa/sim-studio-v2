import { NextResponse } from 'next/server'

/**
 * Health check endpoint for Railway deployment
 * Railway expects /health (not /api/health) for health checks
 */
export async function GET() {
  try {
    return NextResponse.json(
      {
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'sim-studio-nextjs',
        port: process.env.PORT || '3000',
        env: process.env.NODE_ENV || 'development'
      },
      { status: 200 }
    )
  } catch (error) {
    // Always return 200 for Railway health check
    return NextResponse.json(
      {
        status: 'ok',
        timestamp: new Date().toISOString(),
        note: 'Health check always returns ok for Railway deployment'
      },
      { status: 200 }
    )
  }
}