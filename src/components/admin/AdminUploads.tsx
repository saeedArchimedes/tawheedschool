import React, { useState } from 'react';
import { FileText, Clock, CheckCircle, MessageSquare } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { motion } from 'framer-motion';

const AdminUploads: React.FC = () => {
  const { uploads, markUpload } = useData();
  const [selectedUpload, setSelectedUpload] = useState<string | null>(null);
  const [markingData, setMarkingData] = useState({
    comments: '',
    grade: ''
  });

  const handleMarkSubmit = (uploadId: string) => {
    if (markingData.comments.trim()) {
      markUpload(uploadId, markingData.comments.trim(), markingData.grade || undefined);
      setSelectedUpload(null);
      setMarkingData({ comments: '', grade: '' });
    }
  };

  const pendingUploads = uploads.filter(u => u.status === 'pending');
  const markedUploads = uploads.filter(u => u.status === 'marked');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <motion.h3
          className="text-3xl font-bold text-pink-700 font-sans"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Teacher Uploads
        </motion.h3>
        <p className="text-gray-600 mt-1">
          Review and mark lesson plans and progress reports
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{pendingUploads.length}</p>
              <p className="text-gray-600">Pending Review</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{markedUploads.length}</p>
              <p className="text-gray-600">Marked</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{uploads.length}</p>
              <p className="text-gray-600">Total Uploads</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Uploads */}
      {pendingUploads.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 bg-yellow-50">
            <h4 className="text-lg font-semibold text-yellow-800 flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Pending Review ({pendingUploads.length})</span>
            </h4>
          </div>
          
          <div className="divide-y divide-gray-200">
            {pendingUploads.map((upload) => (
              <div key={upload.id} className="px-6 py-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900">{upload.teacherName}</h5>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="capitalize">{upload.type.replace('-', ' ')}</span>
                        <span>{upload.fileName}</span>
                        <span>{new Date(upload.uploadedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedUpload(upload.id)}
                    className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors duration-200"
                  >
                    Mark & Comment
                  </button>
                </div>
                
                {selectedUpload === upload.id && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h6 className="font-medium text-gray-900 mb-3">Mark this submission</h6>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Grade (Optional)
                        </label>
                        <select
                          value={markingData.grade}
                          onChange={(e) => setMarkingData({ ...markingData, grade: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        >
                          <option value="">Select grade</option>
                          <option value="Excellent">Excellent</option>
                          <option value="Very Good">Very Good</option>
                          <option value="Good">Good</option>
                          <option value="Satisfactory">Satisfactory</option>
                          <option value="Needs Improvement">Needs Improvement</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Comments *
                        </label>
                        <textarea
                          value={markingData.comments}
                          onChange={(e) => setMarkingData({ ...markingData, comments: e.target.value })}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          placeholder="Provide feedback and comments..."
                          required
                        />
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleMarkSubmit(upload.id)}
                          className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors duration-200"
                        >
                          Submit Marking
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUpload(null);
                            setMarkingData({ comments: '', grade: '' });
                          }}
                          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Marked Uploads */}
      {markedUploads.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 bg-pink-50">
            <h4 className="text-lg font-semibold text-pink-800 flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>Marked Submissions ({markedUploads.length})</span>
            </h4>
          </div>
          
          <div className="divide-y divide-gray-200">
            {markedUploads.map((upload) => (
              <div key={upload.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-pink-100 p-2 rounded-full">
                      <CheckCircle className="h-5 w-5 text-pink-600" />
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900">{upload.teacherName}</h5>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="capitalize">{upload.type.replace('-', ' ')}</span>
                        <span>{upload.fileName}</span>
                        <span>{new Date(upload.uploadedAt).toLocaleDateString()}</span>
                        {upload.grade && (
                          <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-xs font-medium">
                            {upload.grade}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {upload.comments && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-start space-x-2">
                      <MessageSquare className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700 text-sm">{upload.comments}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {uploads.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No uploads yet</p>
          <p className="text-gray-400 text-sm">Teacher submissions will appear here</p>
        </div>
      )}
    </div>
  );
};

export default AdminUploads;
