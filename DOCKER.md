# Docker Setup for EaseCart

This guide will help you containerize and run the EaseCart application using Docker and Docker Compose.

## 🐳 Prerequisites

- **Docker Desktop** (Windows/Mac) or **Docker Engine** (Linux)
- **Docker Compose** (usually included with Docker Desktop)
- At least **4GB RAM** available for Docker
- **Ports 80, 3000, 5000, 27017** available on your system

## 🚀 Quick Start

### Windows
```bash
# Run the startup script
docker-start.bat
```

### Linux/Mac
```bash
# Make scripts executable
chmod +x docker-start.sh docker-stop.sh

# Run the startup script
./docker-start.sh
```

### Manual Commands
```bash
# Build and start all services
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📁 Docker Architecture

```
EaseCart Docker Setup
├── MongoDB (Port 27017)
│   ├── Database: easeCart
│   ├── Username: admin
│   └── Password: password123
├── Server (Port 5000)
│   ├── Node.js/Express API
│   ├── Health checks
│   └── Auto-restart
├── Client (Port 3000)
│   ├── React application
│   ├── Nginx web server
│   └── Static file serving
└── Nginx (Port 80)
    ├── Reverse proxy
    ├── Load balancing
    └── SSL termination
```

## 🔧 Services Configuration

### MongoDB Service
- **Image**: mongo:7.0
- **Port**: 27017
- **Database**: easeCart
- **Authentication**: admin/password123
- **Volumes**: Persistent data storage
- **Health Check**: MongoDB ping command

### Server Service
- **Base Image**: node:18-alpine
- **Port**: 5000
- **Environment**: Production
- **Health Check**: HTTP endpoint `/api/health`
- **Dependencies**: MongoDB
- **Auto-restart**: Unless stopped

### Client Service
- **Build**: Multi-stage (Node.js + Nginx)
- **Port**: 3000
- **Static Files**: Served by Nginx
- **Dependencies**: Server
- **Environment**: Production build

### Nginx Service
- **Image**: nginx:alpine
- **Ports**: 80, 443
- **Configuration**: Custom nginx.conf
- **Features**: Reverse proxy, rate limiting, caching
- **Dependencies**: Client and Server

## 🌐 Network Configuration

- **Network**: easecart-network (bridge)
- **Internal Communication**: Services communicate via service names
- **External Access**: Through exposed ports
- **Security**: Isolated network with controlled access

## 📊 Health Monitoring

### Health Checks
- **MongoDB**: `mongosh --eval "db.adminCommand('ping')"`
- **Server**: `GET /api/health`
- **Client**: HTTP response check
- **Nginx**: HTTP response check

### Monitoring Commands
```bash
# Check service status
docker-compose ps

# View service logs
docker-compose logs [service-name]

# Check health status
docker-compose exec server curl http://localhost:5000/api/health
```

## 🔒 Security Features

### Container Security
- **Non-root users**: All services run as non-root
- **Read-only filesystems**: Where possible
- **Resource limits**: CPU and memory constraints
- **Network isolation**: Custom Docker network

### Application Security
- **Rate limiting**: API and authentication endpoints
- **CORS configuration**: Proper cross-origin settings
- **Security headers**: XSS, CSRF protection
- **Input validation**: Request sanitization

## 📝 Environment Variables

### Server Environment
```env
NODE_ENV=production
MONGO_URI=mongodb://admin:password123@mongodb:27017/easeCart?authSource=admin
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
PORT=5000
CLIENT_URL=http://localhost
```

### Client Environment
```env
VITE_API_URL=http://localhost:5000/api
```

## 🗄️ Data Persistence

### Volumes
- **mongo_data**: MongoDB database files
- **nginx_ssl**: SSL certificates (if configured)
- **logs**: Application logs

### Backup Commands
```bash
# Backup MongoDB
docker-compose exec mongodb mongodump --out /backup

# Backup volumes
docker run --rm -v easecart_mongo_data:/data -v $(pwd):/backup alpine tar czf /backup/mongo_backup.tar.gz /data
```

## 🚀 Production Deployment

### Environment Setup
1. **Update environment variables** in `docker.env`
2. **Configure SSL certificates** in `nginx/ssl/`
3. **Set up domain names** in nginx configuration
4. **Configure monitoring** and logging

### Scaling
```bash
# Scale server instances
docker-compose up --scale server=3

# Scale with load balancer
docker-compose up --scale server=3 --scale client=2
```

### SSL Configuration
1. Place SSL certificates in `nginx/ssl/`
2. Update nginx configuration for HTTPS
3. Redirect HTTP to HTTPS
4. Configure HSTS headers

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Check what's using the port
netstat -tulpn | grep :5000

# Stop conflicting services
sudo systemctl stop apache2  # or nginx
```

#### MongoDB Connection Issues
```bash
# Check MongoDB logs
docker-compose logs mongodb

# Test connection
docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"
```

#### Build Failures
```bash
# Clean build
docker-compose build --no-cache

# Remove old images
docker system prune -a
```

#### Memory Issues
```bash
# Check Docker resources
docker system df

# Clean up unused resources
docker system prune -a --volumes
```

### Debug Commands
```bash
# Enter container shell
docker-compose exec server sh
docker-compose exec mongodb mongosh

# View real-time logs
docker-compose logs -f --tail=100

# Check container resources
docker stats
```

## 📈 Performance Optimization

### Resource Limits
```yaml
services:
  server:
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
        reservations:
          memory: 256M
          cpus: '0.25'
```

### Caching
- **Nginx**: Static file caching
- **MongoDB**: Query optimization
- **Node.js**: Response caching

### Monitoring
- **Health checks**: Automated monitoring
- **Log aggregation**: Centralized logging
- **Metrics collection**: Performance metrics

## 🔄 CI/CD Integration

### GitHub Actions
```yaml
- name: Build and Deploy
  run: |
    docker-compose -f docker-compose.prod.yml up --build -d
```

### Automated Deployment
- **Build triggers**: On code push
- **Testing**: Automated test suite
- **Deployment**: Zero-downtime deployment
- **Rollback**: Quick rollback capability

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [MongoDB Docker Image](https://hub.docker.com/_/mongo)
- [Node.js Docker Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)

## 🆘 Support

If you encounter issues with the Docker setup:

1. **Check logs**: `docker-compose logs -f`
2. **Verify prerequisites**: Docker and Docker Compose versions
3. **Check resources**: Available memory and disk space
4. **Review configuration**: Environment variables and ports
5. **Clean rebuild**: `docker-compose down && docker-compose up --build`

---

**Happy Containerizing! 🐳✨**

