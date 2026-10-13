// src/types/index.ts

export interface User {
  id: string;
  name: string;
  email: string;
  role?: 'user' | 'admin';
  created_at: string;
}

export interface Course {
  id: number;
  Title: string;
  created_at: string;
}


export interface UserCourse {
  user_id: string;
  course_id: number;
  status: 'not_started' | 'in_progress' | 'completed';
  progress_percentage: number;
  enrolled_at: string;
  completed_at: string | null;
  course?: Course;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface UpdateProgressPayload {
  progress: number;
}