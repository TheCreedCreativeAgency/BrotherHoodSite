# The Creed - Brotherhood Platform

A modern subscription platform built with Next.js, featuring pixel-perfect Figma designs and glassmorphism UI.

## Features

- **Pixel-Perfect Design**: Implemented from Figma designs with exact color matching
- **Glassmorphism UI**: Modern translucent design with backdrop blur effects
- **Radial Payment Interface**: Interactive circular dial for amount selection
- **Authentication**: NextAuth.js integration for user management
- **Payment Processing**: Stripe integration for secure payments
- **Responsive Design**: Works perfectly on all screen sizes

## Tech Stack

- **Frontend**: Next.js 15, React, Tailwind CSS
- **Authentication**: NextAuth.js
- **Database**: Prisma with SQLite
- **Payments**: Stripe
- **Styling**: Custom CSS with glassmorphism effects

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
# Add your Stripe keys and NextAuth secret
```

3. Set up the database:
```bash
npx prisma migrate dev
npx prisma generate
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

- `/src/app/page.js` - Main landing page
- `/src/app/payment/` - Payment and subscription pages
- `/src/app/api/` - API routes for authentication and payments
- `/prisma/` - Database schema and migrations

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
