const { test, request } = require('@playwright/test');

test('Get product IDs', async () => {
  const apiContext = await request.newContext();

  const loginResponse = await apiContext.post(
    "https://rahulshettyacademy.com/api/ecom/auth/login",
    {
      data: {
        userEmail: "testuser1787810623872@test.com",
        userPassword: "Strong@123"
      }
    }
  );
  const { token } = await loginResponse.json();

  const productsResponse = await apiContext.get(
    "https://rahulshettyacademy.com/api/ecom/product/get-all-products",
    { headers: { 'Authorization': token } }
  );
  const productsJson = await productsResponse.json();

  productsJson.data.forEach(p => console.log(p.productName, '->', p._id));

  await apiContext.dispose();
});