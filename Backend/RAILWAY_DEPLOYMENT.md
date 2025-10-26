# Railway Deployment Guide

## Environment Files Created

1. **`env/.env.railway`** - Production environment variables for Railway
2. **`env/.env.local`** - Local development environment variables

## Railway Deployment Steps

### 1. Setup Railway Project

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Create new project (run this in the Backend folder)
railway init

# Link to your existing project (if already created)
railway link [project-id]
```

### 2. Set Environment Variables

You can set environment variables using Railway CLI or Dashboard:

```bash
# Using Railway CLI
railway variables set SPRING_DATASOURCE_URL="mysql://root:CukuutGHHsftrjFYLabrdadFEjnaJUdT@mysql.railway.internal:3306/railway"
railway variables set SPRING_DATASOURCE_USERNAME="root"
railway variables set SPRING_DATASOURCE_PASSWORD="CukuutGHHsftrjFYLabrdadFEjnaJUdT"
railway variables set SPRING_DATASOURCE_DRIVER_CLASS_NAME="com.mysql.cj.jdbc.Driver"
railway variables set SPRING_JPA_HIBERNATE_DDL_AUTO="update"
railway variables set SPRING_JPA_SHOW_SQL="false"
railway variables set CORS_ALLOWED_ORIGINS="https://your-frontend-app.railway.app,http://localhost:3000"
railway variables set SPRING_MAIL_HOST="smtp.gmail.com"
railway variables set SPRING_MAIL_PORT="587"
railway variables set SPRING_MAIL_USERNAME="m7zipza@gmail.com"
railway variables set SPRING_MAIL_PASSWORD="wtfj cxfk lgau iucc"
```

### 3. Deploy

```bash
# Deploy the backend
railway up
```

**Note**: The project now uses `nixpacks.toml` (Railway's preferred configuration) instead of `railway.toml`. Railway will automatically:
1. Detect it's a Java Spring Boot application
2. Use Maven to build the project
3. Run the generated JAR file

If you still encounter issues, Railway can also auto-detect without any configuration files.

### 4. Domain Configuration

After deployment:
1. Get your Railway backend URL (e.g., `https://your-backend.railway.app`)
2. Update the `CORS_ALLOWED_ORIGINS` variable with your frontend URL
3. Update your frontend API configuration to use the Railway backend URL

## Database Configuration

The database URL provided:
```
mysql://root:CukuutGHHsftrjFYLabrdadFEjnaJUdT@mysql.railway.internal:3306/railway
```

This has been configured in the environment files with the following components:
- **Host**: `mysql.railway.internal`
- **Port**: `3306`
- **Database**: `railway`
- **Username**: `root`
- **Password**: `CukuutGHHsftrjFYLabrdadFEjnaJUdT`

## Local Development

To run locally with the new environment configuration:

1. Copy the local environment file:
   ```bash
   cp env/.env.local .env
   ```

2. Source the environment variables (Linux/Mac):
   ```bash
   source .env
   ```

3. Or set them manually in your IDE/terminal

4. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```

## Important Notes

1. **CORS Configuration**: Updated to use environment variables for flexible origin management
2. **Database URL**: Configured for Railway MySQL service
3. **Port Configuration**: Uses Railway's PORT environment variable with fallback to 8081
4. **Mail Configuration**: Kept existing Gmail SMTP settings
5. **Security**: All controllers now use `@CrossOrigin(origins = "*")` for flexibility, but the main CORS configuration in SecurityConfig manages the actual allowed origins

## Frontend Integration

When you deploy your frontend, make sure to:
1. Update the API base URL to point to your Railway backend
2. Update the CORS_ALLOWED_ORIGINS environment variable with your frontend URL
3. Ensure both services can communicate properly

## Troubleshooting

1. **Database Connection Issues**: Verify the MySQL service is running and accessible
2. **CORS Issues**: Check the CORS_ALLOWED_ORIGINS environment variable
3. **Port Issues**: Railway automatically assigns ports, the application will use the PORT environment variable
4. **Build Issues**: Ensure Maven wrapper has proper permissions (`chmod +x mvnw`)