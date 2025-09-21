import React, { useState } from 'react';
import { ArrowLeft, User, Mail, Calendar, Tag, LogOut, Edit3, Save, X } from 'lucide-react';
import { User as UserType } from '../types';

interface UserProfileProps {
  user: UserType;
  onBack: () => void;
  onLogout: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, onBack, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user.name);
  const [editedInterests, setEditedInterests] = useState(user.interests?.join(', ') || '');

  const handleSave = () => {
    // In a real app, this would update the user data
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedName(user.name);
    setEditedInterests(user.interests?.join(', ') || '');
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          
          <h1 className="text-lg font-semibold text-gray-900">Profile</h1>
          
          <button
            onClick={onLogout}
            className="flex items-center text-red-600 hover:text-red-700"
          >
            <LogOut className="w-4 h-4 mr-1" />
            Logout
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
                <p className="text-gray-600 capitalize">{user.role}</p>
              </div>
            </div>
            
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center px-3 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Edit3 className="w-4 h-4 mr-1" />
                Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Save className="w-4 h-4 mr-1" />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Profile Details */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Mail className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <div className="text-sm font-medium text-gray-700">Email</div>
                <div className="text-gray-900">{user.email}</div>
              </div>
            </div>

            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-gray-400 mr-3" />
              <div>
                <div className="text-sm font-medium text-gray-700">Member since</div>
                <div className="text-gray-900">
                  {new Date(user.created_at).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>

            {user.role === 'participant' && (
              <div className="flex items-start">
                <Tag className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-700 mb-1">Interests</div>
                  {!isEditing ? (
                    <div className="flex flex-wrap gap-2">
                      {user.interests?.map((interest, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                        >
                          {interest}
                        </span>
                      )) || (
                        <span className="text-gray-500 text-sm">No interests added</span>
                      )}
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={editedInterests}
                      onChange={(e) => setEditedInterests(e.target.value)}
                      placeholder="Enter interests separated by commas"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Role-specific Information */}
        {user.role === 'participant' ? (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 className="font-semibold text-blue-800 mb-2">📱 Participant Dashboard</h3>
            <p className="text-blue-700 text-sm mb-3">
              As a participant, you can track your daily trips and contribute to transportation research.
            </p>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Enable GPS to automatically detect trips</li>
              <li>• View your travel patterns and statistics</li>
              <li>• Help improve urban transportation planning</li>
            </ul>
          </div>
        ) : (
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
            <h3 className="font-semibold text-purple-800 mb-2">🔬 Research Portal</h3>
            <p className="text-purple-700 text-sm mb-3">
              As a scientist, you have access to aggregated travel data and analytics tools.
            </p>
            <ul className="text-purple-700 text-sm space-y-1">
              <li>• Analyze travel patterns and trends</li>
              <li>• Export data for research purposes</li>
              <li>• View origin-destination matrices</li>
              <li>• Access data quality metrics</li>
            </ul>
          </div>
        )}

        {/* Privacy Notice */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <h4 className="font-semibold text-gray-800 mb-2">🔒 Privacy & Data</h4>
          <p className="text-gray-700 text-sm">
            Your personal information is kept secure and private. Location data is anonymized 
            for research purposes and you can delete your data at any time.
          </p>
        </div>
      </div>
    </div>
  );
};