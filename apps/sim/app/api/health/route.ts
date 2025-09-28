import { NextResponse } from 'next/server'

/**
 * Health check endpoint for Railway and monitoring services
 * This endpoint must return 200 status for Railway health checks to pass
 */
export async function GET() {
  try {
    // Simple health check that returns 200
    return NextResponse.json(
      {
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'sim-studio',
        port: process.env.PORT || '3000'
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: 'Health check failed'
      },
      { status: 500 }
    )
  }
}