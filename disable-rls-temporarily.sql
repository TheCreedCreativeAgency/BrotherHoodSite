-- Temporarily disable RLS for users table to allow registration
-- Run this in your Supabase SQL Editor

-- Disable RLS on users table
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT ALL ON users TO anon;
GRANT ALL ON users TO authenticated;

-- Re-enable RLS but with permissive policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create very permissive policies
CREATE POLICY "Allow all operations on users" ON users
    FOR ALL 
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- Verify the setup
SELECT 
    schemaname, 
    tablename, 
    rowsecurity 
FROM pg_tables 
WHERE tablename = 'users';
