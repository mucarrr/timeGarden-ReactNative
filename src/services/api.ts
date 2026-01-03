import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language, GardenState } from '../types';

// API Base URL - Automatically detects platform
// For physical device testing, replace with your computer's IP (e.g., 192.168.1.x)
const DEV_PORT = 3015;

const getBaseUrl = () => {
  if (!__DEV__) {
    return 'https://your-production-url.com';
  }
  // Development URLs
  if (Platform.OS === 'android') {
    return `http://10.0.2.2:${DEV_PORT}`; // Android emulator
  }
  return `http://localhost:${DEV_PORT}`; // iOS simulator
};

const API_BASE_URL = getBaseUrl();

// Storage keys
const TOKEN_KEY = '@time_garden_token';
const USER_KEY = '@time_garden_user';

// Types
export interface User {
  id: string;
  nickname: string;
  age?: number;
  language: Language;
  gardenState: GardenState;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  suggestions?: string[]; // Nickname önerileri (nickname alındığında)
  data?: {
    user: User;
    token: string;
  };
}

export interface ApiError {
  success: false;
  message: string;
  suggestions?: string[]; // Nickname önerileri
}

// Custom error class with suggestions
export class ApiErrorWithSuggestions extends Error {
  suggestions?: string[];
  
  constructor(message: string, suggestions?: string[]) {
    super(message);
    this.suggestions = suggestions;
  }
}

// Helper function for API calls
const apiCall = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    // Suggestions varsa custom error fırlat
    const error = new ApiErrorWithSuggestions(
      data.message || 'Bir hata oluştu',
      data.suggestions
    );
    throw error;
  }

  return data;
};

// Auth API
export const authApi = {
  // Register new user
  register: async (
    nickname: string,
    password: string,
    age?: string,
    language: Language = 'tr',
    deviceToken?: string
  ): Promise<AuthResponse> => {
    const response = await apiCall<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        nickname,
        password,
        age: age ? parseInt(age) : undefined,
        language,
        deviceToken,
      }),
    });

    // Save token and user data
    if (response.success && response.data) {
      await AsyncStorage.setItem(TOKEN_KEY, response.data.token);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
    }

    return response;
  },

  // Login user
  login: async (
    nickname: string,
    password: string,
    deviceToken?: string
  ): Promise<AuthResponse> => {
    const response = await apiCall<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        nickname,
        password,
        deviceToken,
      }),
    });

    // Save token and user data
    if (response.success && response.data) {
      await AsyncStorage.setItem(TOKEN_KEY, response.data.token);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
    }

    return response;
  },

  // Get current user
  getMe: async (): Promise<{ success: boolean; data?: { user: User } }> => {
    return apiCall('/api/auth/me');
  },

  // Logout
  logout: async (): Promise<void> => {
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
  },

  // Check if user is logged in
  isLoggedIn: async (): Promise<boolean> => {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    return !!token;
  },

  // Get stored user data
  getStoredUser: async (): Promise<User | null> => {
    const userData = await AsyncStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  },

  // Get stored token
  getToken: async (): Promise<string | null> => {
    return AsyncStorage.getItem(TOKEN_KEY);
  },
};

// Export default api object
export default {
  auth: authApi,
};

