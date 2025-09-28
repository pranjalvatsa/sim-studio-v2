import { NextResponse } from 'next/server'
import { createLogger } from '@/lib/logs/console/logger'

const logger = createLogger('HealthAPI')

/**
 * Health check endpoint for Railway and monitoring services
 */
export async function GET() {
  try {
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'sim-studio-main',
      version: process.env.npm_package_version || 'unknown'
    })
  } catch (error) {
    logger.error('Health check failed:', error)
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        service: 'sim-studio-main',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}