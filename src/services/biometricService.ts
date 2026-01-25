/**
 * Biometric KYC Service
 * Handles Smile ID biometric verification
 */

import apiClient, { handleApiError } from '@/lib/apiClient';
import { API_ENDPOINTS } from '@/config/api.config';

export interface BiometricInitiationData {
    userId: string;
    ghanaCardNumber: string;
    selfie: File;
}

export interface BiometricCompletionData {
    ghanaCardNumber: string;
    selfie: File;
}

export interface BiometricResponse {
    success: boolean;
    message: string;
    data: {
        userId?: string;
        jobId: string;
        status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'VERIFIED';
        verificationData?: {
            resultCode: string;
            resultText: string;
        };
    };
}

export const biometricService = {
    /**
     * Initiate biometric KYC verification (Ghana Card)
     * No auth required (uses userId)
     */
    async initiateBiometric(data: BiometricInitiationData): Promise<BiometricResponse> {
        try {
            const formData = new FormData();
            formData.append('userId', data.userId);
            formData.append('ghanaCardNumber', data.ghanaCardNumber);
            formData.append('selfie', data.selfie);

            const response = await apiClient.post<BiometricResponse>(
                API_ENDPOINTS.BIOMETRIC_KYC.INITIATE,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    /**
     * Complete KYC for logged-in users
     */
    async completeBiometric(data: BiometricCompletionData): Promise<BiometricResponse> {
        try {
            const formData = new FormData();
            formData.append('ghanaCardNumber', data.ghanaCardNumber);
            formData.append('selfie', data.selfie);

            const response = await apiClient.post<BiometricResponse>(
                API_ENDPOINTS.BIOMETRIC_KYC.COMPLETE,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    /**
     * Get KYC verification status
     */
    async getStatus(userId: string): Promise<BiometricResponse> {
        try {
            const response = await apiClient.get<BiometricResponse>(
                API_ENDPOINTS.BIOMETRIC_KYC.STATUS(userId)
            );
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },
};

export default biometricService;
