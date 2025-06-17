// Test script for Kavenegar API using fetch
const apiKey = '6B51437142707531344F42773342616D6E6843784A4A2F2B6947306E724A4C584F4B7977396647705158383D';
const phoneNumber = '09935107935';
const verificationCode = '123456';

// Function to check account info
async function checkAccountInfo() {
  console.log('Checking account info...');
  
  try {
    const response = await fetch(`https://api.kavenegar.com/v1/${apiKey}/account/info.json`);
    const data = await response.json();
    
    console.log('Account Info Response:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('Error checking account info:', error.message);
    return null;
  }
}

// Function to send verification code
async function sendVerificationCode() {
  console.log(`Sending verification code ${verificationCode} to ${phoneNumber}...`);
  
  try {
    const url = `https://api.kavenegar.com/v1/${apiKey}/verify/lookup.json?receptor=${phoneNumber}&token=${verificationCode}&template=registerverify`;
    const response = await fetch(url);
    const data = await response.json();
    
    console.log('Verification Response:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('Error sending verification code:', error.message);
    return null;
  }
}

// Function to send SMS
async function sendSMS() {
  console.log(`Sending SMS to ${phoneNumber}...`);
  
  try {
    const message = encodeURIComponent(`This is a test message from Mobleman. Your verification code is: ${verificationCode}`);
    const url = `https://api.kavenegar.com/v1/${apiKey}/sms/send.json?receptor=${phoneNumber}&message=${message}`;
    const response = await fetch(url);
    const data = await response.json();
    
    console.log('SMS Response:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('Error sending SMS:', error.message);
    return null;
  }
}

// Run all tests
async function runTests() {
  console.log('Starting Kavenegar API tests...');
  
  // Check account info first
  const accountInfo = await checkAccountInfo();
  
  if (accountInfo && accountInfo.return.status === 200) {
    // If account is valid, try sending verification code
    await sendVerificationCode();
    
    // Try sending SMS
    await sendSMS();
  } else {
    console.error('Account check failed, not proceeding with other tests');
  }
  
  console.log('Tests completed');
}

// Run the tests
runTests(); 