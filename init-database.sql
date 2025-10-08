-- Initialize Sim Studio database with required extensions
-- Run this after connecting to your new PostgreSQL service

-- Create the database if it doesn't exist
-- CREATE DATABASE simstudio;

-- Connect to the simstudio database and add extensions
\c simstudio;

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Verify extensions are installed
\dx;

-- Show current database
SELECT current_database();