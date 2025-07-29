# API Integration Guide for React Native App

## Base Configuration

```javascript
const API_BASE_URL = 'http://localhost:3000'; // Change to your production URL
const API_ENDPOINTS = {
  // Authentication
  SIGNUP: '/auth/signup',
  SIGNIN: '/auth/signin',
  PROFILE: '/auth/profile',
  LOGOUT: '/auth/logout',
  
  // Reports
  REPORTS: '/reports',
  MY_REPORTS: '/reports/my-reports',
  REPORT_BY_ID: '/reports/:id',
  REPORT_COMMENTS: '/reports/:id/comments',
  REPORT_STATUS: '/reports/:id/status',
  REPORT_VOTE: '/reports/:id/vote',
  REPORT_STATISTICS: '/reports/statistics',
};
```

## 1. Authentication Endpoints

### 1.1 User Signup
```javascript
// POST /auth/signup
const signupUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: userData.name,           // Required: string
      email: userData.email,         // Required: string (email format)
      password: userData.password,   // Required: string (min 6 chars)
      role: userData.role,          // Optional: "CITIZEN" | "CITY_HALL" (default: CITIZEN)
      location: {
        address: userData.location.address,    // Required: string
        city: userData.location.city,          // Required: string
        state: userData.location.state,        // Required: string
        coordinates: userData.location.coordinates // Optional: [longitude, latitude]
      }
    })
  });
  return response.json();
};

// Example payload:
const signupPayload = {
  name: "João Silva",
  email: "joao@email.com",
  password: "123456",
  role: "CITIZEN", // Optional
  location: {
    address: "Rua das Flores, 123",
    city: "São Paulo",
    state: "SP",
    coordinates: [-23.5505, -46.6333] // Optional
  }
};
```

### 1.2 User Signin
```javascript
// POST /auth/signin
const signinUser = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/auth/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: credentials.email,       // Required: string
      password: credentials.password  // Required: string
    })
  });
  return response.json();
};

// Example payload:
const signinPayload = {
  email: "joao@email.com",
  password: "123456"
};
```

### 1.3 Get User Profile
```javascript
// GET /auth/profile
const getUserProfile = async (token) => {
  const response = await fetch(`${API_BASE_URL}/auth/profile`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
  return response.json();
};
```

### 1.4 Logout
```javascript
// POST /auth/logout
const logoutUser = async (token) => {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
  return response.json();
};
```

## 2. Reports Endpoints

### 2.1 Create Report
```javascript
// POST /reports
const createReport = async (reportData, token) => {
  const response = await fetch(`${API_BASE_URL}/reports`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: reportData.type,              // Required: "POTHOLE" | "STREETLIGHT" | "GARBAGE" | "TRAFFIC_SIGN" | "SIDEWALK" | "OTHER"
      description: reportData.description, // Required: string
      photos: reportData.photos,          // Optional: string[] (URLs or file paths)
      location: {
        address: reportData.location.address,    // Required: string
        city: reportData.location.city,          // Required: string
        state: reportData.location.state,        // Required: string
        coordinates: reportData.location.coordinates // Optional: [longitude, latitude]
      }
    })
  });
  return response.json();
};

// Example payload:
const createReportPayload = {
  type: "POTHOLE",
  description: "Buraco grande na rua, causando problemas no trânsito",
  photos: [], // Optional array of photo URLs
  location: {
    address: "Rua das Flores, 123",
    city: "São Paulo",
    state: "SP",
    coordinates: [-23.5505, -46.6333] // Optional
  }
};
```

### 2.2 Create Report with Photo Upload
```javascript
// POST /reports (with file upload)
const createReportWithPhotos = async (reportData, photos, token) => {
  const formData = new FormData();
  
  // Add report data as JSON string
  formData.append('type', reportData.type);
  formData.append('description', reportData.description);
  formData.append('location', JSON.stringify(reportData.location));
  
  // Add photos
  photos.forEach((photo, index) => {
    formData.append('photos', {
      uri: photo.uri,
      type: photo.type,
      name: photo.fileName || `photo_${index}.jpg`,
    });
  });

  const response = await fetch(`${API_BASE_URL}/reports`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
    body: formData,
  });
  return response.json();
};
```

### 2.3 Get All Reports (with filters)
```javascript
// GET /reports
const getReports = async (filters = {}) => {
  const queryParams = new URLSearchParams();
  
  if (filters.city) queryParams.append('city', filters.city);
  if (filters.state) queryParams.append('state', filters.state);
  if (filters.type) queryParams.append('type', filters.type);
  if (filters.status) queryParams.append('status', filters.status);
  if (filters.page) queryParams.append('page', filters.page.toString());
  if (filters.limit) queryParams.append('limit', filters.limit.toString());

  const response = await fetch(`${API_BASE_URL}/reports?${queryParams}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  return response.json();
};

