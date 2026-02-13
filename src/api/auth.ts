import { apiClient } from './index';
import { AuthRequest, AuthResponse } from '../types';

export const authApi = {
  login: async (credentials: AuthRequest): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/api/auth/login', credentials);
  },
};
