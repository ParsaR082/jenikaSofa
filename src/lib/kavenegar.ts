import Kavenegar from 'kavenegar';

// Get API key from environment variables - using a function to ensure it's loaded at runtime
const getApiKey = () => process.env.KAVENEGAR_API_KEY || '';

// Initialize Kavenegar API with a function that gets the key at runtime
const getApi = () => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    console.warn('KAVENEGAR_API_KEY is not set in environment variables');
  }
  
  return Kavenegar.KavenegarApi({
    apikey: apiKey
  });
};

/**
 * Send verification code to a phone number
 * @param phoneNumber The phone number to send verification code to
 * @param verificationCode The verification code to send
 * @returns Promise with the response from Kavenegar
 */
export const sendVerificationCode = (phoneNumber: string, verificationCode: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const apiKey = getApiKey();
    
    // If API key is not set, simulate success in development
    if (!apiKey && process.env.NODE_ENV === 'development') {
      console.log(`[DEV] Would send verification code ${verificationCode} to ${phoneNumber}`);
      return resolve({ result: { message: 'Simulated success in development' } });
    }

    // Instead of using VerifyLookup which requires advanced service,
    // use regular SMS to send the verification code
    const message = `کد تایید شما در موبل من: ${verificationCode}`;
    
    const api = getApi();
    api.Send({
      message: message,
      receptor: phoneNumber
    }, (response: any, status: any) => {
      console.log('Kavenegar response:', response);
      console.log('Kavenegar status:', status);
      
      if (status === 200 && response?.result) {
        resolve(response);
      } else {
        console.error('Error sending SMS:', status, response);
        
        // In development, still resolve to allow testing
        if (process.env.NODE_ENV === 'development') {
          console.log(`[DEV] Simulating success despite error. Code: ${verificationCode}`);
          resolve({ result: { message: 'Simulated success in development despite API error' } });
        } else {
          reject(response || { message: 'Unknown error occurred' });
        }
      }
    });
  });
};

/**
 * Generate a random verification code
 * @param length The length of the verification code
 * @returns A random verification code
 */
export const generateVerificationCode = (length: number = 6): string => {
  return Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1)).toString();
};

/**
 * Send a custom SMS message
 * @param phoneNumber The phone number to send the message to
 * @param message The message to send
 * @returns Promise with the response from Kavenegar
 */
export const sendSMS = (phoneNumber: string, message: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const apiKey = getApiKey();
    
    // If API key is not set, simulate success in development
    if (!apiKey && process.env.NODE_ENV === 'development') {
      console.log(`[DEV] Would send SMS to ${phoneNumber}: ${message}`);
      return resolve({ result: { message: 'Simulated success in development' } });
    }

    const api = getApi();
    api.Send({
      message: message,
      receptor: phoneNumber
    }, (response: any, status: any) => {
      console.log('Kavenegar response:', response);
      console.log('Kavenegar status:', status);
      
      if (status === 200 && response?.result) {
        resolve(response);
      } else {
        console.error('Error sending SMS:', status, response);
        
        // In development, still resolve to allow testing
        if (process.env.NODE_ENV === 'development') {
          console.log(`[DEV] Simulating success despite error`);
          resolve({ result: { message: 'Simulated success in development despite API error' } });
        } else {
          reject(response || { message: 'Unknown error occurred' });
        }
      }
    });
  });
}; 