const axios = require("axios");

const API_URL = "http://localhost:5001";

// Test the API connection with better error handling
async function testAPI() {
  try {
    console.log("Testing API connection...");
    console.log(`Connecting to: ${API_URL}`);
    const res = await axios.get(API_URL, { timeout: 5000 });
    console.log("API connection successful:", res.data);
    return true;
  } catch (error) {
    console.error("API connection failed:", error.message);
    console.log("\nPossible issues:");
    console.log("1. Is your server running? Start it with 'npm run dev'");
    console.log("2. Check if something else is using port 5001");
    console.log(
      "3. Try accessing the API in your browser: http://localhost:5001"
    );
    return false;
  }
}

// Test registration
async function testRegistration() {
  try {
    console.log("\nTesting user registration...");
    const res = await axios.post(`${API_URL}/api/auth/register`, {
      username: "testuser",
      email: "testuser@example.com",
      password: "Password123!",
    });
    console.log("Registration successful:", res.data);
  } catch (error) {
    console.error(
      "Registration failed:",
      error.response?.data || error.message
    );
  }
}

// Test login
async function testLogin() {
  try {
    console.log("\nTesting user login...");
    const res = await axios.post(`${API_URL}/api/auth/login`, {
      username: "testuser",
      password: "Password123!",
    });
    console.log("Login successful:", res.data);
    return res.data.token;
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    return null;
  }
}

// Run tests
async function runTests() {
  const apiConnected = await testAPI();

  if (apiConnected) {
    await testRegistration();
    await testLogin();
  } else {
    console.log("\nSkipping API tests because connection failed.");
    console.log("\nTROUBLESHOOTING STEPS:");
    console.log(
      "1. Start the server in a separate terminal with: cd backend && npm run dev"
    );
    console.log("2. Check for any errors in the server console");
    console.log("3. Verify MongoDB connection in your .env file");
    console.log("4. Run this test script again after server is running");
  }
}

runTests();
