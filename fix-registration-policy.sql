-- Fix User Registration RLS Policy
-- Run this in your Supabase SQL Editor

-- First, drop the existing policy
DROP POLICY IF EXISTS "Allow user registration" ON users;

-- Create a new policy that explicitly allows anonymous users to register
CREATE POLICY "Allow user registration" ON users
    FOR INSERT 
    TO anon, authenticated
    WITH CHECK (true);

-- Also ensure the table allows anonymous access
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions to anonymous users
GRANT INSERT ON users TO anon;
GRANT USAGE ON SCHEMA public TO anon;

-- Test the policy by checking if it exists
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual 
FROM pg_policies 
WHERE tablename = 'users' 
    AND policyname = 'Allow user registration';
