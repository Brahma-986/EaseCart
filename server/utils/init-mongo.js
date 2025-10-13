// MongoDB initialization script for Docker
db = db.getSiblingDB('easeCart');

// Create collections
db.createCollection('users');
db.createCollection('products');
db.createCollection('orders');
db.createCollection('announcements');
db.createCollection('complaints');

// Create indexes for better performance
db.users.createIndex({ "email": 1 }, { unique: true });
db.products.createIndex({ "name": "text", "description": "text" });
db.products.createIndex({ "category": 1 });
db.products.createIndex({ "price": 1 });
db.orders.createIndex({ "user": 1 });
db.orders.createIndex({ "status": 1 });
db.orders.createIndex({ "createdAt": -1 });
db.announcements.createIndex({ "isActive": 1 });
db.announcements.createIndex({ "targetRole": 1 });
db.complaints.createIndex({ "user": 1 });
db.complaints.createIndex({ "status": 1 });

print('Database initialized successfully!');

