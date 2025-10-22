// DashboardService.ts
import { AxiosError } from 'axios';
import axios from '../../lib/axios';
import { Dashboard } from '../../lib/ApiDoc';
import { UserStorage } from '../../lib/userStorage';
import axiosInstance from '../../lib/axios';
import { TokenStorage } from '@/lib/tokenStorage';
import { LoginResponse } from '../Types/user.types';


class DashboardService { 
  private baseUri: Dashboard;

  constructor() {
    this.baseUri = new Dashboard();
  }

   async getDashboardData(
    companyId: number,
    processDate: string
  ): Promise<LoginResponse> {
    try {
      const token = await TokenStorage.getAccessToken();
      if (!token) {
        return {
          success: false,
          error: 'No authentication token found. Please log in again.',
          statusCode: 401,
        };
      }

      const response = await axios.get(
        `${this.baseUri.GetStockSummaryByProcessData}/${companyId}/${processDate}`,
      );
      if(response.data != null){
        await UserStorage.saveStockSummary(response.data);
      }
      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error) {
      const err = error as AxiosError;

      console.error('❌ Error code:', err.code);
      console.error('❌ Error response:', err.response?.data);

      // Handle HTTP response errors
      if (err.response) {
        const status = err.response.status;

        if (status === 400) {
          return {
            success: false,
            error: (err.response.data as any)?.message || 'Bad request',
            statusCode: 400,
          };
        }

        if (status === 401) {
          return {
            success: false,
            error: 'Unauthorized. Please log in again.',
            statusCode: 401,
          };
        }

        return {
          success: false,
          error: (err.response.data as any)?.message || 'Server responded with an error.',
          statusCode: status,
        };
      }

      // Handle network-level or other unexpected errors
      if (err.code === 'ENOTFOUND') {
        return {
          success: false,
          error: 'Server not found. Please check your internet connection.',
          statusCode: 503,
        };
      }

      if (err.message?.includes('timeout')) {
        return {
          success: false,
          error: 'Request timeout. The server took too long to respond.',
          statusCode: 504,
        };
      }

      return {
        success: false,
        error: err.message || 'Unexpected error occurred.',
        statusCode: 500,
      };
    }
  }
}

export default new DashboardService();