# Deployment Guide

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```bash
# MongoDB Connection
MONGO_URI=your_mongodb_connection_string_here

# Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Frontend URL (for CORS)
FRONTEND_URL=https://your-frontend-domain.com

# Server Port
PORT=5000

# JWT Secret
JWT_SECRET=your_jwt_secret_here

# Email Configuration (if using nodemailer)
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password_here
```

## Render Deployment

1. **Build Command**: `npm install`
2. **Start Command**: `npm start`
3. **Environment**: Node.js

## Key Changes Made

- ✅ Replaced `pdf-poppler` with `pdf2pic` for cross-platform compatibility
- ✅ Updated CORS configuration to use environment variable
- ✅ Removed platform-specific dependencies

## Troubleshooting

### If you still get "linux is NOT supported" error:

1. Check that `pdf-poppler` is completely removed from package.json
2. Ensure `pdf2pic` is installed
3. Clear npm cache: `npm cache clean --force`
4. Delete node_modules and reinstall: `rm -rf node_modules && npm install`

### PDF Processing Issues:

The new `pdf2pic` library should work on all platforms including Linux. If you encounter issues:

1. Check that the PDF file is valid
2. Ensure sufficient memory allocation on your deployment platform
3. Consider reducing image quality settings in `convertPDFToImages` function

## Testing Locally

```bash
cd backend
npm install
npm start
```

The server should start without platform-specific errors.
