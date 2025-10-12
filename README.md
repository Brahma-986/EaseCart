# EaseCart - MERN Stack E-commerce Application

A comprehensive, production-ready e-commerce platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring role-based access control, real-time updates, and modern UI/UX.

## 🚀 Features

### Core Functionality
- **User Authentication & Authorization** - JWT-based auth with role-based access control
- **Product Management** - Full CRUD operations for products with image uploads
- **Shopping Cart** - Persistent cart with real-time updates
- **Order Management** - Complete order lifecycle management
- **Payment Integration** - Multiple payment methods (Stripe, PayPal, Bank Transfer)
- **User Management** - Admin panel for user management and role assignment

### Role-Based Access Control
- **Customer** - Browse products, manage cart, place orders, view order history
- **Manager** - Product management, order processing, complaint handling, announcements
- **Admin** - Full system access, user management, system configuration, analytics

### Advanced Features
- **Real-time Updates** - WebSocket integration for live notifications
- **Announcements System** - Role-based announcements and notifications
- **Complaints Management** - Customer support ticket system
- **Analytics & Reports** - Data visualization with charts and metrics
- **System Configuration** - Admin panel for global system settings
- **Responsive Design** - Mobile-first design with Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- **React.js** - Modern UI library with hooks
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **Recharts** - Data visualization library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Socket.io** - Real-time communication
- **Express Validator** - Input validation
- **Bcrypt** - Password hashing

### Development & Deployment
- **Docker** - Containerization
- **GitHub Actions** - CI/CD pipeline
- **Postman** - API testing and documentation

## 📁 Project Structure

```
EaseCart/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── slices/         # Redux slices
│   │   ├── context/        # React context
│   │   ├── store/          # Redux store configuration
│   │   └── data/           # Static data
│   ├── public/             # Static assets
│   └── package.json
├── server/                 # Express backend
│   ├── controllers/        # Route controllers
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── middlewares/        # Custom middlewares
│   ├── config/             # Configuration files
│   └── utils/              # Utility functions
├── docker-compose.yml      # Docker configuration
├── .env.example           # Environment variables template
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd EaseCart
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Edit .env with your configuration
   # Required variables:
   # - MONGODB_URI
   # - JWT_SECRET
   # - PORT
   # - CLIENT_URL
   ```

4. **Database Setup**
   ```bash
   # Start MongoDB (if running locally)
   # Or use MongoDB Atlas cloud service
   
   # Seed the database with sample data
   cd server
   node utils/seed.js
   ```

5. **Start the application**
   ```bash
   # Terminal 1 - Start backend server
   cd server
   npm run dev
   
   # Terminal 2 - Start frontend development server
   cd client
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 👥 Demo Accounts

### Admin Account
- **Email**: admin@easecart.com
- **Password**: admin123
- **Access**: Full system administration

### Manager Account
- **Email**: manager@easecart.com
- **Password**: manager123
- **Access**: Product and order management

### Customer Account
- **Email**: john@example.com
- **Password**: customer123
- **Access**: Shopping and order management

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Manager/Admin)
- `PUT /api/products/:id` - Update product (Manager/Admin)
- `DELETE /api/products/:id` - Delete product (Manager/Admin)

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/status` - Update order status (Manager/Admin)

### Users (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get single user
- `PUT /api/users/:id/role` - Update user role
- `PUT /api/users/:id/status` - Update user status
- `DELETE /api/users/:id` - Delete user

## 🐳 Docker Deployment

### Using Docker Compose
```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d

# Stop services
docker-compose down
```

### Individual Docker Commands
```bash
# Build server image
cd server
docker build -t easecart-server .

# Build client image
cd client
docker build -t easecart-client .

# Run with docker-compose
docker-compose up
```

## 🧪 Testing

### API Testing
- Import `EaseCart.postman_collection.json` into Postman
- Test all endpoints with provided sample data
- Use demo accounts for authentication testing

### Frontend Testing
- Manual testing with demo accounts
- Test all user flows (registration, login, shopping, checkout)
- Test responsive design on different screen sizes

## 📊 Features Overview

### Customer Features
- Browse and search products
- Add items to cart
- Secure checkout process
- Order tracking and history
- Profile management
- Feedback submission

### Manager Features
- Product management (CRUD)
- Order processing and status updates
- Complaint handling and responses
- Announcement creation
- Inventory management
- Sales analytics

### Admin Features
- User management and role assignment
- System configuration
- Global announcements
- Comprehensive analytics
- System monitoring
- Database management

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- Rate limiting
- CORS configuration
- Environment variable protection

## 📱 Responsive Design

- Mobile-first approach
- Tailwind CSS for styling
- Responsive grid layouts
- Touch-friendly interfaces
- Cross-browser compatibility

## 🚀 Deployment

### Production Deployment
1. Set up production environment variables
2. Build the application
3. Deploy to cloud platforms (Render, Vercel, Heroku)
4. Configure domain and SSL certificates
5. Set up monitoring and logging

### Environment Variables
```env
# Database
MONGODB_URI=mongodb://localhost:27017/easecart

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Server
PORT=5000
NODE_ENV=production

# Client
CLIENT_URL=http://localhost:5173

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 Acknowledgments

- React.js community for excellent documentation
- MongoDB for the robust database solution
- Tailwind CSS for the utility-first CSS framework
- All open-source contributors who made this project possible

---

**EaseCart** - Making e-commerce easy and accessible for everyone! 🛒✨