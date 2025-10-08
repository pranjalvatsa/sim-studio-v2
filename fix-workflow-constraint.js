const postgres = require('postgres')

// Database connection
const connectionString = process.env.DATABASE_URL

// We'll create this locally but deploy it via railway
console.log('Migration to make workflow_id nullable in copilot_chats table')
console.log('')
console.log('This will fix the error by allowing copilot chats to be created without a workflow_id')
console.log('')
console.log('SQL to run:')
console.log('ALTER TABLE copilot_chats ALTER COLUMN workflow_id DROP NOT NULL;')
console.log('')

if (connectionString) {
  const sql = postgres(connectionString)

  async function fixWorkflowIdConstraint() {
    try {
      console.log('Making workflow_id nullable...')

      // Drop the NOT NULL constraint on workflow_id
      await sql`ALTER TABLE copilot_chats ALTER COLUMN workflow_id DROP NOT NULL;`

      console.log('✅ Successfully made workflow_id nullable')

      // Test the insert that was failing
      console.log('\nTesting the problematic insert...')
      const testInsert = await sql`
        INSERT INTO copilot_chats (user_id, workflow_id, title, messages, model)
        VALUES ('ezR3jASADT2788ew0FFcJEE6GK50024T', NULL, '', '[]'::jsonb, 'claude-3-7-sonnet-latest')
        RETURNING id;
      `

      console.log('✅ Insert with NULL workflow_id successful, ID:', testInsert[0].id)

      // Clean up
      await sql`DELETE FROM copilot_chats WHERE id = ${testInsert[0].id}`
      console.log('✅ Test record cleaned up')
    } catch (error) {
      console.error('❌ Error:', error.message)
      console.error('Full error:', error)
    } finally {
      await sql.end()
    }
  }

  fixWorkflowIdConstraint()
} else {
  console.log('No DATABASE_URL found - run with railway run node fix-workflow-constraint.js')
}