// Example filters:
const reportFilters = {
  city: "São Paulo",
  state: "SP",
  type: "POTHOLE", // Optional: "POTHOLE" | "STREETLIGHT" | "GARBAGE" | "TRAFFIC_SIGN" | "SIDEWALK" | "OTHER"
  status: "OPEN",  // Optional: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "REJECTED"
  page: 1,         // Optional: number (default: 1)
  limit: 10        // Optional: number (default: 10, max: 100)
};
```

### 2.4 Get User's Reports
```javascript
// GET /reports/my-reports
const getMyReports = async (token, page = 1, limit = 10) => {
  const response = await fetch(`${API_BASE_URL}/reports/my-reports?page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
  return response.json();
};
```

### 2.5 Get Report by ID
```javascript
// GET /reports/:id
const getReportById = async (reportId) => {
  const response = await fetch(`${API_BASE_URL}/reports/${reportId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  return response.json();
};
```

### 2.6 Add Comment to Report (City Hall only)
```javascript
// POST /reports/:id/comments
const addCommentToReport = async (reportId, commentText, token) => {
  const response = await fetch(`${API_BASE_URL}/reports/${reportId}/comments`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: commentText // Required: string
    })
  });
  return response.json();
};

// Example:
const commentPayload = {
  text: "Equipe enviada para verificar o problema"
};
```

### 2.7 Update Report Status (City Hall only)
```javascript
// PATCH /reports/:id/status
const updateReportStatus = async (reportId, status, token) => {
  const response = await fetch(`${API_BASE_URL}/reports/${reportId}/status`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      status: status // Required: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "REJECTED"
    })
  });
  return response.json();
};

