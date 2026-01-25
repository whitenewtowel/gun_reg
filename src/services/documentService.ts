/**
 * Document Upload Service
 * Handles uploading and managing documents for Users, Dealers, Firearms, and Licences
 */

import apiClient, { handleApiError } from '@/lib/apiClient';
import { API_ENDPOINTS } from '@/config/api.config';

export interface DocumentUploadResponse {
    success: boolean;
    data: {
        id: string;
        file_path: string;
        signed_url: string;
        verification_status?: string;
        status?: string;
    };
}

export interface DocumentListResponse {
    success: boolean;
    data: DocumentItem[];
}

export interface DocumentItem {
    id: string;
    file_path: string;
    documentType: string;
    verification_status?: string;
    status?: string;
    created_at?: string;
    [key: string]: any;
}

export type DocumentType =
    | 'national_id'
    | 'passport'
    | 'business_license'
    | 'proof_of_ownership'
    | 'application_form'
    | string;

export const documentService = {
    /**
     * Upload a user document (National ID, Passport, etc.)
     */
    async uploadUserDocument(file: File, documentType: DocumentType): Promise<DocumentUploadResponse> {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('documentType', documentType);

            const response = await apiClient.post<DocumentUploadResponse>(
                API_ENDPOINTS.UPLOADS.USER_DOCUMENTS,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    /**
     * Upload a dealer document (Business License, Tax ID, etc.)
     */
    async uploadDealerDocument(file: File, documentType: DocumentType, dealerId: string): Promise<DocumentUploadResponse> {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('documentType', documentType);

            const response = await apiClient.post<DocumentUploadResponse>(
                API_ENDPOINTS.UPLOADS.DEALER_DOCUMENTS,
                formData,
                {
                    params: { dealerId },
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    /**
     * Upload a firearm document
     */
    async uploadFirearmDocument(file: File, documentType: DocumentType, firearmId: string): Promise<DocumentUploadResponse> {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('documentType', documentType);

            const response = await apiClient.post<DocumentUploadResponse>(
                API_ENDPOINTS.UPLOADS.FIREARM_DOCUMENTS(firearmId),
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    /**
     * Upload a licence document
     */
    async uploadLicenceDocument(file: File, documentType: DocumentType, licenceId: string): Promise<DocumentUploadResponse> {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('documentType', documentType);

            const response = await apiClient.post<DocumentUploadResponse>(
                API_ENDPOINTS.UPLOADS.LICENCE_DOCUMENTS(licenceId),
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    /**
     * List my documents
     */
    async getMyDocuments(): Promise<DocumentListResponse> {
        try {
            const response = await apiClient.get<DocumentListResponse>(
                API_ENDPOINTS.UPLOADS.MY_DOCUMENTS
            );
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    /**
     * Securely view document
     */
    async viewDocument(documentType: string, id: string): Promise<{ signed_url: string }> {
        try {
            const response = await apiClient.get<{ signed_url: string }>(
                API_ENDPOINTS.UPLOADS.VIEW_DOCUMENT(documentType, id)
            );
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    /**
     * Replace an existing document
     */
    async replaceDocument(file: File, documentType: string, id: string): Promise<void> {
        try {
            const formData = new FormData();
            formData.append('file', file);

            await apiClient.put(
                API_ENDPOINTS.UPLOADS.REPLACE_DOCUMENT(documentType, id),
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    }
};

export default documentService;
