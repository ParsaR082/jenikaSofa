// Test script for Kavenegar API - Account Status
const Kavenegar = require('kavenegar');

// Use API key directly
const apiKey = '6B51437142707531344F42773342616D6E6843784A4A2F2B6947306E724A4C584F4B7977396647705158383D';
console.log('API Key length:', apiKey.length);
console.log('API Key:', apiKey);

// Initialize Kavenegar API
const api = Kavenegar.KavenegarApi({
  apikey: apiKey
});

// Check account info
console.log('Checking account info...');
api.AccountInfo((response, status) => {
  console.log('Status:', status);
  console.log('Response:', JSON.stringify(response, null, 2));
  
  if (status === 200) {
    console.log('Account info retrieved successfully');
  } else {
    console.error('Error retrieving account info');
  }
}); 