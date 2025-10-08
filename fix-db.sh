#!/bin/bash

echo "Fix for copilot_chats workflow_id constraint"
echo "This will make workflow_id nullable to allow copilot chats without workflows"
echo ""

echo "Connecting to database..."
psql "$DATABASE_URL" -c "ALTER TABLE copilot_chats ALTER COLUMN workflow_id DROP NOT NULL;"

if [ $? -eq 0 ]; then
    echo "✅ Successfully made workflow_id nullable"
    echo ""
    echo "Testing insert with NULL workflow_id..."
    psql "$DATABASE_URL" -c "INSERT INTO copilot_chats (user_id, workflow_id, title, messages, model) VALUES ('test-user', NULL, 'Test', '[]'::jsonb, 'claude-3-7-sonnet-latest') RETURNING id;"
    
    echo ""
    echo "Cleaning up test record..."
    psql "$DATABASE_URL" -c "DELETE FROM copilot_chats WHERE user_id = 'test-user';"
    
    echo "✅ Fix complete! Copilot chats can now be created without workflow_id"
else
    echo "❌ Failed to modify table"
fi