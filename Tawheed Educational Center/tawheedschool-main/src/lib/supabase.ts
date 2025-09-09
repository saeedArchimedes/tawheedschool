import { createClient } from '@supabase/supabase-js'

// Your Supabase project credentials
const supabaseUrl = 'https://nzlnvqtleerzkjovxxzb.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56bG52cXRsZWVyemtqb3Z4eHpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NTIwNDQsImV4cCI6MjA3MzAyODA0NH0.Zn2iVFWMhUx0P3HmvS47TCvTX2Fw_vIDnK3Ukc_cwf4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string
          password: string
          role: 'admin' | 'teacher' | 'smc'
          name: string
          is_first_login: boolean
          created_at: string
          added_by?: string
          attendance_history?: any[]
        }
        Insert: {
          id?: string
          username: string
          password: string
          role: 'admin' | 'teacher' | 'smc'
          name: string
          is_first_login?: boolean
          created_at?: string
          added_by?: string
          attendance_history?: any[]
        }
        Update: {
          id?: string
          username?: string
          password?: string
          role?: 'admin' | 'teacher' | 'smc'
          name?: string
          is_first_login?: boolean
          created_at?: string
          added_by?: string
          attendance_history?: any[]
        }
      }
      announcements: {
        Row: {
          id: string
          title: string
          content: string
          target: 'teachers' | 'public' | 'both'
          author: string
          created_at: string
          is_read: boolean
        }
        Insert: {
          id?: string
          title: string
          content: string
          target: 'teachers' | 'public' | 'both'
          author: string
          created_at?: string
          is_read?: boolean
        }
        Update: {
          id?: string
          title?: string
          content?: string
          target?: 'teachers' | 'public' | 'both'
          author?: string
          created_at?: string
          is_read?: boolean
        }
      }
      resources: {
        Row: {
          id: string
          title: string
          description: string
          file_url: string
          file_type: string
          category: 'resources' | 'timetables'
          uploaded_by: string
          created_at: string
          is_viewed: boolean
        }
        Insert: {
          id?: string
          title: string
          description: string
          file_url: string
          file_type: string
          category: 'resources' | 'timetables'
          uploaded_by: string
          created_at?: string
          is_viewed?: boolean
        }
        Update: {
          id?: string
          title?: string
          description?: string
          file_url?: string
          file_type?: string
          category?: 'resources' | 'timetables'
          uploaded_by?: string
          created_at?: string
          is_viewed?: boolean
        }
      }
      uploads: {
        Row: {
          id: string
          title: string
          description: string
          file_url: string
          file_type: string
          uploaded_by: string
          created_at: string
          status: 'pending' | 'marked'
          comments?: string
          grade?: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          file_url: string
          file_type: string
          uploaded_by: string
          created_at?: string
          status?: 'pending' | 'marked'
          comments?: string
          grade?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          file_url?: string
          file_type?: string
          uploaded_by?: string
          created_at?: string
          status?: 'pending' | 'marked'
          comments?: string
          grade?: string
        }
      }
      suggestions: {
        Row: {
          id: string
          name: string
          email: string
          subject: string
          message: string
          created_at: string
          is_read: boolean
          reply?: string
          replied_at?: string
          replied_by?: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          subject: string
          message: string
          created_at?: string
          is_read?: boolean
          reply?: string
          replied_at?: string
          replied_by?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          subject?: string
          message?: string
          created_at?: string
          is_read?: boolean
          reply?: string
          replied_at?: string
          replied_by?: string
        }
      }
      admissions: {
        Row: {
          id: string
          student_name: string
          parent_name: string
          email: string
          phone: string
          grade: string
          previous_school: string
          created_at: string
          is_read: boolean
        }
        Insert: {
          id?: string
          student_name: string
          parent_name: string
          email: string
          phone: string
          grade: string
          previous_school: string
          created_at?: string
          is_read?: boolean
        }
        Update: {
          id?: string
          student_name?: string
          parent_name?: string
          email?: string
          phone?: string
          grade?: string
          previous_school?: string
          created_at?: string
          is_read?: boolean
        }
      }
      attendance_records: {
        Row: {
          id: string
          teacher_id: string
          teacher_name: string
          date: string
          time: string
          status: 'on-time' | 'late'
          location: string
          created_at: string
        }
        Insert: {
          id?: string
          teacher_id: string
          teacher_name: string
          date: string
          time: string
          status: 'on-time' | 'late'
          location: string
          created_at?: string
        }
        Update: {
          id?: string
          teacher_id?: string
          teacher_name?: string
          date?: string
          time?: string
          status?: 'on-time' | 'late'
          location?: string
          created_at?: string
        }
      }
    }
  }
}
