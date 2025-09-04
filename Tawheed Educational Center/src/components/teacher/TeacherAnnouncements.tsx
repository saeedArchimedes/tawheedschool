import React, { useEffect } from 'react';
import { Bell, Clock, User } from 'lucide-react';
import { useData } from '@/contexts/DataContext';

const TeacherAnnouncements: React.FC = () => {
  const { announcements, markAnnouncementRead } = useData();

  // Filter announcements for teachers
  const teacherAnnouncements = announcements
    .filter(a => a.target === 'teachers' || a.target === 'both')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const unreadAnnouncements = teacherAnnouncements.filter(a => !a.isRead);

  // Mark announcements as read when component mounts
  useEffect(() => {
    unreadAnnouncements.forEach(announcement => {
      markAnnouncementRead(announcement.id);
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
<div className="text-center space-y-2">
  <h3 className="text-3xl font-serif font-bold text-pink-700 tracking-wide">
    Announcements
  </h3>
  <p className="text-gray-600 mt-1">
    Stay updated with important news and information
  </p>
</div>


      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Bell className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{teacherAnnouncements.length}</p>
              <p className="text-sm text-gray-600">Total Announcements</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-full">
              <Clock className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">
                {teacherAnnouncements.filter(a => {
                  const announcementDate = new Date(a.createdAt);
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return announcementDate >= weekAgo;
                }).length}
              </p>
              <p className="text-sm text-gray-600">This Week</p>
            </div>
          </div>
        </div>
      </div>

      {/* Announcements List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900">
            All Announcements ({teacherAnnouncements.length})
          </h4>
        </div>
        
        {teacherAnnouncements.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No announcements yet</p>
            <p className="text-gray-400 text-sm">New announcements from admin will appear here</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {teacherAnnouncements.map((announcement) => {
              const isRecent = new Date(announcement.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000);
              
              return (
                <div 
                  key={announcement.id} 
                  className={`px-6 py-4 ${isRecent ? 'bg-blue-50 border-l-4 border-l-blue-400' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h5 className="text-lg font-medium text-gray-900">{announcement.title}</h5>
                        {isRecent && (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                            New
                          </span>
                        )}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          announcement.target === 'teachers' 
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {announcement.target === 'teachers' ? 'Teachers Only' : 'Teachers & Public'}
                        </span>
                      </div>
                      
                      <p className="text-gray-700 mb-3 leading-relaxed whitespace-pre-wrap">
                        {announcement.content}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>By {announcement.author}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{new Date(announcement.createdAt).toLocaleDateString()}</span>
                        </div>
                        <span>{new Date(announcement.createdAt).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-blue-900 mb-3">About Announcements</h4>
        <ul className="space-y-2 text-blue-800 text-sm">
          <li>• Announcements are automatically marked as read when you view them</li>
          <li>• New announcements are highlighted with a blue border</li>
          <li>• You'll see announcements targeted to teachers and general announcements</li>
          <li>• Check this section regularly for important updates and information</li>
          <li>• Recent announcements (within 24 hours) are marked as "New"</li>
        </ul>
      </div>
    </div>
  );
};

export default TeacherAnnouncements;