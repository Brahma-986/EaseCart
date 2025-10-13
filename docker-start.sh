#!/bin/bash

# EaseCart Docker Startup Script

echo "🚀 Starting EaseCart Application with Docker..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p nginx/ssl
mkdir -p logs

# Set proper permissions
chmod +x docker-start.sh

# Build and start services
echo "🔨 Building and starting services..."
docker-compose down --remove-orphans
docker-compose build --no-cache
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service health
echo "🏥 Checking service health..."

# Check MongoDB
if docker-compose exec -T mongodb mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
    echo "✅ MongoDB is healthy"
else
    echo "❌ MongoDB is not responding"
fi

# Check Server
if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
    echo "✅ Server is healthy"
else
    echo "❌ Server is not responding"
fi

# Check Client
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Client is healthy"
else
    echo "❌ Client is not responding"
fi

# Seed database
echo "🌱 Seeding database..."
docker-compose exec -T server node utils/seed.js

echo ""
echo "🎉 EaseCart is now running!"
echo ""
echo "📱 Application URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:5000"
echo "   Nginx (Production): http://localhost:80"
echo ""
echo "👥 Demo Accounts:"
echo "   Admin: admin@easecart.com / admin123"
echo "   Manager: manager@easecart.com / manager123"
echo "   Customer: john@example.com / customer123"
echo ""
echo "📊 To view logs: docker-compose logs -f"
echo "🛑 To stop: docker-compose down"
echo ""

