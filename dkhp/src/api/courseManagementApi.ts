import { AxiosResponse } from 'axios';
import { Course, CourseCategory } from '../pages/QuanLyMonHoc/types';
import { apiClient } from './api-client';

const BASE_URL = 'http://localhost:3000/api/courses'; // Địa chỉ backend đúng

export interface CourseResponse {
  success: boolean;
  data: Course;
  message?: string;
  error?: string;
}

export interface CoursesResponse {
  success: boolean;
  count: number;
  data: Course[];
  message?: string;
  error?: string;
}

export interface CourseCategoriesResponse {
  success: boolean;
  data: CourseCategory[];
  message?: string;
  error?: string;
}

export const courseManagementApi = {
  // Lấy danh sách tất cả khóa học
  getAllCourses: async (): Promise<CoursesResponse> => {
    const response: AxiosResponse<CoursesResponse> = await apiClient.get(BASE_URL);
    return response.data;
  },

  // Lấy thông tin một khóa học theo ID
  getCourseById: async (id: number): Promise<CourseResponse> => {
    const response: AxiosResponse<CourseResponse> = await apiClient.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Tạo khóa học mới
  createCourse: async (courseData: Partial<Course>): Promise<CourseResponse> => {
    const response: AxiosResponse<CourseResponse> = await apiClient.post(BASE_URL, {
      code: courseData.course_code,
      title: courseData.title,
      credits: courseData.credits,
      course_description: courseData.description || '',
      category_id: courseData.category_id || 1,
      max_capacity: courseData.max_capacity || 50,
      is_non_cumulative: courseData.is_non_cumulative || false,
      active: true,
      department: courseData.category_name || 'Công nghệ thông tin',
      type: courseData.type || 'regular'
    });
    console.log('Create course response:', response.data);
    return response.data;
  },

  // Cập nhật thông tin khóa học
  updateCourse: async (id: number, courseData: Partial<Course>): Promise<CourseResponse> => {
    const response: AxiosResponse<CourseResponse> = await apiClient.put(`${BASE_URL}/${id}`, {
      ...courseData,
      department: courseData.category_name || 'Công nghệ thông tin',
      type: courseData.type || 'regular'
    });
    return response.data;
  },

  // Xóa khóa học
  deleteCourse: async (id: number): Promise<CourseResponse> => {
    const response: AxiosResponse<CourseResponse> = await apiClient.delete(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Tìm kiếm khóa học
  searchCourses: async (searchParams: Record<string, any>): Promise<CoursesResponse> => {
    const response: AxiosResponse<CoursesResponse> = await apiClient.get(`${BASE_URL}/search`, {
      params: searchParams
    });
    return response.data;
  },

  // Lấy danh sách danh mục khóa học
  getCategories: async (): Promise<CourseCategoriesResponse> => {
    const response: AxiosResponse<CourseCategoriesResponse> = await apiClient.get(`${BASE_URL}/categories`);
    return response.data;
  },

  // Lấy thông tin đăng ký của một khóa học
  getCourseEnrollment: async (id: number): Promise<CourseResponse> => {
    const response: AxiosResponse<CourseResponse> = await apiClient.get(`${BASE_URL}/${id}/enrollment`);
    return response.data;
  },

  // Lấy danh sách khóa học có thể đăng ký
  getAvailableCourses: async (termId?: number): Promise<CoursesResponse> => {
    const response: AxiosResponse<CoursesResponse> = await apiClient.get(`${BASE_URL}/available`, {
      params: { termId }
    });
    return response.data;
  },

  // Lấy danh sách học kỳ đang hoạt động
  getActiveTerms: async (): Promise<{
    success: boolean;
    count: number;
    data: Array<{
      id: number;
      term_name: string;
      start_date: string;
      end_date: string;
      registration_start: string;
      registration_end: string;
    }>;
  }> => {
    const response = await apiClient.get(`${BASE_URL}/terms`);
    return response.data;
  },

  // Lấy danh sách khóa học có thể đăng ký theo học kỳ
  getAvailableCoursesBySemester: async (semesterId: number): Promise<{
    success: boolean;
    count: number;
    data: {
      term: {
        id: number;
        term_name: string;
        period: string;
        registration_period: string;
        start_date: string;
        end_date: string;
        registration_start: string;
        registration_end: string;
        is_registration_active: boolean;
        is_term_current: boolean;
      };
      courses: Array<Course & {
        offering_id: number;
        section_number: number;
        max_enrollment: number;
        current_enrollment: number;
        available_seats: number;
        building: string;
        room_number: string;
        professor_name: string;
        schedule_details: string;
        prerequisites?: Array<{
          prerequisite_id: number;
          course_code: string;
          title: string;
          credits: number;
        }>;
        registration_status?: string;
        registration_id?: number;
        registration_date?: string;
      }>;
      total_courses: number;
      total_registered_students: number;
    };
  }> => {
    const response = await apiClient.get(`${BASE_URL}/available-by-semester`, {
      params: { semesterId }
    });
    return response.data;
  },

  // Lấy chương trình khung
  getCurriculumFramework: async (programId: number): Promise<{
    success: boolean;
    data: {
      program: {
        id: number;
        name: string;
        description: string;
      };
      total_credits: number;
      semesters: Array<{
        semester_number: number;
        total_credits: number;
        courses: Array<Course>;
      }>;
    };
  }> => {
    const response = await apiClient.get(`${BASE_URL}/curriculum`, {
      params: { program_id: programId }
    });
    return response.data;
  },

  // Lấy danh sách chuyên ngành
  getMajors: async (): Promise<{
    success: boolean;
    data: Array<{
      id: number;
      name: string;
      description: string;
    }>;
  }> => {
    const response = await apiClient.get(`${BASE_URL}/majors`);
    return response.data;
  }
};
