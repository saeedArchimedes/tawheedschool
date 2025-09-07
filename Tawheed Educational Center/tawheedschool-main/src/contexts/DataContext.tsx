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
  clearAllUploads: () => void;
  
  // Announcements
  announcements: Announcement[];
  addAnnouncement: (announcement: Omit<Announcement, 'id'>) => void;
  deleteAnnouncement: (id: string) => void;
  markAnnouncementRead: (id: string) => void;
  
  // Suggestions
  suggestions: Suggestion[];
  addSuggestion: (suggestion: Omit<Suggestion, 'id'>) => void;
  markSuggestionRead: (id: string) => void;
  addSuggestionReply: (id: string, reply: string, repliedBy: string) => void;
  clearAllSuggestions: () => void;
  clearTeacherSuggestions: (teacherName: string) => void;
  
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
    attendance: number;
    resources: number;
    timetable: number;
  };
  getPublicAnnouncements: () => Announcement[];
  getUnreadPublicAnnouncements: () => Announcement[];
  markResourceViewed: (resourceId: string) => void;
  markTimetableViewed: (timetableId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [resources, setResources] = useLocalStorage<Resource[]>('resources', []);
  const [uploads, setUploads] = useLocalStorage<Upload[]>('uploads', []);
  const [announcements, setAnnouncements] = useLocalStorage<Announcement[]>('announcements', []);
  const [suggestions, setSuggestions] = useLocalStorage<Suggestion[]>('suggestions', []);
  const [admissions, setAdmissions] = useLocalStorage<AdmissionApplication[]>('admissions', []);
  const [attendanceRecords, setAttendanceRecords] = useLocalStorage<AttendanceRecord[]>('attendance', []);
  const [viewedResources, setViewedResources] = useLocalStorage<string[]>('viewedResources', []);
  const [viewedTimetables, setViewedTimetables] = useLocalStorage<string[]>('viewedTimetables', []);

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

  const clearAllUploads = () => {
    setUploads([]);
  };

  const addAnnouncement = (announcement: Omit<Announcement, 'id'>) => {
    const newAnnouncement: Announcement = {
      ...announcement,
      id: Date.now().toString()
    };
    setAnnouncements(prev => [...prev, newAnnouncement]);
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
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

  const addSuggestionReply = (id: string, reply: string, repliedBy: string) => {
    setSuggestions(prev => prev.map(s => 
      s.id === id ? { 
        ...s, 
        reply, 
        repliedAt: new Date().toISOString(),
        repliedBy,
        isRead: true 
      } : s
    ));
  };

  const clearAllSuggestions = () => {
    setSuggestions([]);
  };

  const clearTeacherSuggestions = (teacherName: string) => {
    setSuggestions(prev => prev.filter(s => s.name !== teacherName));
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

  const markResourceViewed = (resourceId: string) => {
    if (!viewedResources.includes(resourceId)) {
      setViewedResources(prev => [...prev, resourceId]);
    }
  };

  const markTimetableViewed = (timetableId: string) => {
    if (!viewedTimetables.includes(timetableId)) {
      setViewedTimetables(prev => [...prev, timetableId]);
    }
  };

  const getUnreadCounts = () => ({
    announcements: announcements.filter(a => !a.isRead).length,
    suggestions: suggestions.filter(s => !s.isRead).length,
    uploads: uploads.filter(u => u.status === 'pending').length,
    admissions: admissions.filter(a => a.status === 'pending').length,
    attendance: attendanceRecords.length, // Show total attendance records for admin
    resources: resources.filter(r => r.category === 'resource' && !viewedResources.includes(r.id)).length, // Show unviewed resources for teachers
    timetable: resources.filter(r => r.category === 'timetable' && !viewedTimetables.includes(r.id)).length // Show unviewed timetable resources for teachers
  });

  const getPublicAnnouncements = () => {
    return announcements.filter(a => a.target === 'public' || a.target === 'both');
  };

  const getUnreadPublicAnnouncements = () => {
    return announcements.filter(a => (a.target === 'public' || a.target === 'both') && !a.isRead);
  };

  return (
    <DataContext.Provider value={{
      resources,
      addResource,
      deleteResource,
      uploads,
      addUpload,
      markUpload,
      clearAllUploads,
      announcements,
      addAnnouncement,
      deleteAnnouncement,
      markAnnouncementRead,
      suggestions,
      addSuggestion,
      markSuggestionRead,
      addSuggestionReply,
      clearAllSuggestions,
      clearTeacherSuggestions,
      admissions,
      addAdmission,
      updateAdmissionStatus,
      attendanceRecords,
      addAttendanceRecord,
      getUnreadCounts,
      getPublicAnnouncements,
      getUnreadPublicAnnouncements,
      markResourceViewed,
      markTimetableViewed
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