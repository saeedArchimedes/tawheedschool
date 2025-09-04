import React, { useState } from 'react';
import { MessageSquare, Send, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';

const TeacherSuggestions: React.FC = () => {
  const { currentUser } = useAuth();
  const { addSuggestion } = useData();
  const [formData, setFormData] = useState({
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.message.trim() || !currentUser) return;
    
    setIsSubmitting(true);

    setTimeout(() => {
      addSuggestion({
        name: currentUser.name,
        email: `${currentUser.username}@tawheed-edu.com`,
        message: formData.message.trim(),
        source: 'teacher',
        submittedAt: new Date().toISOString(),
        isRead: false
      });
      
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      setFormData({ message: '' });

      setTimeout(() => setIsSubmitted(false), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
<div className="text-center space-y-2">
  <h3 className="text-3xl font-serif font-bold text-pink-700 tracking-wide">
    Suggestion Box
  </h3>
  <p className="text-gray-600 mt-1">
    Share your ideas, concerns, or suggestions with the administration
  </p>
</div>


      {/* Suggestion Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Submit a Suggestion</h4>
        
        {isSubmitted ? (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h5 className="text-xl font-semibold text-green-800 mb-2">Suggestion Submitted!</h5>
            <p className="text-green-700 mb-4">
              Thank you for your feedback. Your suggestion has been sent to the administration 
              and will be reviewed carefully.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              Submit Another Suggestion
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Your Suggestion or Feedback *
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                required
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Share your thoughts, suggestions, concerns, or ideas for improvement..."
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h5 className="font-medium text-blue-900 mb-2">Suggestion Guidelines:</h5>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Be specific and constructive in your feedback</li>
                <li>• Include details that will help admin understand your perspective</li>
                <li>• Suggest practical solutions when pointing out problems</li>
                <li>• All suggestions are reviewed confidentially</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !formData.message.trim()}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-400 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  <span>Submit Suggestion</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-green-900 mb-3 flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>What to Include</span>
          </h4>
          <ul className="space-y-2 text-green-800 text-sm">
            <li>• Classroom or teaching-related suggestions</li>
            <li>• Resource requests or recommendations</li>
            <li>• Process improvement ideas</li>
            <li>• Student welfare concerns</li>
            <li>• Professional development suggestions</li>
            <li>• Technology or infrastructure feedback</li>
          </ul>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-blue-900 mb-3">How It Works</h4>
          <div className="space-y-3 text-blue-800 text-sm">
            <div className="flex items-start space-x-2">
              <div className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">1</div>
              <p>Submit your suggestion using the form above</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">2</div>
              <p>Admin receives and reviews your feedback</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">3</div>
              <p>Appropriate action is taken or response is provided</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Alternative */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-yellow-900 mb-3">Need Immediate Attention?</h4>
        <p className="text-yellow-800 text-sm mb-3">
          For urgent matters that require immediate attention, consider speaking directly with the administration 
          or using other communication channels.
        </p>
        <div className="text-yellow-800 text-sm">
          <p><strong>Office Hours:</strong> Monday - Friday, 7:00 AM - 4:00 PM</p>
          <p><strong>Phone:</strong> 0558652422</p>
        </div>
      </div>
    </div>
  );
};

export default TeacherSuggestions;