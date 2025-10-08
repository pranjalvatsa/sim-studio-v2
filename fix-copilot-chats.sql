-- Migration to fix copilot_chats table constraint
-- This fixes the error: "Failed query: insert into copilot_chats..."
-- The issue is that workflow_id is NOT NULL but copilot chats can be created without a workflow

-- Make workflow_id nullable to allow copilot chats without workflows
ALTER TABLE copilot_chats ALTER COLUMN workflow_id DROP NOT NULL;

-- Add a comment explaining the change
COMMENT ON COLUMN copilot_chats.workflow_id IS 'Workflow ID - nullable to allow chats without specific workflows';

-- Test the fix by checking if we can insert with NULL workflow_id (this is just for verification)
-- The actual API will handle the insert