import { Transactions } from "@/lib/ApiDoc";
import { LoginResponse, TransactionsSavingDto } from "../Types/user.types";
import axios from '../../lib/axios';
import { AxiosError } from "axios";

class TransactionService {
    private baseUri: Transactions;

    constructor() {
        this.baseUri = new Transactions();
    }

    async getActiveProductList() {
        try {

            // Fixed: Send the string directly as the request body
            const response = await axios.get(
                this.baseUri.GetActiveProductList,
            );
            // Check response status
            if (response.status === 200) {
                return {
                    success: true,
                    data: response.data,
                    statusCode: response.status,
                };
            }
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

    async getProductCategoryByProductCode(productCode: string) {
        try {

            // Fixed: Send the string directly as the request body
            const response = await axios.get(
                this.baseUri.GetProductCategoryByProductCode + "/" + productCode,
            );
            // Check response status
            if (response.status === 200) {
                return {
                    success: true,
                    data: response.data,
                    statusCode: response.status,
                };
            }
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

    async insertTransactionDetails(dto: TransactionsSavingDto) {
        try {
            // Send the request body as JSON
            const response = await axios.post(this.baseUri.InsertTransactionDetails, dto);

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

            console.error('Transaction insert error:', err.message);
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
}

export default new TransactionService;