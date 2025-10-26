@echo off
REM Load environment variables for local development on Windows
REM Usage: call load-env-local.bat

echo Loading local development environment variables...

REM Check if .env.local file exists
if not exist "env\.env.local" (
    echo ❌ env\.env.local file not found!
    exit /b 1
)

REM Load environment variables from .env.local
for /f "usebackq tokens=1,2 delims==" %%a in ("env\.env.local") do (
    if not "%%a"=="" (
        if not "%%a:~0,1%"=="#" (
            set "%%a=%%b"
        )
    )
)

echo ✅ Local environment variables loaded from env\.env.local
echo Database URL: %SPRING_DATASOURCE_URL%
echo Server Port: %SERVER_PORT%
echo CORS Origins: %CORS_ALLOWED_ORIGINS%
echo.
echo You can now run: mvnw spring-boot:run