import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Teacher } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { DEFAULT_ADMINS, DEFAULT_SMC } from '@/utils/auth';

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
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>('currentUser', null);
  const [teachers, setTeachers] = useLocalStorage<Teacher[]>('teachers', []);

  const login = async (username: string, password: string): Promise<{ success: boolean; message: string; user?: User }> => {
    // Check admin users
    const admin = DEFAULT_ADMINS.find(a => a.username === username);
    if (admin) {
      if (admin.password === password) {
        const user: User = {
          id: admin.username,
          username: admin.username,
          password: admin.password,
          role: admin.role,
          name: admin.username,
          isFirstLogin: false,
          createdAt: new Date().toISOString()
        };
        setCurrentUser(user);
        return { success: true, message: 'Login successful', user };
      } else {
        return { success: false, message: 'Invalid password' };
      }
    }

    // Check SMC user
    if (username === DEFAULT_SMC.username) {
      if (password === DEFAULT_SMC.password) {
        const user: User = {
          id: DEFAULT_SMC.username,
          username: DEFAULT_SMC.username,
          password: DEFAULT_SMC.password,
          role: DEFAULT_SMC.role,
          name: 'SMC',
          isFirstLogin: false,
          createdAt: new Date().toISOString()
        };
        setCurrentUser(user);
        return { success: true, message: 'Login successful', user };
      } else {
        return { success: false, message: 'Invalid password' };
      }
    }

    // Check if it's an admin trying to login with wrong username
    if (DEFAULT_ADMINS.some(a => a.username !== username) && !teachers.find(t => t.username === username)) {
      // If username is not saeed or hassan, show admin error
      if (!['saeed', 'hassan'].includes(username)) {
        return { success: false, message: 'You are not an admin please' };
      }
    }

    // Check teachers
    const teacher = teachers.find(t => t.username === username);
    if (teacher) {
      if (teacher.password === password) {
        setCurrentUser(teacher);
        return { success: true, message: 'Login successful', user: teacher };
      } else {
        return { success: false, message: 'Invalid password' };
      }
    }

    // If username doesn't match any admin and no teacher found
    if (['saeed', 'hassan'].includes(username)) {
      return { success: false, message: 'Invalid password' };
    } else if (username === 'school') {
      return { success: false, message: 'You are not an SMC' };
    } else {
      return { success: false, message: 'Not current teacher of TEC' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addTeacher = (name: string, password: string) => {
    const newTeacher: Teacher = {
      id: Date.now().toString(),
      username: name.toLowerCase(),
      password,
      role: 'teacher',
      name,
      isFirstLogin: true,
      createdAt: new Date().toISOString(),
      addedBy: currentUser?.username || 'admin',
      attendanceHistory: []
    };
    setTeachers(prev => [...prev, newTeacher]);
  };

  const deleteTeacher = (teacherId: string) => {
    setTeachers(prev => prev.filter(t => t.id !== teacherId));
  };

  const updateTeacherPassword = (teacherId: string, newPassword: string) => {
    setTeachers(prev => prev.map(t => 
      t.id === teacherId 
        ? { ...t, password: newPassword, isFirstLogin: false }
        : t
    ));
    
    if (currentUser?.id === teacherId) {
      setCurrentUser(prev => prev ? { ...prev, password: newPassword, isFirstLogin: false } : null);
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