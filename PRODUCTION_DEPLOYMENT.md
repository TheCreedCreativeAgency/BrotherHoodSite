# Production Deployment Guide

## 🚀 Pre-Deployment Checklist

### ✅ Environment Variables
Make sure you have these environment variables set in your deployment platform:

```env
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL="https://your-project-ref.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"

# NextAuth (Required)
NEXTAUTH_SECRET="your-production-secret-key"
NEXTAUTH_URL="https://yourdomain.com"

# Stripe (Required)
STRIPE_SECRET_KEY="sk_live_your_live_stripe_secret_key"
STRIPE_PUBLISHABLE_KEY="pk_live_your_live_stripe_publishable_key"
```

### ✅ Database Setup
1. **Supabase Tables Created**: Run `supabase-schema.sql` in Supabase SQL Editor
2. **Database Health**: Test with `/api/health` endpoint
3. **RLS Policies**: Verify Row Level Security is enabled

### ✅ Stripe Configuration
1. **Live Keys**: Use production Stripe keys (sk_live_*, pk_live_*)
2. **Webhooks**: Configure Stripe webhooks for your production domain
3. **Products**: Set up your subscription products in Stripe Dashboard

## 🎯 Deployment Platforms

### Vercel (Recommended)

1. **Connect Repository**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Select "brotherhood" project

2. **Configure Environment Variables**:
   - Go to Project Settings → Environment Variables
   - Add all required variables (see checklist above)
   - Set for Production environment

3. **Deploy**:
   - Vercel will automatically deploy on push to main branch
   - Or manually deploy: `vercel --prod`

4. **Custom Domain** (Optional):
   - Add your custom domain in Vercel dashboard
   - Update `NEXTAUTH_URL` to match your domain

### Netlify

1. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `.next`

2. **Environment Variables**:
   - Add all required variables in Netlify dashboard
   - Site settings → Environment variables

3. **Deploy**:
   - Connect GitHub repository
   - Deploy automatically on push

### Railway

1. **Create Project**:
   - Connect GitHub repository
   - Select "brotherhood" project

2. **Environment Variables**:
   - Add all required variables in Railway dashboard

3. **Deploy**:
   - Railway will automatically deploy

## 🔧 Post-Deployment

### 1. Test Critical Functions
```bash
# Health check
curl https://yourdomain.com/api/health

# Test registration
curl -X POST https://yourdomain.com/api/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass"}'
```

### 2. Monitor Performance
- **Supabase Dashboard**: Monitor database performance
- **Vercel Analytics**: Track page views and performance
- **Stripe Dashboard**: Monitor payments and subscriptions

### 3. Set Up Monitoring
- **Uptime Monitoring**: Use services like UptimeRobot
- **Error Tracking**: Consider Sentry for error monitoring
- **Logs**: Monitor application logs in your hosting platform

## 🔐 Security Checklist

### ✅ Environment Security
- [ ] All secrets are in environment variables (not in code)
- [ ] Production keys are different from development
- [ ] Database credentials are secure
- [ ] API keys have proper permissions

### ✅ Application Security
- [ ] HTTPS is enabled
- [ ] CORS is properly configured
- [ ] Input validation is in place
- [ ] Rate limiting is implemented

### ✅ Database Security
- [ ] Row Level Security (RLS) is enabled
- [ ] Database backups are configured
- [ ] Access logs are monitored

## 📊 Performance Optimization

### ✅ Frontend
- [ ] Images are optimized
- [ ] CSS is minified
- [ ] JavaScript is bundled efficiently
- [ ] Static assets are cached

### ✅ Backend
- [ ] Database queries are optimized
- [ ] API responses are cached where appropriate
- [ ] Error handling is comprehensive

## 🆘 Troubleshooting

### Common Issues

**1. Environment Variables Not Loading**
- Check variable names match exactly
- Ensure variables are set for correct environment
- Restart deployment after adding variables

**2. Database Connection Issues**
- Verify Supabase URL and key are correct
- Check if database tables exist
- Test connection with health check endpoint

**3. Authentication Issues**
- Verify NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your domain
- Ensure Supabase user table exists

**4. Payment Issues**
- Verify Stripe keys are for correct environment
- Check webhook endpoints are configured
- Test with Stripe test mode first

### Debug Commands

```bash
# Check environment variables
vercel env ls

# View deployment logs
vercel logs

# Test local production build
npm run build
npm start
```

## 📈 Scaling Considerations

### Database
- **Supabase Pro**: Upgrade for higher limits
- **Connection Pooling**: Already handled by Supabase
- **Read Replicas**: Available in Supabase Pro

### Application
- **CDN**: Vercel provides global CDN
- **Caching**: Implement Redis for session storage
- **Load Balancing**: Vercel handles automatically

### Monitoring
- **APM**: Consider New Relic or DataDog
- **Logs**: Centralized logging with services like LogRocket
- **Alerts**: Set up alerts for critical metrics

---

**Need Help?**
- Check application logs in your hosting platform
- Monitor Supabase dashboard for database issues
- Review Stripe dashboard for payment problems
- Contact support for platform-specific issues
