# Frontend Configuration for Railway Backend

## Environment Configuration

The frontend has been configured to use your Railway backend URL:

**Backend URL**: `https://technova-production-8723.up.railway.app/`

## Environment Files Created:

1. **`.env`** - Default environment (uses production backend)
2. **`.env.production`** - Production environment 
3. **`.env.local`** - Local development environment (uses localhost:8081)

## Usage:

### For Production Build:
```bash
npm run build
```
This will use the Railway backend URL.

### For Local Development:
```bash
npm start
```
This will use localhost:8081 for the backend (make sure your local backend is running).

## Backend CORS Configuration:

Make sure to update your Railway backend environment variables to include your frontend domain:

```bash
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.railway.app,http://localhost:3000
```

## API Endpoints:

All API calls will now go to:
`https://technova-production-8723.up.railway.app/api/`

## Testing the Connection:

You can test if the backend is accessible by visiting:
- `https://technova-production-8723.up.railway.app/api/products` (should return products)
- Check browser console for any CORS errors

## Deployment Steps:

1. **Deploy Frontend to Railway/Netlify/Vercel**
2. **Update Backend CORS** with your frontend domain
3. **Test the connection** between frontend and backend