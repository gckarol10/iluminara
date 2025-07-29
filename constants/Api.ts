// API Configuration and Constants
export const API_CONFIG = {
  ENDPOINTS: {
    // Authentication
    SIGNUP: '/auth/signup',
    SIGNIN: '/auth/signin',
    PROFILE: '/auth/profile',
    UPDATE_PROFILE: '/auth/profile',
    UPDATE_PASSWORD: '/auth/change-password',
    LOGOUT: '/auth/logout',
    
    // Reports
    REPORTS: '/reports',
    MY_REPORTS: '/reports/my-reports',
    REPORT_BY_ID: '/reports/:id',
    REPORT_COMMENTS: '/reports/:id/comments',
    REPORT_STATUS: '/reports/:id/status',
    REPORT_VOTE: '/reports/:id/vote',
    REPORT_STATISTICS: '/reports/statistics',
    TOP_REPORTED: '/reports/top-reported',
  }
};

export const ISSUE_TYPES = {
  POTHOLE: 'POTHOLE',
  STREETLIGHT: 'STREETLIGHT',
  GARBAGE: 'GARBAGE',
  TRAFFIC_SIGN: 'TRAFFIC_SIGN',
  SIDEWALK: 'SIDEWALK',
  OTHER: 'OTHER'
} as const;

export const REPORT_STATUS = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  REJECTED: 'REJECTED'
} as const;

export const USER_ROLES = {
  CITIZEN: 'CITIZEN',
  CITY_HALL: 'CITY_HALL'
} as const;

export const USER_VERIFIED = {
  PENDING: 'PENDING',
  VERIFIED: 'VERIFIED',
  REJECTED: 'REJECTED'
} as const;

export const ISSUE_TYPE_LABELS = {
  [ISSUE_TYPES.POTHOLE]: 'Buraco',
  [ISSUE_TYPES.STREETLIGHT]: 'Iluminação Pública',
  [ISSUE_TYPES.GARBAGE]: 'Lixo',
  [ISSUE_TYPES.TRAFFIC_SIGN]: 'Sinalização',
  [ISSUE_TYPES.SIDEWALK]: 'Calçada',
  [ISSUE_TYPES.OTHER]: 'Outro'
};

export const STATUS_LABELS = {
  [REPORT_STATUS.OPEN]: 'Aberto',
  [REPORT_STATUS.IN_PROGRESS]: 'Em Andamento',
  [REPORT_STATUS.RESOLVED]: 'Resolvido',
  [REPORT_STATUS.REJECTED]: 'Rejeitado'
};

export const STATUS_COLORS = {
  [REPORT_STATUS.OPEN]: '#f39c12',
  [REPORT_STATUS.IN_PROGRESS]: '#3498db',
  [REPORT_STATUS.RESOLVED]: '#27ae60',
  [REPORT_STATUS.REJECTED]: '#e74c3c'
};

// Type definitions
export type IssueType = keyof typeof ISSUE_TYPES;
export type ReportStatus = keyof typeof REPORT_STATUS;
export type UserRole = keyof typeof USER_ROLES;
export type UserVerified = keyof typeof USER_VERIFIED;

export interface Location {
  address: string;
  city: string;
  state: string;
  coordinates?: [number, number]; // [longitude, latitude]
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  verified: UserVerified;
  location: Location;
  createdAt: string;
  updatedAt: string;
}

export interface Report {
  _id: string;
  type: IssueType;
  description: string;
  location: Location;
  photos: string[];
  status: ReportStatus;
  userId: string;
  votes: number;
  views: number;
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  text: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ReportsResponse {
  reports: Report[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalReports: number;
    limit: number;
  };
}

export interface StatisticsResponse {
  totalReports: number;
  reportsByStatus: Record<ReportStatus, number>;
  reportsByType: Record<IssueType, number>;
  reportsByCity: Record<string, number>;
}

export interface TopReportedItem {
  type: IssueType;
  city: string;
  state: string;
  count: number;
  latestReport: {
    _id: string;
    createdAt: string;
    description: string;
    photos: string[];
    status: ReportStatus;
  };
  reportIds: string[];
}

export type TopReportedResponse = TopReportedItem[];
