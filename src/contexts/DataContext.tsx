import React, { createContext, useContext } from 'react';
import { Resource, Upload, Announcement, Suggestion, AdmissionApplication, AttendanceRecord } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface DataContextType {
  // Resources
  resources: Resource[];
  addResource: (resource: Omit<Resource, 'id'>) => void;
  deleteResource: (id: string) => void;
  
  // Uploads
  uploads: Upload[];
  addUpload: (upload: Omit<Upload, 'id'>) => void;
  markUpload: (id: string, comments: string, grade?: string) => void;
  
  // Announcements
  announcements: Announcement[];
  addAnnouncement: (announcement: Omit<Announcement, 'id'>) => void;
  markAnnouncementRead: (id: string) => void;
  
  // Suggestions
  suggestions: Suggestion[];
  addSuggestion: (suggestion: Omit<Suggestion, 'id'>) => void;
  markSuggestionRead: (id: string) => void;
  
  // Admissions
  admissions: AdmissionApplication[];
  addAdmission: (admission: Omit<AdmissionApplication, 'id'>) => void;
  updateAdmissionStatus: (id: string, status: AdmissionApplication['status']) => void;
  
  // Attendance
  attendanceRecords: AttendanceRecord[];
  addAttendanceRecord: (record: Omit<AttendanceRecord, 'id'>) => void;
  
  // Notification counts
  getUnreadCounts: () => {
    announcements: number;
    suggestions: number;
    uploads: number;
    admissions: number;
  };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [resources, setResources] = useLocalStorage<Resource[]>('resources', []);
  const [uploads, setUploads] = useLocalStorage<Upload[]>('uploads', []);
  const [announcements, setAnnouncements] = useLocalStorage<Announcement[]>('announcements', []);
  const [suggestions, setSuggestions] = useLocalStorage<Suggestion[]>('suggestions', []);
  const [admissions, setAdmissions] = useLocalStorage<AdmissionApplication[]>('admissions', []);
  const [attendanceRecords, setAttendanceRecords] = useLocalStorage<AttendanceRecord[]>('attendance', []);

  const addResource = (resource: Omit<Resource, 'id'>) => {
    const newResource: Resource = {
      ...resource,
      id: Date.now().toString()
    };
    setResources(prev => [...prev, newResource]);
  };

  const deleteResource = (id: string) => {
    setResources(prev => prev.filter(r => r.id !== id));
  };

  const addUpload = (upload: Omit<Upload, 'id'>) => {
    const newUpload: Upload = {
      ...upload,
      id: Date.now().toString()
    };
    setUploads(prev => [...prev, newUpload]);
  };

  const markUpload = (id: string, comments: string, grade?: string) => {
    setUploads(prev => prev.map(u => 
      u.id === id 
        ? { ...u, status: 'marked', comments, grade }
        : u
    ));
  };

  const addAnnouncement = (announcement: Omit<Announcement, 'id'>) => {
    const newAnnouncement: Announcement = {
      ...announcement,
      id: Date.now().toString()
    };
    setAnnouncements(prev => [...prev, newAnnouncement]);
  };

  const markAnnouncementRead = (id: string) => {
    setAnnouncements(prev => prev.map(a => 
      a.id === id ? { ...a, isRead: true } : a
    ));
  };

  const addSuggestion = (suggestion: Omit<Suggestion, 'id'>) => {
    const newSuggestion: Suggestion = {
      ...suggestion,
      id: Date.now().toString()
    };
    setSuggestions(prev => [...prev, newSuggestion]);
  };

  const markSuggestionRead = (id: string) => {
    setSuggestions(prev => prev.map(s => 
      s.id === id ? { ...s, isRead: true } : s
    ));
  };

  const addAdmission = (admission: Omit<AdmissionApplication, 'id'>) => {
    const newAdmission: AdmissionApplication = {
      ...admission,
      id: Date.now().toString()
    };
    setAdmissions(prev => [...prev, newAdmission]);
  };

  const updateAdmissionStatus = (id: string, status: AdmissionApplication['status']) => {
    setAdmissions(prev => prev.map(a => 
      a.id === id ? { ...a, status } : a
    ));
  };

  const addAttendanceRecord = (record: Omit<AttendanceRecord, 'id'>) => {
    const newRecord: AttendanceRecord = {
      ...record,
      id: Date.now().toString()
    };
    setAttendanceRecords(prev => [...prev, newRecord]);
  };

  const getUnreadCounts = () => ({
    announcements: announcements.filter(a => !a.isRead).length,
    suggestions: suggestions.filter(s => !s.isRead).length,
    uploads: uploads.filter(u => u.status === 'pending').length,
    admissions: admissions.filter(a => a.status === 'pending').length
  });

  return (
    <DataContext.Provider value={{
      resources,
      addResource,
      deleteResource,
      uploads,
      addUpload,
      markUpload,
      announcements,
      addAnnouncement,
      markAnnouncementRead,
      suggestions,
      addSuggestion,
      markSuggestionRead,
      admissions,
      addAdmission,
      updateAdmissionStatus,
      attendanceRecords,
      addAttendanceRecord,
      getUnreadCounts
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};