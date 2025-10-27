// AuthService.ts
import { TokenStorage } from '@/lib/tokenStorage';
import axios from '../../lib/axios';
import { Auth } from '../../lib/ApiDoc';
import { UserStorage } from '../../lib/userStorage';
import { LoginResponse } from '../Types/user.types';
import { router } from 'expo-router';
import { AxiosError } from 'axios';


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
      // Check response status
      if (response.status === 200) {
        await TokenStorage.setTokens(response.data.token);   
        console.log("login token", await TokenStorage.getAccessToken())
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

   async postNewUser(userCredentials: string) {
        try {
            // Send the request body as JSON
            const response = await axios.post(this.baseUri.ValidateAndCreateNewUser, userCredentials);

            if (response.status === 200) {
                return {
                    success: true,
                    data: response.data,
                    statusCode: response.status,
                };
            } else {
                return {
                    success: false,
                    error: 'Unexpected response from server',
                    statusCode: response.status,
                };
            }
        } catch (error: unknown) {
            const err = error as AxiosError;

            console.error('Create NewUser error:', err.message);
            console.error('Error code:', err.code);
            console.error('Error response:', err.response?.data);

            // Handle HTTP errors
            if (err.response) {
                const status = err.response.status;
                return {
                    success: false,
                    error: (err.response.data as any)?.message || 'Server returned an error',
                    statusCode: status,
                };
            }

            // Handle network errors
            if (err.code === 'ENOTFOUND') {
                return {
                    success: false,
                    error: 'Server address not found. Check your network connection.',
                    statusCode: 503,
                };
            }

            // Handle timeout errors
            if (err.message?.includes('timeout')) {
                return {
                    success: false,
                    error: 'Request timeout. Server is taking too long to respond.',
                    statusCode: 504,
                };
            }

            // Fallback
            return {
                success: false,
                error: err.message || 'An unexpected error occurred',
                statusCode: 500,
            };
        }
    }

   async logout(): Promise<void> {
    try {
      await TokenStorage.clearTokens(await TokenStorage.getAccessToken())
      console.log("logout token", await TokenStorage.getAccessToken())
    } catch (error) {
      console.error('Logout error:', error);
    }
  }


}

export default new AuthService();