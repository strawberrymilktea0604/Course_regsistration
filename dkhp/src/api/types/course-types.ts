// Course types definition

export interface Course {
  id: number;
  course_code: string;
  title: string;
  credits: number;
  course_description?: string;
  category_id?: number;
  category_name?: string;
  max_capacity: number;
  // is_non_cumulative: boolean;
  active: boolean;
  created_by?: number;
  created_at?: string;
  updated_at?: string;
  type?: string;
  department?: string;
}

export interface CourseCategory {
  id: number;
  name: string;
  created_at?: string;
}

export interface CourseOffering {
  offering_id: number;
  course_id: number;
  course_code: string;
  title: string;
  description?: string;
  credits: number;
  category_name?: string;
  section_number: string;
  max_enrollment: number;
  current_enrollment: number;
  term_name: string;
  term_id: number;
  available_seats: number;
  building?: string;
  room_number?: string;
  professor_name?: string;
  schedule_details?: string;
  prerequisites?: Array<{
    prerequisite_id: number;
    course_code: string;
    title: string;
    credits: number;
  }>;
  registration_status?: string;
  registration_id?: number;
  registration_date?: string;
}

export interface AcademicTerm {
  id: number;
  term_name: string;
  start_date: string;
  end_date: string;
  registration_start: string;
  registration_end: string;
  is_registration_active?: boolean;
  is_term_current?: boolean;
}

export interface CurriculumCourse {
  id: number;
  code: string;
  title: string;
  credits: number;
  description?: string;
  category_name?: string;
  is_required: boolean;
  prerequisite_courses?: string;
}

export interface Semester {
  id: number;
  name: string;
  sequence: number;
  credits: number;
  courses: CurriculumCourse[];
}

export interface Major {
  id: number;
  name: string;
  code: string;
  program_id: number;
  program_name: string;
  program_code: string;
}

export interface CurriculumFramework {
  totalCredits: number;
  program: {
    id: number;
    name: string;
    description?: string;
  };
  semesters: Array<{
    semester_number: number;
    total_credits: number;
    courses: Course[];
  }>;
}