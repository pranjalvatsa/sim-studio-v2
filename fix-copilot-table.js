const postgres = require('postgres')

// Database connection
const connectionString = process.env.DATABASE_URL
const sql = postgres(connectionString)

async function checkCopilotChatsTable() {
  try {
    console.log('Checking copilot_chats table...')

    // Check table structure
    const columns = await sql`
      SELECT column_name, data_type, is_nullable, column_default, udt_name
      FROM information_schema.columns
      WHERE table_name = 'copilot_chats'
      ORDER BY ordinal_position;
    `

    console.log('Current table structure:')
    columns.forEach((col) => {
      console.log(
        `  ${col.column_name}: ${col.data_type}/${col.udt_name} (nullable: ${col.is_nullable}, default: ${col.column_default})`
      )
    })

    // Check constraints
    console.log('\nTable constraints:')
    const constraints = await sql`
      SELECT constraint_name, constraint_type, column_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
      WHERE tc.table_name = 'copilot_chats';
    `

    constraints.forEach((constraint) => {
      console.log(
        `  ${constraint.constraint_name}: ${constraint.constraint_type} on ${constraint.column_name}`
      )
    })

    // Check foreign key references
    console.log('\nForeign key constraints:')
    const fkConstraints = await sql`
      SELECT 
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name,
        rc.delete_rule
      FROM information_schema.key_column_usage kcu
      JOIN information_schema.referential_constraints rc ON kcu.constraint_name = rc.constraint_name
      JOIN information_schema.constraint_column_usage ccu ON rc.unique_constraint_name = ccu.constraint_name
      WHERE kcu.table_name = 'copilot_chats';
    `

    fkConstraints.forEach((fk) => {
      console.log(
        `  ${fk.column_name} -> ${fk.foreign_table_name}.${fk.foreign_column_name} (delete: ${fk.delete_rule})`
      )
    })

    // Test the problematic insert from the error message
    console.log('\nTesting the exact insert that failed...')
    try {
      const testInsert2 = await sql`
        INSERT INTO copilot_chats (user_id, workflow_id, title, messages, model)
        VALUES ('ezR3jASADT2788ew0FFcJEE6GK50024T', 'a2ac879f-455c-42c2-887f-5f16db2e887f', '', '[]'::jsonb, 'claude-3-7-sonnet-latest')
        RETURNING id;
      `
      console.log('✅ Problematic insert successful, ID:', testInsert2[0].id)

      // Clean up
      await sql`DELETE FROM copilot_chats WHERE id = ${testInsert2[0].id}`
      console.log('✅ Test record cleaned up')
    } catch (insertError) {
      console.error('❌ Insert failed:', insertError.message)
      console.error('Full insert error:', insertError)
    }
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.error('Full error:', error)
  } finally {
    await sql.end()
  }
}

checkCopilotChatsTable()
