import { NextResponse } from 'next/server'

/**
 * Health check endpoint for Railway and monitoring services
 * This endpoint must return 200 status for Railway health checks to pass
 */
export async function GET() {
  try {
    // Always return 200 for health checks - Railway just needs to know the app is running
    return NextResponse.json(
      {
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'sim-studio',
        port: process.env.PORT || '3000',
        env: process.env.NODE_ENV || 'development'
      },
      { status: 200 }
    )
  } catch (error) {
    // Even if there's an error, return 200 for Railway health check
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