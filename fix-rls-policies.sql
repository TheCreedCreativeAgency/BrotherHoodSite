-- Fix RLS Policies for User Registration
-- Run this in your Supabase SQL Editor to fix the registration issue

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can insert own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can insert own payments" ON payments;

-- Add new policies that allow registration and payment creation
CREATE POLICY "Allow user registration" ON users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow subscription creation" ON subscriptions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow payment creation" ON payments
    FOR INSERT WITH CHECK (true);

-- Verify policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('users', 'subscriptions', 'payments')
ORDER BY tablename, policyname;
