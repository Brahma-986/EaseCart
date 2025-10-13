#!/bin/bash

# EaseCart Docker Stop Script

echo "🛑 Stopping EaseCart Application..."

# Stop and remove containers
docker-compose down

# Remove volumes (optional - uncomment if you want to remove data)
# docker-compose down -v

# Remove images (optional - uncomment if you want to remove images)
# docker-compose down --rmi all

echo "✅ EaseCart has been stopped successfully!"
echo ""
echo "💡 To start again: ./docker-start.sh"
echo "🗑️  To remove all data: docker-compose down -v"
echo "🧹 To remove images: docker-compose down --rmi all"

