import apiClient from '../config/api-config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Registration, BatchRegistrationRequest, BatchRegistrationResult, BatchDropResult } from '../types/registration';

/**
 * Service for handling course registration operations
 */
export const registrationService = {
  /**
   * Get all course registrations for the current user
   * @param options - Options for filtering registrations
   * @returns Promise with registrations data
   */
  getMyRegistrations: async (options?: { status?: string; termId?: number }) => {
    try {
      // Build query parameters if options are provided
      let queryParams = '';
      if (options) {
        const params = [];
        if (options.status) {
          params.push(`status=${options.status}`);
        }
        if (options.termId) {
          params.push(`termId=${options.termId}`);
        }
        if (params.length > 0) {
          queryParams = `?${params.join('&')}`;
        }
      }
      
      const response = await apiClient.get(`/registrations/my-registrations${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Get registrations error:', error);
      throw error;
    }
  },
  
  /**
   * Register for a course
   * @param courseId - ID of the course to register for
   * @param termId - ID of the term
   */
  registerCourse: async (courseId: number, termId: number) => {
    try {
      // Get user data from AsyncStorage to extract the student ID
      const userData = await AsyncStorage.getItem('user_data');
      if (!userData) {
        throw new Error('User data not found. Please login again.');
      }
      
      const user = JSON.parse(userData);
      const studentId = user.id;
      
      return await apiClient.post('/registrations', { 
        student_id: studentId, 
        course_id: courseId, 
        term_id: termId 
      });
    } catch (error) {
      console.error('Register course error:', error);
      throw error;
    }
  },
  
  /**
   * Cancel/drop a course registration
   * @param registrationId - ID of the registration to cancel
   */
  dropCourse: async (registrationId: number) => {
    try {
      return await apiClient.delete(`/registrations/${registrationId}`);
    } catch (error) {
      console.error('Drop course error:', error);
      throw error;
    }
  },
  
  /**
   * Get registration by ID
   * @param registrationId - ID of the registration to retrieve
   */
  getRegistrationById: async (registrationId: number) => {
    try {
      const response = await apiClient.get(`/registrations/${registrationId}`);
      return response.data;
    } catch (error) {
      console.error('Get registration error:', error);
      throw error;
    }
  },
  
  /**
   * Get registrations by term for the current user
   * @param termId - ID of the term
   */
  getMyRegistrationsByTerm: async (termId: number) => {
    try {
      return await apiClient.get(`/registrations/my-registrations?termId=${termId}`);
    } catch (error) {
      console.error('Get registrations by term error:', error);
      throw error;
    }
  },
  
  /**
   * Get registration statistics (credits registered, courses registered)
   * @param termId - Optional term ID to filter by
   */
  getRegistrationStats: async (termId?: number) => {
    try {
      const endpoint = termId 
        ? `/registrations/stats?term_id=${termId}` 
        : '/registrations/stats';
      return await apiClient.get(endpoint);
    } catch (error) {
      console.error('Get registration stats error:', error);
      throw error;
    }
  },
  
  /**
   * Save all courses the student has registered for in a batch
   * @param courseRegistrations - Array of course registrations containing course IDs and term IDs
   * @returns A promise that resolves to the registration results
   */
  batchRegisterCourses: async (courseRegistrations: Array<BatchRegistrationRequest>): Promise<BatchRegistrationResult> => {
    try {
      // Get user data from AsyncStorage to extract the student ID
      const userData = await AsyncStorage.getItem('user_data');
      if (!userData) {
        throw new Error('User data not found. Please login again.');
      }
      
      const user = JSON.parse(userData);
      const studentId = user.id;
      
      const response = await apiClient.post('/registrations/batch', {
        student_id: studentId,
        registrations: courseRegistrations
      });
      
      return response.data.data;
    } catch (error) {
      console.error('Batch register courses error:', error);
      throw error;
    }
  },
  
  /**
   * Drop multiple courses at once for the current student
   * @param registrationIds - Array of registration IDs to drop
   * @returns A promise that resolves to the results of the batch drop operation
   */
  batchDropCourses: async (registrationIds: number[]): Promise<BatchDropResult> => {
    try {
      // Get user data from AsyncStorage to extract the student ID
      const userData = await AsyncStorage.getItem('user_data');
      if (!userData) {
        throw new Error('User data not found. Please login again.');
      }
      
      const user = JSON.parse(userData);
      const studentId = user.id;
      
      const response = await apiClient.post('/registrations/batch-drop', {
        student_id: studentId,
        registration_ids: registrationIds
      });
      
      return response.data.data;
    } catch (error) {
      console.error('Batch drop courses error:', error);
      throw error;
    }
  },
  
  /**
   * Get course registrations by status (enrolled, waitlisted, dropped, completed)
   * @param status - The registration status to filter by
   * @returns Promise with registrations data
   */
  getRegistrationsByStatus: async (status: string) => {
    try {
      return await apiClient.get(`/registrations/my-registrations?status=${status}`);
    } catch (error) {
      console.error(`Get registrations by status (${status}) error:`, error);
      throw error;
    }
  }
};