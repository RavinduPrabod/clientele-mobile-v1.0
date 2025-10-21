// AuthService.ts
import axios from '../../lib/axios';
import { Auth } from '../services/APIService';
import { UserStorage } from '../Utils/userStorage';

interface LoginResponse {
  success: boolean;
  data?: any;
  error?: string;
  statusCode: number;
}

class AuthService { 
  private baseUri: Auth;

  constructor() {
    this.baseUri = new Auth();
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
      
      const userCredentials = userId.trim() + "$" + password;

      console.log("userCredentials", userCredentials);
      console.log("API URL:", this.baseUri.GetLoggedUser);
      
      // Fixed: Send the string directly as the request body
      const response = await axios.post(
        this.baseUri.GetLoggedUser,
        userCredentials,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      console.log("Response status:", response.status);
      console.log("Response status:", response.data);

      // Check response status
      if (response.status === 200) {
        
        // Save branches to AsyncStorage
      await UserStorage.saveUserBranches(response.data);
      
      return {
        success: true,
        data: response.data,
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

    async getTokenString(userCode:string): Promise<LoginResponse> {
    try {
      console.log("userCode",userCode);
      // Fixed: Send the string directly as the request body
      const response = await axios.post(
        this.baseUri.getTokenString,
        userCode,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      console.log("Response status:", response.status);
      console.log("Response status:", response.data);
      // Check response status
      if (response.status === 200) {
        await UserStorage.saveTokenString(response.data);   
      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
      }

      return {
        success: false,
        error: 'Authentication failed',
        statusCode: response.status,
      };
    } catch (error: any) {
      console.error('Error code:', error?.code);
      console.error('Error response:', error?.response?.data);

      // Handle specific error types
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
      // Example: await TokenStorage.clearTokens();
      console.log('User logged out');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
}

export default new AuthService();