// Example:
const statusPayload = {
  status: "IN_PROGRESS"
};
```

### 2.8 Vote on Report
```javascript
// POST /reports/:id/vote
const voteOnReport = async (reportId, token) => {
  const response = await fetch(`${API_BASE_URL}/reports/${reportId}/vote`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
  return response.json();
};
```

### 2.9 Get Reports Statistics
```javascript
// GET /reports/statistics
const getReportsStatistics = async () => {
  const response = await fetch(`${API_BASE_URL}/reports/statistics`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  return response.json();
};
```

## 3. Data Types & Enums

### 3.1 Issue Types
```javascript
const ISSUE_TYPES = {
  POTHOLE: 'POTHOLE',
  STREETLIGHT: 'STREETLIGHT',
  GARBAGE: 'GARBAGE',
  TRAFFIC_SIGN: 'TRAFFIC_SIGN',
  SIDEWALK: 'SIDEWALK',
  OTHER: 'OTHER'
};
```

### 3.2 Report Status
```javascript
const REPORT_STATUS = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  REJECTED: 'REJECTED'
};
```

### 3.3 User Roles
```javascript
const USER_ROLES = {
  CITIZEN: 'CITIZEN',
  CITY_HALL: 'CITY_HALL'
};
```

### 3.4 User Verification Status
```javascript
const USER_VERIFIED = {
  PENDING: 'PENDING',
  VERIFIED: 'VERIFIED',
  REJECTED: 'REJECTED'
};
```

## 4. Response Examples

### 4.1 Authentication Response
```javascript
// Signup/Signin success response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64f8a1b2c3d4e5f6g7h8i9j0",
    "name": "João Silva",
    "email": "joao@email.com",
    "role": "CITIZEN",
    "verified": "PENDING",
    "location": {
      "address": "Rua das Flores, 123",
      "city": "São Paulo",
      "state": "SP",
      "coordinates": [-23.5505, -46.6333]
    },
    "createdAt": "2024-07-29T15:00:00.000Z",
    "updatedAt": "2024-07-29T15:00:00.000Z"
  }
}
```

### 4.2 Report Response
```javascript
// Create report success response:
{
  "_id": "64f8b1c2d3e4f5g6h7i8j9k0",
  "type": "POTHOLE",
  "description": "Buraco grande na rua, causando problemas no trânsito",
  "location": {
    "address": "Rua das Flores, 123",
    "city": "São Paulo",
    "state": "SP",
    "coordinates": [-23.5505, -46.6333]
  },
  "photos": [],
  "status": "OPEN",
  "userId": "64f8a1b2c3d4e5f6g7h8i9j0",
  "votes": 0,
  "views": 0,
  "comments": [],
  "createdAt": "2024-07-29T15:30:00.000Z",
  "updatedAt": "2024-07-29T15:30:00.000Z"
}
```

### 4.3 Reports List Response
```javascript
// Get reports response:
{
  "reports": [
    {
      "_id": "64f8b1c2d3e4f5g6h7i8j9k0",
      "type": "POTHOLE",
      "description": "Buraco grande na rua",
      "location": {
        "address": "Rua das Flores, 123",
        "city": "São Paulo",
        "state": "SP",
        "coordinates": [-23.5505, -46.6333]
      },
      "photos": [],
      "status": "OPEN",
      "userId": "64f8a1b2c3d4e5f6g7h8i9j0",
      "votes": 5,
      "views": 10,
      "comments": [],
      "createdAt": "2024-07-29T15:30:00.000Z",
      "updatedAt": "2024-07-29T15:30:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalReports": 50,
    "limit": 10
  }
}
```

### 4.4 Statistics Response
```javascript
// Get statistics response:
{
  "totalReports": 150,
  "reportsByStatus": {
    "OPEN": 45,
    "IN_PROGRESS": 30,
    "RESOLVED": 70,
    "REJECTED": 5
  },
  "reportsByType": {
    "POTHOLE": 60,
    "STREETLIGHT": 30,
    "GARBAGE": 25,
    "TRAFFIC_SIGN": 20,
    "SIDEWALK": 10,
    "OTHER": 5
  },
  "reportsByCity": {
    "São Paulo": 100,
    "Rio de Janeiro": 30,
    "Belo Horizonte": 20
  }
}
```

## 5. Error Handling

### 5.1 Common Error Responses
```javascript
// 400 Bad Request
{
  "message": "Validation failed",
  "error": "Bad Request",
  "statusCode": 400
}

// 401 Unauthorized
{
  "message": "Unauthorized",
  "statusCode": 401
}

// 403 Forbidden
{
  "message": "Insufficient permissions",
  "error": "Forbidden",
  "statusCode": 403
}

// 404 Not Found
{
  "message": "Report not found",
  "error": "Not Found",
  "statusCode": 404
}

// 500 Internal Server Error
{
  "message": "Internal server error",
  "statusCode": 500
}
```

## 6. Implementation Tips for React Native

### 6.1 Token Storage
```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Store token
const storeToken = async (token) => {
  await AsyncStorage.setItem('authToken', token);
};

// Get token
const getToken = async () => {
  return await AsyncStorage.getItem('authToken');
};

// Remove token
const removeToken = async () => {
  await AsyncStorage.removeItem('authToken');
};
```

### 6.2 API Service Class Example
```javascript
class ApiService {
  constructor() {
    this.baseURL = 'http://localhost:3000';
  }

  async getAuthToken() {
    return await AsyncStorage.getItem('authToken');
  }

  async request(endpoint, options = {}) {
    const token = await this.getAuthToken();
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  // Authentication methods
  async signup(userData) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async signin(credentials) {
    return this.request('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // Reports methods
  async createReport(reportData) {
    return this.request('/reports', {
      method: 'POST',
      body: JSON.stringify(reportData),
    });
  }

  async getReports(filters = {}) {
    const queryParams = new URLSearchParams(filters);
    return this.request(`/reports?${queryParams}`);
  }
}

export default new ApiService();
```

## 7. Testing Data for Araçuaí, MG

### 7.1 City Hall User (For Testing)
```javascript
const cityHallUser = {
  name: "Carlos Mendes",
  email: "carlos.mendes@aracuai.mg.gov.br",
  password: "admin123",
  role: "CITY_HALL",
  location: {
    address: "Rua Coronel Joaquim Ribeiro, 285 - Centro",
    city: "Araçuaí",
    state: "MG",
    coordinates: [-16.8497, -42.0697]
  }
};
```

### 7.2 Citizen User (For Testing)
```javascript
const citizenUser = {
  name: "Breno Cota",
  email: "brenocota4@gmail.com",
  password: "123456",
  role: "CITIZEN", // Optional, default
  location: {
    address: "Rua Coronel Joaquim Ribeiro, 285 - Centro",
    city: "Araçuaí",
    state: "MG",
    coordinates: [-16.8497, -42.0697]
  }
};
```

### 7.3 Sample Report for Araçuaí
```javascript
const sampleReport = {
  type: "POTHOLE",
  description: "Buraco profundo na Rua Coronel Joaquim Ribeiro, próximo ao centro da cidade. O buraco tem aproximadamente 50cm de diâmetro e está causando danos aos veículos que passam pela via. Solicito reparo urgente.",
  location: {
    address: "Rua Coronel Joaquim Ribeiro, 300 - Centro",
    city: "Araçuaí",
    state: "MG",
    coordinates: [-16.8498, -42.0698]
  }
};
```

---

**Note**: Remember to replace `http://localhost:3000` with your actual API base URL when deploying to production.
