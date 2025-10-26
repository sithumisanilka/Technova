# Railway Environment Variables Guide
# Set these in your Railway dashboard under Variables tab

# Method 1: Let Railway auto-detect from MySQL service
# Railway will automatically provide DATABASE_URL when you connect a MySQL service
# The format will be: mysql://user:password@host:port/database
# Spring Boot can parse this automatically

# Method 2: Set explicit environment variables
DATABASE_URL=jdbc:mysql://mysql.railway.internal:3306/railway?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=CukuutGHHsftrjFYLabrdadFEjnaJUdT

# Other important variables
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.railway.app,http://localhost:3000
SPRING_JPA_SHOW_SQL=false

# Mail configuration (if needed)
SPRING_MAIL_USERNAME=m7zipza@gmail.com
SPRING_MAIL_PASSWORD=wtfj cxfk lgau iucc

# IMPORTANT: 
# 1. Make sure your MySQL service is running in Railway
# 2. Check that the DATABASE_URL is correctly formatted
# 3. Verify network connectivity between services in Railway