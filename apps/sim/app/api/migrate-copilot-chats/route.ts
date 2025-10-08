// Temporary migration endpoint to fix copilot_chats table
// This will be accessible at /api/migrate-copilot-chats
// Run once and then remove this endpoint

import { db } from '@sim/db'
import { sql } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Check if already migrated
    const currentConstraint = await db.execute(sql`
      SELECT is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'copilot_chats' AND column_name = 'workflow_id'
    `)

    const isNullable = currentConstraint[0]?.is_nullable === 'YES'

    if (isNullable) {
      return NextResponse.json({
        success: true,
        message: 'Migration already applied - workflow_id is nullable',
      })
    }

    // Apply the migration
    await db.execute(sql`ALTER TABLE copilot_chats ALTER COLUMN workflow_id DROP NOT NULL`)

    // Verify the change
    const updatedConstraint = await db.execute(sql`
      SELECT is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'copilot_chats' AND column_name = 'workflow_id'
    `)

    const isNowNullable = updatedConstraint[0]?.is_nullable === 'YES'

    if (isNowNullable) {
      return NextResponse.json({
        success: true,
        message: 'Migration applied successfully - workflow_id is now nullable',
        before: 'NOT NULL',
        after: 'nullable',
      })
    }
    return NextResponse.json(
      {
        success: false,
        message: 'Migration may have failed - constraint still exists',
      },
      { status: 500 }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      {
        success: false,
        message: 'Migration failed',
        error: errorMessage,
      },
      { status: 500 }
    )
  }
}
