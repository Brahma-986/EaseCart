@echo off
echo 🚀 Starting EaseCart Application with Docker...

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker first.
    pause
    exit /b 1
)

REM Check if Docker Compose is available
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose first.
    pause
    exit /b 1
)

REM Create necessary directories
echo 📁 Creating necessary directories...
if not exist "nginx\ssl" mkdir nginx\ssl
if not exist "logs" mkdir logs

REM Build and start services
echo 🔨 Building and starting services...
docker-compose down --remove-orphans
docker-compose build --no-cache
docker-compose up -d

REM Wait for services to be ready
echo ⏳ Waiting for services to be ready...
timeout /t 10 /nobreak >nul

REM Check service health
echo 🏥 Checking service health...

REM Check MongoDB
docker-compose exec -T mongodb mongosh --eval "db.adminCommand('ping')" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ MongoDB is healthy
) else (
    echo ❌ MongoDB is not responding
)

REM Check Server
curl -f http://localhost:5000/api/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Server is healthy
) else (
    echo ❌ Server is not responding
)

REM Check Client
curl -f http://localhost:3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Client is healthy
) else (
    echo ❌ Client is not responding
)

REM Seed database
echo 🌱 Seeding database...
docker-compose exec -T server node utils/seed.js

echo.
echo 🎉 EaseCart is now running!
echo.
echo 📱 Application URLs:
echo    Frontend: http://localhost:3000
echo    Backend API: http://localhost:5000
echo    Nginx (Production): http://localhost:80
echo.
echo 👥 Demo Accounts:
echo    Admin: admin@easecart.com / admin123
echo    Manager: manager@easecart.com / manager123
echo    Customer: john@example.com / customer123
echo.
echo 📊 To view logs: docker-compose logs -f
echo 🛑 To stop: docker-compose down
echo.
pause

