// services/authService.ts
import axios from '..//../lib/axios';
import CryptoJS from 'crypto-js';

interface UserForLoginDto {
  userId: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  data?: any;
  error?: string;
  statusCode: number;
}

class AuthService {
  
  //private baseUri = this.getBaseUrl();
  private encryptionKey = 'dmsswe'; // Store this securely in env
  
  private axiosInstance = axios.create({
    //baseURL: this.baseUri,
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  /**
   * Encrypts data using AES encryption (matching C# implementation)
   */
  private encryptData(data: string): string {
    try {
      const encrypted = CryptoJS.AES.encrypt(
        data,
        CryptoJS.enc.Utf8.parse(this.encryptionKey),
        {
          iv: CryptoJS.enc.Utf8.parse(''), // Use empty IV or generate one
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        }
      );
      return encrypted.toString();
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Failed to encrypt credentials');
    }
  }

  /**
   * Decrypts response data from API
   */
  private decryptData(encryptedData: string): string {
    try {
      const decrypted = CryptoJS.AES.decrypt(
        encryptedData,
        CryptoJS.enc.Utf8.parse(this.encryptionKey),
        {
          iv: CryptoJS.enc.Utf8.parse(''),
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        }
      );
      return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Failed to decrypt response');
    }
  }

  /**
   * Validates user login credentials against API
   */
  async getLoggedUser(userId: string, password: string): Promise<LoginResponse> {
    try {
      // Validate input
      if (!userId || !password) {
        return {
          success: false,
          error: 'User ID and password are required',
          statusCode: 400,
        };
      }

      // Create user object
      const user: UserForLoginDto = {
        userId: userId.trim(),
        password: password,
      };

      // Serialize to JSON
      const jsonData = JSON.stringify(user);

      // Encrypt the JSON
      const encryptedString = this.encryptData(jsonData);

      // Create payload with encrypted data
      const encryptedPayload = JSON.stringify(encryptedString);

      console.log("encryptedString", encryptedString);
      const response = await axios.get(`/Auth/ValidateUser/admin`);
      
      console.log("url", axios.getUri())
      console.log("token;", response.data);
      // Make API request
      // const response: AxiosResponse = await this.axiosInstance.post(
      //   'Auth/GetLoggedUser',
      //   encryptedPayload
      // );

      // Check response status
      if (response.status === 200) {
        let responseData = response.data;

        // If response is encrypted, decrypt it
        if (typeof responseData === 'string') {
          responseData = this.decryptData(responseData);
        }

        return {
          success: true,
          data: responseData,
          statusCode: response.status,
        };
      }

      return {
        success: false,
        error: 'Authentication failed',
        statusCode: response.status,
      };
    } catch (error: any) {
      console.error('Login error:', error?.message || error);
      console.error('Error code:', error?.code);
      console.error('Error response:', error?.response?.data);

      // Handle specific error types
      if (error.response?.status === 401) {
        return {
          success: false,
          error: 'Invalid username or password',
          statusCode: 401,
        };
      }

      if (error.response?.status === 400) {
        return {
          success: false,
          error: error.response.data?.message || 'Bad request',
          statusCode: 400,
        };
      }
      
      if (error.code === 'ENOTFOUND') {
        return {
          success: false,
          error: 'Server address not found. Check your network connection.',
          statusCode: 503,
        };
      }

      if (error.message.includes('timeout')) {
        return {
          success: false,
          error: 'Request timeout. Server is taking too long to respond.',
          statusCode: 504,
        };
      }

      return {
        success: false,
        error: error.message || 'An unexpected error occurred',
        statusCode: error.response?.status || 500,
      };
    }
  }

  async logout(): Promise<void> {
    try {
      // Clear any stored tokens/session data
      // Example: await AsyncStorage.removeItem('authToken');
      console.log('User logged out');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
}

export default new AuthService();