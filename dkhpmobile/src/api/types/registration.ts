// Registration related interfaces
export interface Registration {
    registration_id: number;
    registration_date: string;
    registration_status: 'enrolled' | 'waitlisted' | 'dropped' | 'completed';
    grade?: string;
    course_offering_id: number;
    course_id: number;
    course_code: string;
    title: string;
    course_title?: string;
    credits: number;
    course_description?: string;
    category_name?: string;
    term_id: number;
    term_name: string;
    academic_year?: string;
    section_number?: string;
    schedule_details: ScheduleDetail[];
    registration_start?: string;
    registration_end?: string;
}

export interface ScheduleDetail {
    day: string;
    start_time: string;
    end_time: string;
    room: string;
    professor: string;
}

export interface BatchRegistrationRequest {
    courseId: number;
    termId: number;
}

export interface BatchRegistrationResult {
    totalRequested: number;
    successfulRegistrations: number;
    failedRegistrations: number;
    details: {
        success: Array<{
            registrationId: number;
            courseId: number;
            termId: number;
            courseName: string;
            courseCode: string;
        }>;
        failed: Array<{
            courseId: number;
            termId: number;
            reason: string;
        }>;
    };
}

export interface BatchDropResult {
    totalRequested: number;
    successfulDrops: number;
    failedDrops: number;
    details: {
        success: Array<{
            registrationId: number;
            courseId: number;
            courseCode: string;
            courseTitle: string;
        }>;
        failed: Array<{
            registrationId: number;
            reason: string;
        }>;
    };
}