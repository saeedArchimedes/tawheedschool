import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Teacher } from '@/types';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  currentUser: User | null;
  teachers: Teacher[];
  login: (username: string, password: string) => Promise<{ success: boolean; message: string; user?: User }>;
  logout: () => void;
  addTeacher: (name: string, password: string) => void;
  deleteTeacher: (teacherId: string) => void;
  updateTeacherPassword: (teacherId: string, newPassword: string) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  // Load current user and teachers from Supabase on mount
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      // Load teachers from database
      const { data: teachersData, error: teachersError } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'teacher');

      if (teachersError) {
        console.error('Error loading teachers:', teachersError);
      } else {
        setTeachers(teachersData || []);
      }

      // Check if user is already logged in (from localStorage as fallback)
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser);
          setCurrentUser(user);
        } catch (e) {
          localStorage.removeItem('currentUser');
        }
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string): Promise<{ success: boolean; message: string; user?: User }> => {
    try {
      // Query user from Supabase database
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single();

      if (error || !userData) {
        // Check if it's an admin trying to login with wrong username
        if (['saeed', 'hassan'].includes(username)) {
          return { success: false, message: 'Invalid password' };
        } else if (username === 'school') {
          return { success: false, message: 'You are not an SMC' };
        } else {
          return { success: false, message: 'Not current teacher of TEC' };
        }
      }

      // Check password
      if (userData.password !== password) {
        return { success: false, message: 'Invalid password' };
      }

      // Convert database user to User type
      const user: User = {
        id: userData.id,
        username: userData.username,
        password: userData.password,
        role: userData.role,
        name: userData.name,
        isFirstLogin: userData.is_first_login,
        createdAt: userData.created_at
      };

      // Add attendance history for teachers
      if (userData.role === 'teacher') {
        (user as Teacher).addedBy = userData.added_by || 'admin';
        (user as Teacher).attendanceHistory = userData.attendance_history || [];
      }

      setCurrentUser(user);
      
      // Save to localStorage as backup
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      return { success: true, message: 'Login successful', user };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'An error occurred during login' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const addTeacher = async (name: string, password: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert({
          username: name.toLowerCase(),
          password,
          role: 'teacher',
          name,
          is_first_login: true,
          added_by: currentUser?.username || 'admin',
          attendance_history: []
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding teacher:', error);
        return;
      }

      // Update local state
      const newTeacher: Teacher = {
        id: data.id,
        username: data.username,
        password: data.password,
        role: 'teacher',
        name: data.name,
        isFirstLogin: data.is_first_login,
        createdAt: data.created_at,
        addedBy: data.added_by || 'admin',
        attendanceHistory: data.attendance_history || []
      };

      setTeachers(prev => [...prev, newTeacher]);
    } catch (error) {
      console.error('Error adding teacher:', error);
    }
  };

  const deleteTeacher = async (teacherId: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', teacherId);

      if (error) {
        console.error('Error deleting teacher:', error);
        return;
      }

      setTeachers(prev => prev.filter(t => t.id !== teacherId));
    } catch (error) {
      console.error('Error deleting teacher:', error);
    }
  };

  const updateTeacherPassword = async (teacherId: string, newPassword: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          password: newPassword, 
          is_first_login: false 
        })
        .eq('id', teacherId);

      if (error) {
        console.error('Error updating teacher password:', error);
        return;
      }

      // Update local state
      setTeachers(prev => prev.map(t => 
        t.id === teacherId 
          ? { ...t, password: newPassword, isFirstLogin: false }
          : t
      ));
      
      if (currentUser?.id === teacherId) {
        const updatedUser = { ...currentUser, password: newPassword, isFirstLogin: false };
        setCurrentUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Error updating teacher password:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      teachers,
      login,
      logout,
      addTeacher,
      deleteTeacher,
      updateTeacherPassword,
      isAuthenticated: !!currentUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};