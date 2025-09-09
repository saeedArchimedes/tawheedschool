import React, { createContext, useContext, useState, useEffect } from 'react';
import { Resource, Upload, Announcement, Suggestion, AdmissionApplication, AttendanceRecord } from '@/types';
import { supabase } from '@/lib/supabase';

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
  
  // Loading states
  loading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [admissions, setAdmissions] = useState<AdmissionApplication[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [viewedResources, setViewedResources] = useState<string[]>([]);
  const [viewedTimetables, setViewedTimetables] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Load all data from Supabase on mount
  useEffect(() => {
    loadAllData();
    setupRealtimeSubscriptions();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      
      // Load all data in parallel
      const [
        { data: resourcesData },
        { data: uploadsData },
        { data: announcementsData },
        { data: suggestionsData },
        { data: admissionsData },
        { data: attendanceData }
      ] = await Promise.all([
        supabase.from('resources').select('*').order('created_at', { ascending: false }),
        supabase.from('uploads').select('*').order('created_at', { ascending: false }),
        supabase.from('announcements').select('*').order('created_at', { ascending: false }),
        supabase.from('suggestions').select('*').order('created_at', { ascending: false }),
        supabase.from('admissions').select('*').order('created_at', { ascending: false }),
        supabase.from('attendance_records').select('*').order('created_at', { ascending: false })
      ]);

      // Convert database data to frontend types
      setResources(resourcesData?.map(convertResourceFromDB) || []);
      setUploads(uploadsData?.map(convertUploadFromDB) || []);
      setAnnouncements(announcementsData?.map(convertAnnouncementFromDB) || []);
      setSuggestions(suggestionsData?.map(convertSuggestionFromDB) || []);
      setAdmissions(admissionsData?.map(convertAdmissionFromDB) || []);
      setAttendanceRecords(attendanceData?.map(convertAttendanceFromDB) || []);

      // Load viewed items from localStorage (fallback)
      const savedViewedResources = localStorage.getItem('viewedResources');
      const savedViewedTimetables = localStorage.getItem('viewedTimetables');
      
      if (savedViewedResources) {
        try {
          setViewedResources(JSON.parse(savedViewedResources));
        } catch (e) {
          console.error('Error parsing viewed resources:', e);
        }
      }
      
      if (savedViewedTimetables) {
        try {
          setViewedTimetables(JSON.parse(savedViewedTimetables));
        } catch (e) {
          console.error('Error parsing viewed timetables:', e);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Setup real-time subscriptions
  const setupRealtimeSubscriptions = () => {
    // Subscribe to announcements changes
    supabase
      .channel('announcements')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'announcements' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setAnnouncements(prev => [convertAnnouncementFromDB(payload.new), ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setAnnouncements(prev => prev.map(a => 
            a.id === payload.new.id ? convertAnnouncementFromDB(payload.new) : a
          ));
        } else if (payload.eventType === 'DELETE') {
          setAnnouncements(prev => prev.filter(a => a.id !== payload.old.id));
        }
      })
      .subscribe();

    // Subscribe to resources changes
    supabase
      .channel('resources')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'resources' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setResources(prev => [convertResourceFromDB(payload.new), ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setResources(prev => prev.map(r => 
            r.id === payload.new.id ? convertResourceFromDB(payload.new) : r
          ));
        } else if (payload.eventType === 'DELETE') {
          setResources(prev => prev.filter(r => r.id !== payload.old.id));
        }
      })
      .subscribe();

    // Subscribe to uploads changes
    supabase
      .channel('uploads')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'uploads' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setUploads(prev => [convertUploadFromDB(payload.new), ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setUploads(prev => prev.map(u => 
            u.id === payload.new.id ? convertUploadFromDB(payload.new) : u
          ));
        } else if (payload.eventType === 'DELETE') {
          setUploads(prev => prev.filter(u => u.id !== payload.old.id));
        }
      })
      .subscribe();
  };

  // Helper functions to convert database data to frontend types
  const convertResourceFromDB = (dbResource: any): Resource => ({
    id: dbResource.id,
    title: dbResource.title,
    fileName: dbResource.file_name || dbResource.title,
    fileUrl: dbResource.file_url,
    type: dbResource.file_type === 'pdf' ? 'pdf' : 'image',
    uploadedBy: dbResource.uploaded_by,
    uploadedAt: dbResource.created_at,
    category: dbResource.category === 'timetables' ? 'timetable' : 'resource'
  });

  const convertUploadFromDB = (dbUpload: any): Upload => ({
    id: dbUpload.id,
    teacherId: dbUpload.teacher_id || dbUpload.uploaded_by,
    teacherName: dbUpload.teacher_name || dbUpload.uploaded_by,
    type: dbUpload.type === 'lesson-plan' ? 'lesson-plan' : 'progress-report',
    fileName: dbUpload.file_name || dbUpload.title,
    fileUrl: dbUpload.file_url,
    uploadedAt: dbUpload.created_at,
    status: dbUpload.status,
    comments: dbUpload.comments,
    grade: dbUpload.grade
  });

  const convertAnnouncementFromDB = (dbAnnouncement: any): Announcement => ({
    id: dbAnnouncement.id,
    title: dbAnnouncement.title,
    content: dbAnnouncement.content,
    target: dbAnnouncement.target,
    author: dbAnnouncement.author,
    createdAt: dbAnnouncement.created_at,
    isRead: dbAnnouncement.is_read
  });

  const convertSuggestionFromDB = (dbSuggestion: any): Suggestion => ({
    id: dbSuggestion.id,
    name: dbSuggestion.name,
    email: dbSuggestion.email,
    message: dbSuggestion.message,
    source: dbSuggestion.source || 'public',
    submittedAt: dbSuggestion.created_at,
    isRead: dbSuggestion.is_read,
    reply: dbSuggestion.reply,
    repliedAt: dbSuggestion.replied_at,
    repliedBy: dbSuggestion.replied_by
  });

  const convertAdmissionFromDB = (dbAdmission: any): AdmissionApplication => ({
    id: dbAdmission.id,
    studentName: dbAdmission.student_name,
    parentName: dbAdmission.parent_name,
    email: dbAdmission.email,
    phone: dbAdmission.phone,
    grade: dbAdmission.grade,
    message: dbAdmission.message,
    submittedAt: dbAdmission.created_at,
    status: dbAdmission.status || 'pending'
  });

  const convertAttendanceFromDB = (dbAttendance: any): AttendanceRecord => ({
    id: dbAttendance.id,
    teacherId: dbAttendance.teacher_id,
    teacherName: dbAttendance.teacher_name,
    date: dbAttendance.date,
    time: dbAttendance.time,
    status: dbAttendance.status,
    location: {
      latitude: dbAttendance.latitude || 0,
      longitude: dbAttendance.longitude || 0
    }
  });

  // Helper functions to convert frontend data to database format
  const convertResourceToDB = (resource: Omit<Resource, 'id'>) => ({
    title: resource.title,
    file_name: resource.fileName,
    file_url: resource.fileUrl,
    file_type: resource.type,
    category: resource.category === 'timetable' ? 'timetables' : 'resources',
    uploaded_by: resource.uploadedBy
  });

  const convertUploadToDB = (upload: Omit<Upload, 'id'>) => ({
    title: upload.fileName,
    file_url: upload.fileUrl,
    file_type: upload.type,
    teacher_id: upload.teacherId,
    teacher_name: upload.teacherName,
    status: upload.status,
    comments: upload.comments,
    grade: upload.grade
  });

  const convertAnnouncementToDB = (announcement: Omit<Announcement, 'id'>) => ({
    title: announcement.title,
    content: announcement.content,
    target: announcement.target,
    author: announcement.author,
    is_read: announcement.isRead
  });

  const convertSuggestionToDB = (suggestion: Omit<Suggestion, 'id'>) => ({
    name: suggestion.name,
    email: suggestion.email,
    message: suggestion.message,
    source: suggestion.source,
    is_read: suggestion.isRead,
    reply: suggestion.reply,
    replied_at: suggestion.repliedAt,
    replied_by: suggestion.repliedBy
  });

  const convertAdmissionToDB = (admission: Omit<AdmissionApplication, 'id'>) => ({
    student_name: admission.studentName,
    parent_name: admission.parentName,
    email: admission.email,
    phone: admission.phone,
    grade: admission.grade,
    message: admission.message,
    status: admission.status
  });

  const convertAttendanceToDB = (attendance: Omit<AttendanceRecord, 'id'>) => ({
    teacher_id: attendance.teacherId,
    teacher_name: attendance.teacherName,
    date: attendance.date,
    time: attendance.time,
    status: attendance.status,
    latitude: attendance.location.latitude,
    longitude: attendance.location.longitude
  });

  // CRUD Operations
  const addResource = async (resource: Omit<Resource, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .insert(convertResourceToDB(resource))
        .select()
        .single();

      if (error) {
        console.error('Error adding resource:', error);
        return;
      }

      setResources(prev => [convertResourceFromDB(data), ...prev]);
    } catch (error) {
      console.error('Error adding resource:', error);
    }
  };

  const deleteResource = async (id: string) => {
    try {
      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting resource:', error);
        return;
      }

      setResources(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      console.error('Error deleting resource:', error);
    }
  };

  const addUpload = async (upload: Omit<Upload, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('uploads')
        .insert(convertUploadToDB(upload))
        .select()
        .single();

      if (error) {
        console.error('Error adding upload:', error);
        return;
      }

      setUploads(prev => [convertUploadFromDB(data), ...prev]);
    } catch (error) {
      console.error('Error adding upload:', error);
    }
  };

  const markUpload = async (id: string, comments: string, grade?: string) => {
    try {
      const { error } = await supabase
        .from('uploads')
        .update({ 
          status: 'marked', 
          comments, 
          grade 
        })
        .eq('id', id);

      if (error) {
        console.error('Error marking upload:', error);
        return;
      }

      setUploads(prev => prev.map(u => 
        u.id === id 
          ? { ...u, status: 'marked', comments, grade }
          : u
      ));
    } catch (error) {
      console.error('Error marking upload:', error);
    }
  };

  const clearAllUploads = async () => {
    try {
      const { error } = await supabase
        .from('uploads')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (error) {
        console.error('Error clearing uploads:', error);
        return;
      }

      setUploads([]);
    } catch (error) {
      console.error('Error clearing uploads:', error);
    }
  };

  const addAnnouncement = async (announcement: Omit<Announcement, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .insert(convertAnnouncementToDB(announcement))
        .select()
        .single();

      if (error) {
        console.error('Error adding announcement:', error);
        return;
      }

      setAnnouncements(prev => [convertAnnouncementFromDB(data), ...prev]);
    } catch (error) {
      console.error('Error adding announcement:', error);
    }
  };

  const deleteAnnouncement = async (id: string) => {
    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting announcement:', error);
        return;
      }

      setAnnouncements(prev => prev.filter(a => a.id !== id));
    } catch (error) {
      console.error('Error deleting announcement:', error);
    }
  };

  const markAnnouncementRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('announcements')
        .update({ is_read: true })
        .eq('id', id);

      if (error) {
        console.error('Error marking announcement read:', error);
        return;
      }

      setAnnouncements(prev => prev.map(a => 
        a.id === id ? { ...a, isRead: true } : a
      ));
    } catch (error) {
      console.error('Error marking announcement read:', error);
    }
  };

  const addSuggestion = async (suggestion: Omit<Suggestion, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('suggestions')
        .insert(convertSuggestionToDB(suggestion))
        .select()
        .single();

      if (error) {
        console.error('Error adding suggestion:', error);
        return;
      }

      setSuggestions(prev => [convertSuggestionFromDB(data), ...prev]);
    } catch (error) {
      console.error('Error adding suggestion:', error);
    }
  };

  const markSuggestionRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('suggestions')
        .update({ is_read: true })
        .eq('id', id);

      if (error) {
        console.error('Error marking suggestion read:', error);
        return;
      }

      setSuggestions(prev => prev.map(s => 
        s.id === id ? { ...s, isRead: true } : s
      ));
    } catch (error) {
      console.error('Error marking suggestion read:', error);
    }
  };

  const addSuggestionReply = async (id: string, reply: string, repliedBy: string) => {
    try {
      const { error } = await supabase
        .from('suggestions')
        .update({ 
          reply, 
          replied_at: new Date().toISOString(),
          replied_by: repliedBy,
          is_read: true 
        })
        .eq('id', id);

      if (error) {
        console.error('Error adding suggestion reply:', error);
        return;
      }

      setSuggestions(prev => prev.map(s => 
        s.id === id ? { 
          ...s, 
          reply, 
          repliedAt: new Date().toISOString(),
          repliedBy,
          isRead: true 
        } : s
      ));
    } catch (error) {
      console.error('Error adding suggestion reply:', error);
    }
  };

  const clearAllSuggestions = async () => {
    try {
      const { error } = await supabase
        .from('suggestions')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (error) {
        console.error('Error clearing suggestions:', error);
        return;
      }

      setSuggestions([]);
    } catch (error) {
      console.error('Error clearing suggestions:', error);
    }
  };

  const clearTeacherSuggestions = async (teacherName: string) => {
    try {
      const { error } = await supabase
        .from('suggestions')
        .delete()
        .eq('name', teacherName);

      if (error) {
        console.error('Error clearing teacher suggestions:', error);
        return;
      }

      setSuggestions(prev => prev.filter(s => s.name !== teacherName));
    } catch (error) {
      console.error('Error clearing teacher suggestions:', error);
    }
  };

  const addAdmission = async (admission: Omit<AdmissionApplication, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('admissions')
        .insert(convertAdmissionToDB(admission))
        .select()
        .single();

      if (error) {
        console.error('Error adding admission:', error);
        return;
      }

      setAdmissions(prev => [convertAdmissionFromDB(data), ...prev]);
    } catch (error) {
      console.error('Error adding admission:', error);
    }
  };

  const updateAdmissionStatus = async (id: string, status: AdmissionApplication['status']) => {
    try {
      const { error } = await supabase
        .from('admissions')
        .update({ status })
        .eq('id', id);

      if (error) {
        console.error('Error updating admission status:', error);
        return;
      }

      setAdmissions(prev => prev.map(a => 
        a.id === id ? { ...a, status } : a
      ));
    } catch (error) {
      console.error('Error updating admission status:', error);
    }
  };

  const addAttendanceRecord = async (record: Omit<AttendanceRecord, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('attendance_records')
        .insert(convertAttendanceToDB(record))
        .select()
        .single();

      if (error) {
        console.error('Error adding attendance record:', error);
        return;
      }

      setAttendanceRecords(prev => [convertAttendanceFromDB(data), ...prev]);
    } catch (error) {
      console.error('Error adding attendance record:', error);
    }
  };

  // Utility functions
  const getUnreadCounts = () => {
    return {
      announcements: announcements.filter(a => !a.isRead).length,
      suggestions: suggestions.filter(s => !s.isRead).length,
      uploads: uploads.filter(u => u.status === 'pending').length,
      admissions: admissions.length, // All admissions are considered unread for admin
      attendance: attendanceRecords.length,
      resources: resources.length, // All resources are considered unread for admin
      timetable: resources.filter(r => r.category === 'timetable').length
    };
  };

  const getPublicAnnouncements = () => {
    return announcements.filter(a => a.target === 'public' || a.target === 'both');
  };

  const getUnreadPublicAnnouncements = () => {
    return getPublicAnnouncements().filter(a => !a.isRead);
  };

  const markResourceViewed = (resourceId: string) => {
    if (!viewedResources.includes(resourceId)) {
      const newViewed = [...viewedResources, resourceId];
      setViewedResources(newViewed);
      localStorage.setItem('viewedResources', JSON.stringify(newViewed));
    }
  };

  const markTimetableViewed = (timetableId: string) => {
    if (!viewedTimetables.includes(timetableId)) {
      const newViewed = [...viewedTimetables, timetableId];
      setViewedTimetables(newViewed);
      localStorage.setItem('viewedTimetables', JSON.stringify(newViewed));
    }
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
      markTimetableViewed,
      loading
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