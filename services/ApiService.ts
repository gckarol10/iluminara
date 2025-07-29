import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  API_CONFIG,
  AuthResponse,
  IssueType,
  Location,
  Report,
  ReportsResponse,
  ReportStatus,
  StatisticsResponse,
  User
} from '../constants/Api';
import { ENV } from '../constants/Environment';

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = ENV.API_BASE_URL;
  }

  async getAuthToken(): Promise<string | null> {
    return await AsyncStorage.getItem('authToken');
  }

  async getUserData(): Promise<User | null> {
    const userData = await AsyncStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = await this.getAuthToken();
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // Authentication methods
  async signup(userData: {
    name: string;
    email: string;
    password: string;
    role?: 'CITIZEN' | 'CITY_HALL';
    location: Location;
  }): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>(API_CONFIG.ENDPOINTS.SIGNUP, {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    // Store auth data
    await AsyncStorage.setItem('authToken', response.token);
    await AsyncStorage.setItem('userData', JSON.stringify(response.user));

    return response;
  }

  async signin(credentials: {
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>(API_CONFIG.ENDPOINTS.SIGNIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    // Store auth data
    await AsyncStorage.setItem('authToken', response.token);
    await AsyncStorage.setItem('userData', JSON.stringify(response.user));

    return response;
  }

  async getProfile(): Promise<User> {
    return this.request<User>(API_CONFIG.ENDPOINTS.PROFILE);
  }

  async updateProfile(userData: {
    name?: string;
    location?: Location;
  }): Promise<User> {
    const response = await this.request<User>(API_CONFIG.ENDPOINTS.UPDATE_PROFILE, {
      method: 'PATCH',
      body: JSON.stringify(userData),
    });

    // Update stored user data
    await AsyncStorage.setItem('userData', JSON.stringify(response));

    return response;
  }

  async updatePassword(passwordData: {
    currentPassword: string;
    newPassword: string;
  }): Promise<{ message: string }> {
    return this.request<{ message: string }>(API_CONFIG.ENDPOINTS.UPDATE_PASSWORD, {
      method: 'PATCH',
      body: JSON.stringify(passwordData),
    });
  }

  async logout(): Promise<void> {
    try {
      await this.request(API_CONFIG.ENDPOINTS.LOGOUT, { method: 'POST' });
    } catch (error) {
      console.log('Logout error:', error);
    } finally {
      // Always clear local storage
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userData');
    }
  }

  // Reports methods
  async createReport(reportData: {
    type: IssueType;
    description: string;
    location: Location;
    photos?: string[];
  }): Promise<Report> {
    // Ensure location object structure is correct
    const cleanedReportData = {
      ...reportData,
      location: {
        address: reportData.location.address,
        city: reportData.location.city,
        state: reportData.location.state,
        ...(reportData.location.coordinates && { coordinates: reportData.location.coordinates })
      }
    };
    
    return this.request<Report>(API_CONFIG.ENDPOINTS.REPORTS, {
      method: 'POST',
      body: JSON.stringify(cleanedReportData),
    });
  }

  async createReportWithPhotos(
    reportData: {
      type: IssueType;
      description: string;
      location: Location;
    },
    photos: {
      uri: string;
      type: string;
      fileName?: string;
    }[]
  ): Promise<Report> {
    const formData = new FormData();
    
    formData.append('type', reportData.type);
    formData.append('description', reportData.description);
    
    // Ensure location is properly structured
    const locationObj = {
      address: reportData.location.address,
      city: reportData.location.city,
      state: reportData.location.state,
      ...(reportData.location.coordinates && { coordinates: reportData.location.coordinates })
    };
    
    formData.append('location[address]', locationObj.address);
    formData.append('location[city]', locationObj.city);
    formData.append('location[state]', locationObj.state);
    if (locationObj.coordinates) {
      formData.append('location[coordinates]', JSON.stringify(locationObj.coordinates));
    }
    
    photos.forEach((photo, index) => {
      formData.append('photos', {
        uri: photo.uri,
        type: photo.type,
        name: photo.fileName || `photo_${index}.jpg`,
      } as any);
    });

    const token = await this.getAuthToken();
    const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.REPORTS}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error creating report with photos');
    }

    return response.json();
  }

  async getReports(filters: {
    city?: string;
    state?: string;
    type?: IssueType;
    status?: ReportStatus;
    page?: number;
    limit?: number;
  } = {}): Promise<ReportsResponse> {
    const queryParams = new URLSearchParams();
    
    // Validate and clean filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (key === 'limit') {
          const limitValue = Math.max(1, Math.min(100, Number(value)));
          queryParams.append(key, limitValue.toString());
        } else if (key === 'page') {
          const pageValue = Math.max(1, Number(value));
          queryParams.append(key, pageValue.toString());
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });

    const endpoint = queryParams.toString() 
      ? `${API_CONFIG.ENDPOINTS.REPORTS}?${queryParams}`
      : API_CONFIG.ENDPOINTS.REPORTS;

    return this.request<ReportsResponse>(endpoint);
  }

  async getMyReports(page: number = 1, limit: number = 10): Promise<ReportsResponse> {
    // Validate parameters
    const validPage = Math.max(1, Number(page));
    const validLimit = Math.max(1, Math.min(100, Number(limit)));
    
    return this.request<ReportsResponse>(
      `${API_CONFIG.ENDPOINTS.MY_REPORTS}?page=${validPage}&limit=${validLimit}`
    );
  }

  async getReportById(reportId: string): Promise<Report> {
    return this.request<Report>(
      API_CONFIG.ENDPOINTS.REPORT_BY_ID.replace(':id', reportId)
    );
  }

  async addComment(reportId: string, text: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(
      API_CONFIG.ENDPOINTS.REPORT_COMMENTS.replace(':id', reportId),
      {
        method: 'POST',
        body: JSON.stringify({ text }),
      }
    );
  }

  async updateReportStatus(reportId: string, status: ReportStatus): Promise<{ message: string }> {
    return this.request<{ message: string }>(
      API_CONFIG.ENDPOINTS.REPORT_STATUS.replace(':id', reportId),
      {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }
    );
  }

  async voteOnReport(reportId: string): Promise<{ message: string; votes: number }> {
    return this.request<{ message: string; votes: number }>(
      API_CONFIG.ENDPOINTS.REPORT_VOTE.replace(':id', reportId),
      {
        method: 'POST',
      }
    );
  }

  async getStatistics(): Promise<StatisticsResponse> {
    return this.request<StatisticsResponse>(API_CONFIG.ENDPOINTS.REPORT_STATISTICS);
  }

  async getTopReported(params: {
    type?: IssueType;
    limit?: number;
  } = {}): Promise<any[]> {
    const queryParams = new URLSearchParams();
    
    if (params.type) queryParams.append('type', params.type);
    if (params.limit) queryParams.append('limit', params.limit.toString());

    const queryString = queryParams.toString();
    const endpoint = queryString ? `${API_CONFIG.ENDPOINTS.TOP_REPORTED}?${queryString}` : API_CONFIG.ENDPOINTS.TOP_REPORTED;
    
    return this.request<any[]>(endpoint);
  }
}

export default new ApiService();
