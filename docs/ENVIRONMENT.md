# Environment Configuration Guide

This project uses environment variables to configure the API base URL and other settings.

## Quick Setup

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit the `.env` file** with your API server URL:
   ```bash
   EXPO_PUBLIC_API_BASE_URL=http://localhost:3000
   ```

## Configuration Options

### Local Development
For local development with a server running on your machine:
```bash
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000
```

### Expo Go Development
If using Expo Go on a physical device, use your computer's IP address:
```bash
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.100:3000
```

### Remote Development
For development with a remote server:
```bash
EXPO_PUBLIC_API_BASE_URL=https://api-reports-18lh.onrender.com
```

### Production
For production deployment:
```bash
EXPO_PUBLIC_API_BASE_URL=https://your-production-api.com
```

## Default Fallbacks

If no `.env` file is found, the app will use these defaults:
- **Development**: `http://localhost:3000`
- **Production**: `https://api-reports-18lh.onrender.com`

## Important Notes

- The `.env` file is ignored by git for security
- Use `EXPO_PUBLIC_` prefix for variables that need to be available in the app
- Restart the Expo development server after changing environment variables
- Environment variables are read at build time, not runtime

## Finding Your IP Address

### On macOS/Linux:
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

### On Windows:
```cmd
ipconfig
```

Look for your local network IP (usually starts with 192.168.x.x or 10.x.x.x).
