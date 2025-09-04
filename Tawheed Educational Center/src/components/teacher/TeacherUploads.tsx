import React, { useState } from 'react';
import { Upload, FileText, Calendar, Clock, CheckCircle, AlertCircle, MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';

const TeacherUploads: React.FC = () => {
  const { currentUser } = useAuth();
  const { uploads, addUpload } = useData();
  const [activeTab, setActiveTab] = useState<'lesson-plan' | 'progress-report'>('lesson-plan');
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const myUploads = uploads.filter(u => u.teacherId === currentUser?.id);
  const lessonPlans = myUploads.filter(u => u.type === 'lesson-plan');
  const progressReports = myUploads.filter(u => u.type === 'progress-report');

  // Check if it's Sunday or Monday for lesson plan uploads
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday
  const canUploadLessonPlan = dayOfWeek === 0 || dayOfWeek === 1;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(e.target.files);
  };

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0 || !currentUser) return;

    setIsUploading(true);

    // Simulate file upload delay
    setTimeout(() => {
      Array.from(selectedFiles).forEach((file) => {
        // In a real app, you would upload the file to a server
        const fileUrl = URL.createObjectURL(file);
        
        addUpload({
          teacherId: currentUser.id,
          teacherName: currentUser.name,
          type: activeTab,
          fileName: file.name,
          fileUrl,
          uploadedAt: new Date().toISOString(),
          status: 'pending'
        });
      });

      setSelectedFiles(null);
      setIsUploading(false);
      
      // Reset file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    return status === 'pending' 
      ? 'bg-yellow-100 text-yellow-800'
      : 'bg-green-100 text-green-800';
  };

  const getStatusIcon = (status: string) => {
    return status === 'pending' 
      ? <Clock className="h-4 w-4" />
      : <CheckCircle className="h-4 w-4" />;
  };

  const currentUploads = activeTab === 'lesson-plan' ? lessonPlans : progressReports;

  return (
    <div className="space-y-6">
      {/* Header */}
<div className="text-center space-y-2">
  <h3 className="text-3xl font-serif font-bold text-pink-700 tracking-wide">
    Lesson Plan & Progress Report
  </h3>
  <p className="text-gray-600 mt-1">
    Upload your teaching materials for admin review
  </p>
</div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('lesson-plan')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'lesson-plan'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Lesson Plans ({lessonPlans.length})
            </button>
            <button
              onClick={() => setActiveTab('progress-report')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'progress-report'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Progress Reports ({progressReports.length})
            </button>
          </nav>
        </div>

        {/* Upload Form */}
        <div className="p-6">
          {activeTab === 'lesson-plan' && !canUploadLessonPlan && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-yellow-800">
                <p className="font-medium">Lesson Plan Upload Restricted</p>
                <p className="text-sm mt-1">Lesson plans can only be uploaded on Sundays and Mondays.</p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
                Upload {activeTab === 'lesson-plan' ? 'Lesson Plan' : 'Progress Report'} *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors duration-200">
                <input
                  type="file"
                  id="file-upload"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  multiple
                  className="hidden"
                  disabled={activeTab === 'lesson-plan' && !canUploadLessonPlan}
                />
                <label 
                  htmlFor="file-upload" 
                  className={`cursor-pointer ${
                    activeTab === 'lesson-plan' && !canUploadLessonPlan 
                      ? 'opacity-50 cursor-not-allowed' 
                      : ''
                  }`}
                >
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Click to upload files</p>
                  <p className="text-sm text-gray-500">PDF or Image files (multiple files supported)</p>
                </label>
                {selectedFiles && selectedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {Array.from(selectedFiles).map((file, index) => (
                      <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-blue-800 font-medium">{file.name}</p>
                        <p className="text-blue-600 text-sm">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleUpload}
              disabled={!selectedFiles || selectedFiles.length === 0 || isUploading || (activeTab === 'lesson-plan' && !canUploadLessonPlan)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400 transition-all duration-200 flex items-center space-x-2"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5" />
                  <span>Upload {activeTab === 'lesson-plan' ? 'Lesson Plan' : 'Progress Report'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Upload Schedule */}
      {activeTab === 'lesson-plan' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-blue-900 mb-3 flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Lesson Plan Upload Schedule</span>
          </h4>
          <div className="space-y-2 text-blue-800 text-sm">
            <p><strong>Upload Days:</strong> Sundays and Mondays only</p>
            <p><strong>Current Status:</strong> 
              <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                canUploadLessonPlan 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {canUploadLessonPlan ? 'Upload Available' : 'Upload Restricted'}
              </span>
            </p>
            <p><strong>Next Available:</strong> {
              canUploadLessonPlan 
                ? 'Now' 
                : dayOfWeek < 6 ? 'This Sunday' : 'Next Sunday'
            }</p>
          </div>
        </div>
      )}

      {/* My Uploads */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900">
            My {activeTab === 'lesson-plan' ? 'Lesson Plans' : 'Progress Reports'} ({currentUploads.length})
          </h4>
        </div>
        
        {currentUploads.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              No {activeTab === 'lesson-plan' ? 'lesson plans' : 'progress reports'} uploaded yet
            </p>
            <p className="text-gray-400 text-sm">
              Upload your first {activeTab === 'lesson-plan' ? 'lesson plan' : 'progress report'} to get started
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {currentUploads
              .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
              .map((upload) => (
                <div key={upload.id} className="px-6 py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-gray-900">{upload.fileName}</h5>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          <span>Uploaded: {new Date(upload.uploadedAt).toLocaleDateString()}</span>
                          <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(upload.status)}`}>
                            {getStatusIcon(upload.status)}
                            <span className="capitalize">{upload.status}</span>
                          </span>
                        </div>
                        
                        {upload.comments && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-start space-x-2">
                              <MessageSquare className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">Admin Feedback:</p>
                                <p className="text-sm text-gray-700 mt-1">{upload.comments}</p>
                                {upload.grade && (
                                  <span className="inline-block mt-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                    Grade: {upload.grade}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherUploads;