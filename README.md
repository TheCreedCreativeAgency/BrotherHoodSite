# The Creed - Brotherhood Platform

A modern subscription platform built with Next.js, featuring pixel-perfect Figma designs and glassmorphism UI.

## Features

- **Pixel-Perfect Design**: Implemented from Figma designs with exact color matching
- **Glassmorphism UI**: Modern translucent design with backdrop blur effects
- **Radial Payment Interface**: Interactive circular dial for amount selection
- **Authentication**: NextAuth.js integration for user management
- **Payment Processing**: Stripe integration for secure payments
- **Database**: Supabase PostgreSQL with real-time capabilities
- **Responsive Design**: Works perfectly on all screen sizes

## Tech Stack

- **Frontend**: Next.js 15, React, Tailwind CSS
- **Authentication**: NextAuth.js
- **Database**: Supabase (PostgreSQL)
- **Payments**: Stripe
- **Styling**: Custom CSS with glassmorphism effects

## Quick Start

1. **Clone and install:**
```bash
git clone <your-repo>
cd brotherhood
npm install
```

2. **Set up Supabase:**
```bash
npm run supabase:setup
```

3. **Configure environment variables:**
```env
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

4. **Create database tables:**
   - Copy `supabase-schema.sql` content
   - Run in Supabase SQL Editor

5. **Start development:**
```bash
npm run dev
```

## Project Structure

- `/src/app/page.js` - Main landing page
- `/src/app/payment/` - Payment and subscription pages
- `/src/app/api/` - API routes for authentication and payments
- `/src/lib/supabase.js` - Supabase client and database helpers
- `/supabase-schema.sql` - Database schema for Supabase

## Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Set environment variables in Vercel dashboard:**
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (your production domain)
   - `STRIPE_SECRET_KEY`
   - `STRIPE_PUBLISHABLE_KEY`

3. **Deploy:**
```bash
vercel --prod
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | Yes |
| `NEXTAUTH_SECRET` | Secret for NextAuth.js | Yes |
| `NEXTAUTH_URL` | Your application URL | Yes |
| `STRIPE_SECRET_KEY` | Stripe secret key | Yes |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Yes |

## Database Management

- **Supabase Dashboard**: Manage data, run queries, monitor performance
- **Health Check**: `/api/health` endpoint for monitoring
- **Schema**: See `supabase-schema.sql` for complete database structure

## Support

For issues and questions:
- Check the Supabase setup guide: `SUPABASE_SETUP.md`
- Review the health check endpoint: `/api/health`
- Monitor logs in Supabase dashboard

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
