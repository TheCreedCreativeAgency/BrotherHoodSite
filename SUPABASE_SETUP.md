# Supabase Setup Guide for The Creed Platform

## 🚀 Quick Setup Steps

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login
3. Click "New Project"
4. Choose organization
5. Enter project name: "brotherhood"
6. Set database password (save this!)
7. Choose region closest to your users
8. Click "Create new project"

### 2. Get Database Connection String
1. Go to **Settings** → **Database**
2. Scroll down to **Connection string**
3. Copy the **URI** connection string
4. It looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

### 3. Update Environment Variables

**Create `.env.local` file:**
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key-here"

# NextAuth
NEXTAUTH_SECRET="your-random-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Stripe
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"
```

**For Production (`.env.production`):**
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key-here"

# NextAuth
NEXTAUTH_SECRET="your-production-secret-key"
NEXTAUTH_URL="https://yourdomain.com"

# Stripe
STRIPE_SECRET_KEY="sk_live_your_live_stripe_secret_key"
STRIPE_PUBLISHABLE_KEY="pk_live_your_live_stripe_publishable_key"
```

### 4. Initialize Database
```bash
# Generate Prisma client
npm run postinstall

# Push schema to Supabase
npm run db:push

# Or create migration
npm run db:migrate
```

### 5. Verify Setup
```bash
# Open database browser
npm run db:studio

# Check health
curl http://localhost:3000/api/health
```

## 🔧 Supabase Dashboard Features

### Database Management
- **Table Editor**: View/edit data directly
- **SQL Editor**: Run custom queries
- **Database Logs**: Monitor queries and performance
- **Backups**: Automatic daily backups

### Authentication (Optional)
- **User Management**: Built-in auth system
- **Social Logins**: Google, GitHub, etc.
- **Email Templates**: Customizable

### Real-time Features (Optional)
- **Subscriptions**: Real-time data updates
- **Presence**: User online status
- **Broadcasts**: Send messages to users

## 📊 Database Schema

Your Supabase database will have these tables:

### `users` table
- `id` (Primary Key)
- `email` (Unique)
- `password` (Hashed)
- `stripeCustomerId` (Optional)
- `createdAt`, `updatedAt`

### `subscriptions` table
- `id` (Primary Key)
- `userId` (Foreign Key)
- `stripeSubscriptionId` (Unique)
- `status`, `currentPeriodEnd`
- `createdAt`, `updatedAt`

### `payments` table
- `id` (Primary Key)
- `userId` (Foreign Key)
- `stripePaymentIntentId` (Unique)
- `amount`, `currency`, `status`
- `createdAt`

## 🚀 Deployment to Vercel

### 1. Set Environment Variables in Vercel
1. Go to your Vercel project dashboard
2. Go to **Settings** → **Environment Variables**
3. Add these variables:
   - `DATABASE_URL`: Your Supabase connection string
   - `NEXTAUTH_SECRET`: Random secret key
   - `NEXTAUTH_URL`: Your production domain
   - `STRIPE_SECRET_KEY`: Your Stripe secret key
   - `STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key

### 2. Deploy
```bash
# Deploy to Vercel
vercel --prod

# Or push to GitHub (if connected)
git push origin main
```

## 🔍 Monitoring & Management

### Prisma Studio
```bash
npm run db:studio
```
- Web interface to manage your data
- Works with Supabase
- No additional setup needed

### Supabase Dashboard
- **Table Editor**: Direct database access
- **SQL Editor**: Run queries
- **Logs**: Monitor performance
- **Settings**: Manage project

### Health Check
Visit: `https://yourdomain.com/api/health`
- Checks database connection
- Shows user count
- Monitors system health

## 🛠️ Common Commands

```bash
# Development
npm run dev              # Start development server
npm run db:studio        # Open database browser
npm run db:push          # Push schema changes
npm run db:migrate       # Create migration

# Production
npm run build            # Build for production
npm run db:migrate:deploy # Deploy migrations
npm run start            # Start production server
```

## 🔐 Security Best Practices

1. **Environment Variables**: Never commit `.env` files
2. **Database Password**: Use strong, unique passwords
3. **Row Level Security**: Enable in Supabase dashboard
4. **API Keys**: Rotate regularly
5. **Backups**: Supabase handles this automatically

## 🆘 Troubleshooting

### Connection Issues
```bash
# Test connection
npx prisma db pull

# Reset if needed
npm run db:reset
```

### Migration Issues
```bash
# Check migration status
npx prisma migrate status

# Reset migrations
npx prisma migrate reset
```

### Performance Issues
- Check Supabase dashboard for slow queries
- Add indexes for frequently queried fields
- Use connection pooling

## 📈 Scaling

### Supabase Limits
- **Free Tier**: 500MB database, 2GB bandwidth
- **Pro Tier**: 8GB database, 250GB bandwidth
- **Team Tier**: 100GB database, 1TB bandwidth

### Optimization
- Use indexes on frequently queried columns
- Implement caching with Redis
- Use Supabase Edge Functions for heavy operations
- Monitor query performance

---

**Need Help?**
- Supabase Docs: https://supabase.com/docs
- Prisma Docs: https://www.prisma.io/docs
- Community: Supabase Discord, GitHub Discussions
