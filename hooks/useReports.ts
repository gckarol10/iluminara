import { useCallback, useState } from 'react';
import { IssueType, Location, Report, ReportStatus } from '../constants/Api';
import ApiService from '../services/ApiService';

interface ReportsState {
  reports: Report[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalReports: number;
    limit: number;
  } | null;
}

export const useReports = () => {
  const [reportsState, setReportsState] = useState<ReportsState>({
    reports: [],
    loading: false,
    error: null,
    pagination: null,
  });

  const [myReports, setMyReports] = useState<Report[]>([]);
  const [myReportsLoading, setMyReportsLoading] = useState(false);

  const fetchReports = useCallback(async (filters: {
    city?: string;
    state?: string;
    type?: IssueType;
    status?: ReportStatus;
    page?: number;
    limit?: number;
  } = {}) => {
    try {
      setReportsState(prev => ({ ...prev, loading: true, error: null }));
      
      // Ensure limit is within valid range (1-100)
      const validFilters = {
        ...filters,
        limit: filters.limit ? Math.max(1, Math.min(100, filters.limit)) : 10,
        page: filters.page ? Math.max(1, filters.page) : 1,
      };
      
      const response = await ApiService.getReports(validFilters);
      
      setReportsState({
        reports: response.reports || [],
        loading: false,
        error: null,
        pagination: response.pagination || null,
      });

      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar relatórios';
      setReportsState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  const fetchMyReports = useCallback(async (page: number = 1, limit: number = 10) => {
    try {
      setMyReportsLoading(true);
      
      // Ensure limit is within valid range (1-100)
      const validLimit = Math.max(1, Math.min(100, limit));
      const validPage = Math.max(1, page);
      
      const response = await ApiService.getMyReports(validPage, validLimit);
      
      setMyReports(response.reports || []);
      setMyReportsLoading(false);

      return response;
    } catch (error) {
      setMyReportsLoading(false);
      throw error;
    }
  }, []);

  const createReport = useCallback(async (
    reportData: {
      type: IssueType;
      description: string;
      location: Location;
    },
    photos?: {
      uri: string;
      type: string;
      fileName?: string;
    }[]
  ) => {
    try {
      let newReport: Report;

      if (photos && photos.length > 0) {
        newReport = await ApiService.createReportWithPhotos(reportData, photos);
      } else {
        newReport = await ApiService.createReport(reportData);
      }

      // Add to reports list if it matches current filters
      setReportsState(prev => ({
        ...prev,
        reports: [newReport, ...prev.reports],
      }));

      // Add to my reports
      setMyReports(prev => [newReport, ...prev]);

      return newReport;
    } catch (error) {
      throw error;
    }
  }, []);

  const getReportById = useCallback(async (reportId: string) => {
    try {
      const report = await ApiService.getReportById(reportId);
      
      // Update the report in the list if it exists
      setReportsState(prev => ({
        ...prev,
        reports: prev.reports.map(r => r._id === reportId ? report : r),
      }));

      setMyReports(prev => prev.map(r => r._id === reportId ? report : r));

      return report;
    } catch (error) {
      throw error;
    }
  }, []);

  const voteOnReport = useCallback(async (reportId: string) => {
    try {
      const response = await ApiService.voteOnReport(reportId);
      
      // Update vote count in the reports
      const updateVotes = (reports: Report[]) =>
        reports.map(report =>
          report._id === reportId
            ? { ...report, votes: response.votes }
            : report
        );

      setReportsState(prev => ({
        ...prev,
        reports: updateVotes(prev.reports),
      }));

      setMyReports(prev => updateVotes(prev));

      return response;
    } catch (error) {
      throw error;
    }
  }, []);

  const addComment = useCallback(async (reportId: string, text: string) => {
    try {
      const response = await ApiService.addComment(reportId, text);
      
      // Refresh the specific report to get updated comments
      await getReportById(reportId);

      return response;
    } catch (error) {
      throw error;
    }
  }, [getReportById]);

  const updateReportStatus = useCallback(async (reportId: string, status: ReportStatus) => {
    try {
      const response = await ApiService.updateReportStatus(reportId, status);
      
      // Update status in the reports
      const updateStatus = (reports: Report[]) =>
        reports.map(report =>
          report._id === reportId
            ? { ...report, status }
            : report
        );

      setReportsState(prev => ({
        ...prev,
        reports: updateStatus(prev.reports),
      }));

      setMyReports(prev => updateStatus(prev));

      return response;
    } catch (error) {
      throw error;
    }
  }, []);

  const clearReports = useCallback(() => {
    setReportsState({
      reports: [],
      loading: false,
      error: null,
      pagination: null,
    });
  }, []);

  return {
    // State
    reports: reportsState.reports,
    loading: reportsState.loading,
    error: reportsState.error,
    pagination: reportsState.pagination,
    myReports,
    myReportsLoading,

    // Actions
    fetchReports,
    fetchMyReports,
    createReport,
    getReportById,
    voteOnReport,
    addComment,
    updateReportStatus,
    clearReports,
  };
};
