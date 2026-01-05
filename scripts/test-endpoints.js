const BASE_URL = 'http://localhost:3000';

async function testEndpoints() {
    console.log('🚀 Starting API Endpoint Tests...\n');

    let token = '';
    let userId = '';
    let firstProductId = '';
    let orderId = '';

    // Helper for requests
    async function request(method, endpoint, body = null, authToken = null) {
        const headers = { 'Content-Type': 'application/json' };
        if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

        const options = {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        };

        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, options);
            let data = null;
            const text = await response.text();
            if (text && text.length > 0) {
                try {
                    data = JSON.parse(text);
                } catch (e) {
                    console.error('Failed to parse JSON:', text);
                }
            }
            return { status: response.status, data };
        } catch (error) {
            console.error(`❌ Request failed: ${method} ${endpoint}`, error.message);
            return null;
        }
    }

    // 1. Auth: Login
    console.log('1️⃣ Testing Authentication...');
    const loginRes = await request('POST', '/auth/login', {
        email: 'admin@example.com',
        password: 'Admin123!',
    });

    if (loginRes.status === 201 || loginRes.status === 200) {
        console.log('✅ Login successful');
        console.log('Keys in response:', Object.keys(loginRes.data));
        token = loginRes.data.accessToken;

        if (!token) {
            console.error('❌ Token is missing in response:', JSON.stringify(loginRes.data, null, 2));
            return;
        }

        console.log('   Token acquired:', token.substring(0, 10) + '...');
    } else {
        console.error('❌ Login failed', loginRes.data);
        return;
    }

    // 2. User: Get Profile
    console.log('\n2️⃣ Testing User Profile...');
    const profileRes = await request('GET', '/users/profile', null, token);
    if (profileRes.status === 200) {
        console.log(`✅ Profile retrieved for: ${profileRes.data.email}`);
        userId = profileRes.data.id;
    } else {
        console.error('❌ Get profile failed', profileRes.data);
        return; // Stop here
    }

    // 3. Categories: Get All
    console.log('\n3️⃣ Testing Categories...');
    const catRes = await request('GET', '/categories', null, token);
    if (catRes.status === 200) {
        const categories = Array.isArray(catRes.data) ? catRes.data : catRes.data.items || [];
        console.log(`✅ Retrieved ${categories.length} categories`);
    } else {
        console.error('❌ Get categories failed', catRes.data);
    }

    // 4. Products: Get All
    console.log('\n4️⃣ Testing Products...');
    const prodRes = await request('GET', '/products', null, token);
    if (prodRes.status === 200) {
        // ProductsService returns { data: [], total, page, limit }
        const products = prodRes.data.data || prodRes.data.items || (Array.isArray(prodRes.data) ? prodRes.data : []);
        console.log(`✅ Retrieved ${products.length} products`);
        if (products.length > 0) {
            firstProductId = products[0].id;
            console.log(`   Using Product ID: ${firstProductId} for cart tests`);
        }
    } else {
        console.error('❌ Get products failed', prodRes.data);
    }

    // 5. Cart: Clear Cart first (to ensure clean state)
    console.log('\n5️⃣ Testing Cart...');
    await request('DELETE', '/cart', null, token);

    // Cart: Add Item
    const addCartRes = await request('POST', '/cart/items', {
        productId: firstProductId,
        quantity: 2
    }, token);

    if (addCartRes.status === 201) {
        console.log('✅ Added item to cart');
    } else {
        console.error('❌ Add to cart failed', addCartRes.data);
    }

    // Cart: Get Cart
    const getCartRes = await request('GET', '/cart', null, token);
    // CartService returns Cart entity which has 'items' array
    if (getCartRes.status === 200 && getCartRes.data.items && getCartRes.data.items.length > 0) {
        console.log(`✅ Cart retrieved with ${getCartRes.data.items.length} items`);
    } else {
        console.error('❌ Get cart failed or empty', getCartRes.data);
    }

    // 6. Order: Create Order
    console.log('\n6️⃣ Testing Order Creation...');
    const createOrderRes = await request('POST', '/orders', {}, token);
    if (createOrderRes.status === 201) {
        orderId = createOrderRes.data.id;
        console.log(`✅ Order created with ID: ${orderId}`);
        // Check totalAmount property logic
        console.log(`   Total Amount: ${createOrderRes.data.totalAmount || 'N/A'}`);
    } else {
        console.error('❌ Create order failed', createOrderRes.data);
        return; // Cannot proceed without order
    }

    // 7. Payment: Process Payment
    console.log('\n7️⃣ Testing Payments...');
    // CreatePaymentDto likely needs orderId. Amount might be optional or inferred.
    const payRes = await request('POST', '/payments', {
        orderId: orderId,
        paymentMethod: 'credit_card',
    }, token);

    if (payRes.status === 201) {
        console.log('✅ Payment processed successfully');
        console.log(`   Payment Status: ${payRes.data.status}`);
    } else {
        console.error('❌ Payment failed', payRes.data);
    }

    // Verify Order Status
    const orderCheckRes = await request('GET', `/orders/${orderId}`, null, token);
    if (orderCheckRes.status === 200) {
        console.log(`✅ Verified Order Status: ${orderCheckRes.data.status}`); // Should be 'paid'
    }

    console.log('\n✨ All tests completed!');
}

testEndpoints();
