# Deployment Guide

## Prerequisites

- Node.js 18+ installed
- Backend API (n8njd) running and accessible
- Domain name (optional)
- SSL certificate (for production)

## Environment Setup

### 1. Create Production Environment File

Create `.env.production` file:

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1
NEXT_PUBLIC_APP_NAME=Automation Inc.
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 2. Update Backend URL

Ensure your backend API is accessible from the production environment.

## Build for Production

### 1. Install Dependencies

```bash
npm install --production=false
```

### 2. Run Type Check

```bash
npm run type-check
```

### 3. Run Linter

```bash
npm run lint
```

### 4. Build Application

```bash
npm run build
```

This will create an optimized production build in the `.next` folder.

### 5. Test Production Build Locally

```bash
npm start
```

Visit `http://localhost:3000` to test the production build.

## Deployment Options

### Option 1: Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel --prod
```

4. Set environment variables in Vercel dashboard

### Option 2: Docker

1. Create `Dockerfile`:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

2. Create `.dockerignore`:

```
node_modules
.next
.git
.env*.local
```

3. Build Docker image:
```bash
docker build -t n8njd-frontend .
```

4. Run container:
```bash
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api/v1 n8njd-frontend
```

### Option 3: Traditional Server (PM2)

1. Install PM2:
```bash
npm install -g pm2
```

2. Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'n8njd-frontend',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

3. Start with PM2:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Option 4: Static Export (if no server-side features needed)

1. Update `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  output: 'export',
  // ... other config
};
```

2. Build:
```bash
npm run build
```

3. Deploy the `out` folder to any static hosting (Netlify, GitHub Pages, S3, etc.)

## Nginx Configuration

If deploying behind Nginx:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Cache static assets
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable";
    }
}
```

## Post-Deployment

### 1. Verify Deployment

- [ ] Check homepage loads
- [ ] Test login functionality
- [ ] Test workflow creation
- [ ] Verify API connectivity
- [ ] Check mobile responsiveness
- [ ] Test all major features

### 2. Set Up Monitoring

- Configure error tracking (Sentry, Rollbar, etc.)
- Set up uptime monitoring (UptimeRobot, Pingdom, etc.)
- Configure analytics (Google Analytics, Plausible, etc.)

### 3. Performance Optimization

- Enable CDN for static assets
- Configure caching headers
- Enable compression (gzip/brotli)
- Optimize images

### 4. Security

- Enable HTTPS only
- Configure security headers
- Set up rate limiting
- Regular security updates

## Troubleshooting

### Build Fails

1. Clear cache:
```bash
rm -rf .next node_modules
npm install
npm run build
```

2. Check Node version:
```bash
node --version  # Should be 18+
```

### API Connection Issues

1. Verify NEXT_PUBLIC_API_URL is correct
2. Check CORS settings on backend
3. Verify SSL certificates
4. Check network connectivity

### Performance Issues

1. Analyze bundle size:
```bash
npm run analyze
```

2. Check Lighthouse score
3. Monitor server resources
4. Review API response times

## Rollback Procedure

### Vercel
```bash
vercel rollback
```

### PM2
```bash
pm2 stop n8njd-frontend
# Deploy previous version
pm2 start ecosystem.config.js
```

### Docker
```bash
docker stop n8njd-frontend
docker run -p 3000:3000 n8njd-frontend:previous-tag
```

## Maintenance

### Regular Updates

1. Update dependencies monthly:
```bash
npm update
npm audit fix
```

2. Review security advisories
3. Test updates in staging first
4. Monitor error rates after updates

### Backup

- Regular database backups (backend)
- Configuration backups
- Environment variable backups

## Support

For deployment issues:
- Check logs: `pm2 logs` or `docker logs`
- Review error tracking dashboard
- Contact support: support@automationinc.com
