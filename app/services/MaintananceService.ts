import { AssignedCompanies } from "@/lib/ApiDoc";
import { LoginResponse } from "../Types/user.types";
import { TokenStorage } from "@/lib/tokenStorage";
import axios from "@/lib/axios";
import { UserStorage } from "@/lib/userStorage";
import { AxiosError } from "axios";

class MaintenanceService {
    private baseUri: AssignedCompanies;

    constructor() {
        this.baseUri = new AssignedCompanies();
    }

    async getAllCompanies(): Promise<LoginResponse> {
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
                `${this.baseUri.GetCompanies}`,
            );
            if (response.data != null) {
                await UserStorage.saveAllCompanies(response.data);
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

    async getAllAppUsers(): Promise<LoginResponse> {
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
                `${this.baseUri.LoadApplicationUsers}`,
            );
            if (response.data != null) {
                await UserStorage.saveAllAppUsers(response.data);
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

    // async UpdateRegisteredDevice(dto: RegisteredDevice) {
    //     try {
    //         // Send the request body as JSON
    //         const response = await axios.post(this.baseUri.UpdateRegisteredDevice, dto);

    //         if (response.status === 200) {
    //             return {
    //                 success: true,
    //                 data: response.data,
    //                 statusCode: response.status,
    //             };
    //         } else {
    //             return {
    //                 success: false,
    //                 error: 'Unexpected response from server',
    //                 statusCode: response.status,
    //             };
    //         }
    //     } catch (error: unknown) {
    //         const err = error as AxiosError;

    //         console.error('Update Registered Device error:', err.message);
    //         console.error('Error code:', err.code);
    //         console.error('Error response:', err.response?.data);

    //         // Handle HTTP errors
    //         if (err.response) {
    //             const status = err.response.status;
    //             return {
    //                 success: false,
    //                 error: (err.response.data as any)?.message || 'Server returned an error',
    //                 statusCode: status,
    //             };
    //         }

    //         // Handle network errors
    //         if (err.code === 'ENOTFOUND') {
    //             return {
    //                 success: false,
    //                 error: 'Server address not found. Check your network connection.',
    //                 statusCode: 503,
    //             };
    //         }

    //         // Handle timeout errors
    //         if (err.message?.includes('timeout')) {
    //             return {
    //                 success: false,
    //                 error: 'Request timeout. Server is taking too long to respond.',
    //                 statusCode: 504,
    //             };
    //         }

    //         // Fallback
    //         return {
    //             success: false,
    //             error: err.message || 'An unexpected error occurred',
    //             statusCode: 500,
    //         };
    //     }
    // }
}

export default new MaintenanceService();