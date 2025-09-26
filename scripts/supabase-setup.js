#!/usr/bin/env node

/**
 * Supabase Setup Script for The Creed Platform
 * This script helps you set up Supabase with the correct environment variables
 */

const fs = require('fs');
const path = require('path');

const envTemplate = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key-here"

# NextAuth Configuration
NEXTAUTH_SECRET="your-nextauth-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Stripe Configuration
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key_here"
STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key_here"
`;

function createEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  
  if (fs.existsSync(envPath)) {
    console.log('⚠️  .env.local already exists. Backing up to .env.local.backup');
    fs.copyFileSync(envPath, envPath + '.backup');
  }
  
  fs.writeFileSync(envPath, envTemplate);
  console.log('✅ Created .env.local template');
}

function showInstructions() {
  console.log('\n🚀 Supabase Setup Instructions:');
  console.log('================================');
  console.log('\n1. Go to https://supabase.com and create a new project');
  console.log('2. Get your project URL and anon key from Settings → API');
  console.log('3. Update .env.local with your actual values:');
  console.log('   - NEXT_PUBLIC_SUPABASE_URL');
  console.log('   - NEXT_PUBLIC_SUPABASE_ANON_KEY');
  console.log('\n4. Run the SQL script in Supabase SQL Editor:');
  console.log('   - Copy contents of supabase-schema.sql');
  console.log('   - Paste in Supabase Dashboard → SQL Editor');
  console.log('   - Click "Run"');
  console.log('\n5. Test your setup:');
  console.log('   npm run dev');
  console.log('   curl http://localhost:3000/api/health');
  console.log('\n6. Open database browser:');
  console.log('   npm run db:studio');
}

function main() {
  console.log('🔧 The Creed Supabase Setup');
  console.log('============================');
  
  createEnvFile();
  showInstructions();
  
  console.log('\n✅ Setup complete! Follow the instructions above.');
}

if (require.main === module) {
  main();
}

module.exports = { createEnvFile, showInstructions };
