-- Migration: Make copilot_chats.workflow_id nullable
-- Fix for: "Failed query: insert into copilot_chats..." error
-- Issue: workflow_id was NOT NULL but copilot chats can be created without workflows

ALTER TABLE copilot_chats ALTER COLUMN workflow_id DROP NOT NULL;

-- Add comment explaining the nullable workflow_id
COMMENT ON COLUMN copilot_chats.workflow_id IS 'Workflow ID - nullable to allow chats without specific workflows';