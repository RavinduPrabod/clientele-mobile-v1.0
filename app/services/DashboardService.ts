// DashboardService.ts
import axios from '../../lib/axios';
import { Dashboard } from '../services/APIService';
import { UserStorage } from '../Utils/userStorage';

interface LoginResponse {
  success: boolean;
  data?: any;
  error?: string;
  statusCode: number;
}

class DashboardService { 
  private baseUri: Dashboard;

  constructor() {
    this.baseUri = new Dashboard();
  }
    async getDashboardData(
    companyId: number,
    processDate: string,
    ): Promise<LoginResponse> {
    try {
        const token = await UserStorage.getTokenString();
        console.log("token", token)
        const response = await axios.get(
        `${this.baseUri.GetStockSummaryByProcessData}/${companyId}/${processDate}`,
        {
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // 👈 attach token here
            },
            timeout: 10000, // optional: add timeout for safety
        }
        );

        console.log("Response status:", response.status);

        if (response.status === 200) {
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

        if (error.response?.status === 400) {
        return {
            success: false,
            error: error.response.data?.message || 'Bad request',
            statusCode: 400,
        };
        }

        if (error.response?.status === 401) {
        return {
            success: false,
            error: 'Unauthorized. Please log in again.',
            statusCode: 401,
        };
        }

        if (error.code === 'ENOTFOUND') {
        return {
            success: false,
            error: 'Server address not found. Check your network connection.',
            statusCode: 503,
        };
        }

        if (error.message?.includes('timeout')) {
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

export default new DashboardService();