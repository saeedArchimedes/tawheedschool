import React from 'react';
import { Calendar, Download, FileText, Image } from 'lucide-react';
import { useData } from '@/contexts/DataContext';

const TeacherTimetable: React.FC = () => {
  const { resources } = useData();

  const timetables = resources
    .filter(r => r.category === 'timetable')
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

  const handleDownload = (timetable: any) => {
    try {
      const link = document.createElement('a');
      link.href = timetable.fileUrl;
      link.download = timetable.fileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log(`Downloading ${timetable.fileName}...`);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h3 className="text-3xl font-serif font-bold text-pink-700 tracking-wide">
          Class Timetables
        </h3>
        <p className="text-gray-600 mt-1">
          Access and download current class schedules and timetables
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">{timetables.length}</p>
              <p className="text-sm text-gray-600">Available Timetables</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-full">
              <FileText className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">
                {timetables.filter(t => t.type === 'pdf').length}
              </p>
              <p className="text-sm text-gray-600">PDF Schedules</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-full">
              <Image className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">
                {timetables.filter(t => t.type === 'image').length}
              </p>
              <p className="text-sm text-gray-600">Image Schedules</p>
            </div>
          </div>
        </div>
      </div>

      {/* Timetables List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900">
            Current Timetables ({timetables.length})
          </h4>
        </div>

        {timetables.length === 0 ? (
          <div className="p-8 text-center">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No timetables available yet</p>
            <p className="text-gray-400 text-sm">Timetables uploaded by admin will appear here</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {timetables.map((timetable) => {
              const isRecent = new Date(timetable.uploadedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
              return (
                <div 
                  key={timetable.id} 
                  className={`px-6 py-4 hover:bg-gray-50 transition-colors duration-200 ${
                    isRecent ? 'bg-green-50 border-l-4 border-l-green-400' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Calendar className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-1">
                          <h5 className="text-lg font-medium text-gray-900 truncate">{timetable.title}</h5>
                          {isRecent && (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                              New
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{timetable.fileName}</span>
                          <span>Uploaded: {new Date(timetable.uploadedAt).toLocaleDateString()}</span>
                          <span className="capitalize bg-gray-100 px-2 py-1 rounded-full text-xs">
                            {timetable.type}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDownload(timetable)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherTimetable;
