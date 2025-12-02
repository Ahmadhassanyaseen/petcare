# NextAuth Environment Setup

Add these environment variables to your `.env.local` file:

```env
# NextAuth Configuration
NEXTAUTH_SECRET=ThisisbsluBF48562@ahdiuadgiuu%2nsdgqe
NEXTAUTH_URL=http://localhost:3000
```

**Note:** Your existing `MONGODB_URI` and `JWT_SECRET` are already configured. The `NEXTAUTH_SECRET` uses your existing JWT_SECRET value.

## Production Deployment

When deploying to production:

1. Set `NEXTAUTH_URL` to your production domain (e.g., `https://yourdomain.com`)
2. Consider generating a new secret with: `openssl rand -base64 32`
