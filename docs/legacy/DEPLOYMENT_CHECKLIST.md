# 🚀 Deployment Checklist

## Pre-Deployment Testing

### ✅ Functionality Tests
- [ ] Test Hindi responses: "मुझे बुखार है"
- [ ] Test Marathi responses: "मला ताप आहे"
- [ ] Test Tamil responses: "எனக்கு காய்ச்சல்"
- [ ] Test Telugu responses: "నాకు జ్వరం"
- [ ] Test English responses: "I have fever"
- [ ] Test emergency detection: "छाती में दर्द"
- [ ] Test voice transcription
- [ ] Test follow-up questions
- [ ] Test line break formatting

### ✅ Visual Tests
- [ ] No "MEDIUM Priority" labels on Indian language responses
- [ ] No "🌐 Hindi" language tags
- [ ] Line breaks preserved (not single line)
- [ ] Responses are 3-4 lines (not 15-20)
- [ ] Proper spacing between bullet points

### ✅ Error Handling
- [ ] Rate limit error shows friendly message
- [ ] Empty transcription shows "try again" message
- [ ] Network errors handled gracefully
- [ ] Invalid input handled properly

## Environment Variables

### Required Variables
```env
# Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# Database
DATABASE_URL=your_database_url_here

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Optional
NODE_ENV=production
```

### Verify Variables
```bash
# Check if variables are set
echo $GEMINI_API_KEY
echo $DATABASE_URL
```

## Build Process

### 1. Install Dependencies
```bash
npm install
```

### 2. Generate Prisma Client
```bash
npx prisma generate
```

### 3. Run Database Migrations
```bash
npx prisma migrate deploy
```

### 4. Build Application
```bash
npm run build
```

### 5. Test Production Build
```bash
npm start
```

## Deployment Platforms

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# vercel.com → Project → Settings → Environment Variables
```

### Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod

# Set environment variables in Netlify dashboard
```

### Docker
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

```bash
# Build and run
docker build -t ai-doctor .
docker run -p 3000:3000 --env-file .env ai-doctor
```

## Post-Deployment Verification

### ✅ Smoke Tests
- [ ] Homepage loads
- [ ] Authentication works
- [ ] Chat interface loads
- [ ] Can send message in Hindi
- [ ] Response is in Hindi
- [ ] Response is conversational (3-4 lines)
- [ ] No system labels visible
- [ ] Voice recording works
- [ ] Transcription works

### ✅ Performance Tests
- [ ] Page load time < 3 seconds
- [ ] Chat response time < 2 seconds
- [ ] Transcription time < 5 seconds
- [ ] No console errors
- [ ] No memory leaks

### ✅ Browser Compatibility
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Chrome
- [ ] Mobile Safari

## Monitoring

### Set Up Monitoring
1. **Error Tracking:**
   - Sentry, LogRocket, or similar
   - Track transcription errors
   - Track rate limit errors

2. **Analytics:**
   - Google Analytics
   - Track language usage
   - Track feature usage

3. **Performance:**
   - Vercel Analytics
   - Monitor response times
   - Monitor API usage

### Key Metrics to Monitor
- Language detection accuracy
- Response time per language
- Transcription success rate
- Rate limit hit frequency
- User satisfaction (if feedback implemented)

## Rollback Plan

### If Issues Found
1. **Revert to Previous Version:**
   ```bash
   git revert HEAD
   git push
   vercel --prod
   ```

2. **Check Logs:**
   ```bash
   vercel logs
   ```

3. **Fix and Redeploy:**
   ```bash
   # Fix issue
   git commit -am "Fix: issue description"
   git push
   vercel --prod
   ```

## Security Checklist

### ✅ Security Measures
- [ ] API keys not exposed in frontend
- [ ] Environment variables properly set
- [ ] CORS configured correctly
- [ ] Rate limiting implemented
- [ ] Input validation in place
- [ ] SQL injection prevention (Prisma handles this)
- [ ] XSS prevention (React handles this)
- [ ] Authentication working (Clerk)

## Performance Optimization

### ✅ Optimizations Applied
- [ ] Template-based responses (fast)
- [ ] Language detection cached
- [ ] Images optimized
- [ ] Code splitting enabled
- [ ] Lazy loading implemented

### ✅ Future Optimizations
- [ ] CDN for static assets
- [ ] Redis caching for responses
- [ ] Database query optimization
- [ ] API response caching

## Documentation

### ✅ Documentation Complete
- [ ] README.md updated
- [ ] API documentation
- [ ] User guide
- [ ] Developer guide
- [ ] Deployment guide (this file)

## Support Plan

### User Support
1. **Common Issues:**
   - Rate limit errors → Wait and retry
   - Empty transcription → Speak clearly
   - Wrong language → Type in native script

2. **Contact:**
   - Email support
   - In-app feedback
   - GitHub issues

### Developer Support
1. **Code Documentation:**
   - Inline comments
   - Function documentation
   - Architecture diagrams

2. **Troubleshooting:**
   - Check console logs
   - Check server logs
   - Check database logs

## Final Checklist

### Before Going Live
- [ ] All tests passing
- [ ] Environment variables set
- [ ] Database migrated
- [ ] Build successful
- [ ] Smoke tests passed
- [ ] Performance acceptable
- [ ] Security verified
- [ ] Monitoring set up
- [ ] Rollback plan ready
- [ ] Documentation complete
- [ ] Team notified
- [ ] Backup created

### After Going Live
- [ ] Monitor for 24 hours
- [ ] Check error rates
- [ ] Check performance metrics
- [ ] Gather user feedback
- [ ] Fix critical issues immediately
- [ ] Plan next iteration

---

## 🎉 Ready to Deploy!

Once all checkboxes are checked, you're ready to deploy to production.

**Recommended Platform:** Vercel (easiest for Next.js)

**Deployment Command:**
```bash
vercel --prod
```

**Post-Deployment:**
- Monitor logs for first 24 hours
- Be ready to rollback if needed
- Gather user feedback
- Plan improvements

---

**Good luck with your deployment!** 🚀
