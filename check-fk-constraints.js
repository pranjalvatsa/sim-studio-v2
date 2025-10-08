// Let's investigate the foreign key constraint issue
// The error suggests that either the user_id or workflow_id being inserted doesn't exist in the referenced tables

console.log('The copilot_chats insert is failing with these values:')
console.log('user_id: ezR3jASADT2788ew0FFcJEE6GK50024T')
console.log('workflow_id: a2ac879f-455c-42c2-887f-5f16db2e887f')
console.log('')

console.log('This suggests one of these issues:')
console.log('1. The user_id "ezR3jASADT2788ew0FFcJEE6GK50024T" does not exist in the "user" table')
console.log(
  '2. The workflow_id "a2ac879f-455c-42c2-887f-5f16db2e887f" does not exist in the "workflow" table'
)
console.log('3. There is a foreign key constraint preventing the insert')
console.log('')

console.log('Solutions:')
console.log('1. Make sure the user exists before creating copilot chat')
console.log('2. Make sure the workflow exists before creating copilot chat')
console.log('3. Check if foreign key constraints should be nullable')
console.log('4. Make workflow_id nullable if copilot chats can exist without workflows')

// Based on the schema, let's see what the issue might be
console.log('')
console.log('From the schema in packages/db/schema.ts:')
console.log('- user_id references user.id with CASCADE delete')
console.log('- workflow_id references workflow.id with CASCADE delete')
console.log('- Both are NOT NULL, so they must exist')
console.log('')
console.log('The issue is likely that either:')
console.log('- User "ezR3jASADT2788ew0FFcJEE6GK50024T" does not exist')
console.log('- Workflow "a2ac879f-455c-42c2-887f-5f16db2e887f" does not exist')
