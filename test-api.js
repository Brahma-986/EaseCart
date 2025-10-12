const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testAPIs() {
  console.log('=== Testing EaseCart APIs ===\n');

  try {
    let customerToken, managerToken, adminToken;

    // Test 1: Login as existing users or register new ones
    console.log('1. Testing Login Customer...');
    try {
      const loginRes = await axios.post(`${API_URL}/auth/login`, {
        email: 'customer@test.com',
        password: 'Test123!'
      });
      console.log('✅ Customer Login Success');
      customerToken = loginRes.data.data.token;
    } catch (error) {
      console.log('Customer not found, registering...');
      const registerRes = await axios.post(`${API_URL}/auth/register`, {
        name: 'Test Customer',
        email: 'customer@test.com',
        password: 'Test123!',
        role: 'customer'
      });
      console.log('✅ Customer Register Success');
      customerToken = registerRes.data.data.token;
    }

    // Test 2: Login/Register Manager
    console.log('\n2. Testing Login Manager...');
    try {
      const loginRes = await axios.post(`${API_URL}/auth/login`, {
        email: 'manager@test.com',
        password: 'Test123!'
      });
      console.log('✅ Manager Login Success');
      managerToken = loginRes.data.data.token;
    } catch (error) {
      console.log('Manager not found, registering...');
      const registerRes = await axios.post(`${API_URL}/auth/register`, {
        name: 'Test Manager',
        email: 'manager@test.com',
        password: 'Test123!',
        role: 'manager'
      });
      console.log('✅ Manager Register Success');
      managerToken = registerRes.data.data.token;
    }

    // Test 3: Login/Register Admin
    console.log('\n3. Testing Login Admin...');
    try {
      const loginRes = await axios.post(`${API_URL}/auth/login`, {
        email: 'admin@test.com',
        password: 'Test123!'
      });
      console.log('✅ Admin Login Success');
      adminToken = loginRes.data.data.token;
    } catch (error) {
      console.log('Admin not found, registering...');
      const registerRes = await axios.post(`${API_URL}/auth/register`, {
        name: 'Test Admin',
        email: 'admin@test.com',
        password: 'Test123!',
        role: 'admin'
      });
      console.log('✅ Admin Register Success');
      adminToken = registerRes.data.data.token;
    }

    // Test 4: Create Product (Manager)
    console.log('\n4. Testing Create Product (Manager)...');
    const productRes = await axios.post(`${API_URL}/products`, {
      name: 'Test Product',
      description: 'A test product for testing purposes',
      price: 99.99,
      category: 'electronics',
      stock: 50,
      image: 'https://via.placeholder.com/300'
    }, {
      headers: { Authorization: `Bearer ${managerToken}` }
    });
    console.log('✅ Product Created:', productRes.data.data.name);
    const productId = productRes.data.data._id;

    // Test 5: Get All Products
    console.log('\n5. Testing Get All Products...');
    const productsRes = await axios.get(`${API_URL}/products`);
    const products = productsRes.data.data?.products || productsRes.data.data || productsRes.data;
    console.log('✅ Products Retrieved:', Array.isArray(products) ? products.length : 'N/A', 'products');

    // Test 6: Get Single Product
    console.log('\n6. Testing Get Single Product...');
    const singleProductRes = await axios.get(`${API_URL}/products/${productId}`);
    console.log('✅ Single Product:', singleProductRes.data.data?.name || singleProductRes.data.name);

    // Test 7: Create Order (Customer)
    console.log('\n7. Testing Create Order (Customer)...');
    const orderRes = await axios.post(`${API_URL}/orders`, {
      items: [{
        product: productId,
        quantity: 2,
        price: 99.99
      }],
      totalAmount: 199.98,
      shippingAddress: {
        street: '123 Test St',
        city: 'Test City',
        state: 'TS',
        zipCode: '12345',
        country: 'Test Country'
      },
      paymentMethod: 'card'
    }, {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    console.log('✅ Order Created:', orderRes.data.data?._id || 'Success');

    // Test 8: Get User Orders
    console.log('\n8. Testing Get User Orders...');
    const ordersRes = await axios.get(`${API_URL}/orders`, {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    const orders = ordersRes.data.data?.orders || ordersRes.data.data || ordersRes.data;
    console.log('✅ Orders Retrieved:', Array.isArray(orders) ? orders.length : 'N/A', 'orders');

    // Test 9: Create Announcement (Manager)
    console.log('\n9. Testing Create Announcement (Manager)...');
    const announcementRes = await axios.post(`${API_URL}/announcements`, {
      title: 'Test Announcement',
      message: 'This is a test announcement',
      targetRole: 'customer'
    }, {
      headers: { Authorization: `Bearer ${managerToken}` }
    });
    console.log('✅ Announcement Created:', announcementRes.data.data?._id || 'Success');

    // Test 10: Get Announcements
    console.log('\n10. Testing Get Announcements...');
    const announcementsRes = await axios.get(`${API_URL}/announcements`, {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    const announcements = announcementsRes.data.data?.announcements || announcementsRes.data.data || announcementsRes.data;
    console.log('✅ Announcements Retrieved:', Array.isArray(announcements) ? announcements.length : 'N/A', 'announcements');

    // Test 11: Create Complaint (Customer)
    console.log('\n11. Testing Create Complaint (Customer)...');
    const complaintRes = await axios.post(`${API_URL}/complaints`, {
      title: 'Test Complaint Title',
      message: 'This is a test complaint message with sufficient length',
      category: 'product'
    }, {
      headers: { Authorization: `Bearer ${customerToken}` }
    });
    console.log('✅ Complaint Created:', complaintRes.data.data?._id || 'Success');

    // Test 12: Get All Complaints (Manager)
    console.log('\n12. Testing Get All Complaints (Manager)...');
    const complaintsRes = await axios.get(`${API_URL}/complaints`, {
      headers: { Authorization: `Bearer ${managerToken}` }
    });
    const complaints = complaintsRes.data.data?.complaints || complaintsRes.data.data || complaintsRes.data;
    console.log('✅ Complaints Retrieved:', Array.isArray(complaints) ? complaints.length : 'N/A', 'complaints');

    // Test 13: Get All Users (Admin)
    console.log('\n13. Testing Get All Users (Admin)...');
    const usersRes = await axios.get(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const users = usersRes.data.data?.users || usersRes.data.data || usersRes.data;
    console.log('✅ Users Retrieved:', Array.isArray(users) ? users.length : 'N/A', 'users');

    console.log('\n=== All Tests Passed! ===');

  } catch (error) {
    console.error('❌ Test Failed:', error.response?.data || error.message);
  }
}

testAPIs();
