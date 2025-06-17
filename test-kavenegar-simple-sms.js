// Test script for Kavenegar API - Simple SMS
const apiKey = '6B51437142707531344F42773342616D6E6843784A4A2F2B6947306E724A4C584F4B7977396647705158383D';
const phoneNumber = '09935107935';
const verificationCode = '123456';

// Function to send SMS without specifying a sender
async function sendSimpleSMS() {
  console.log(`Sending simple SMS to ${phoneNumber}...`);
  
  try {
    const message = encodeURIComponent(`This is a test message from Mobleman. Your verification code is: ${verificationCode}`);
    // Not specifying a sender - let Kavenegar use the default
    const url = `https://api.kavenegar.com/v1/${apiKey}/sms/send.json?receptor=${phoneNumber}&message=${message}`;
    
    console.log('Request URL:', url);
    const response = await fetch(url);
    const data = await response.json();
    
    console.log('SMS Response:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('Error sending SMS:', error.message);
    return null;
  }
}

// Run the test
sendSimpleSMS(); 