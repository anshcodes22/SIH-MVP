import React, { useState } from 'react';
import { Shield, MapPin, Bell, BarChart3, CheckCircle } from 'lucide-react';
import { UserConsent } from '../../types';
import { useAuth } from '../../hooks/useAuth';

interface ConsentFlowProps {
  onComplete: (consent: UserConsent) => void;
}

export const ConsentFlow: React.FC<ConsentFlowProps> = ({ onComplete }) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [consent, setConsent] = useState({
    gps_tracking: false,
    data_collection: false,
    data_sharing: false,
    notifications: false,
  });

  const consentItems = [
    {
      id: 'gps_tracking',
      title: 'Location Tracking',
      description: 'Allow the app to track your location for automatic trip detection',
      detail: 'This helps us automatically identify when you start and end trips, making data entry easier for you.',
      icon: MapPin,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      id: 'data_collection',
      title: 'Trip Data Collection',
      description: 'Allow collection of your travel patterns and trip details',
      detail: 'We collect anonymous travel data to understand mobility patterns and improve transportation planning.',
      icon: BarChart3,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      id: 'data_sharing',
      title: 'Research Data Sharing',
      description: 'Share anonymized data with NATPAC researchers for transportation studies',
      detail: 'Your personal information is never shared. Only aggregated, anonymous travel patterns are used for research.',
      icon: Shield,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Receive reminders to complete trip information',
      detail: 'Get gentle reminders when you have incomplete trip details to ensure accurate data collection.',
      icon: Bell,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  const handleToggleConsent = (key: keyof typeof consent) => {
    setConsent(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleNext = () => {
    if (currentStep < consentItems.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    if (!user) return;

    const userConsent: UserConsent = {
      id: `consent_${Date.now()}`,
      user_id: user.id,
      ...consent,
      consented_at: new Date().toISOString(),
    };

    // Store consent locally
    localStorage.setItem(`consent_${user.id}`, JSON.stringify(userConsent));
    
    // Update user consent status
    const updatedUser = { ...user, has_consented: true };
    localStorage.setItem('travel_survey_user', JSON.stringify(updatedUser));

    onComplete(userConsent);
  };

  if (currentStep >= consentItems.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">All Set!</h2>
              <p className="text-gray-600">Thank you for providing your consent. You can now start using the app.</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-gray-900 mb-2">Your Consent Summary:</h3>
              <div className="text-sm space-y-1">
                {consentItems.map(item => (
                  <div key={item.id} className="flex justify-between">
                    <span className="text-gray-600">{item.title}:</span>
                    <span className={consent[item.id as keyof typeof consent] ? 'text-green-600' : 'text-red-600'}>
                      {consent[item.id as keyof typeof consent] ? 'Allowed' : 'Denied'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleComplete}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Continue to App
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentItem = consentItems[currentStep];
  const Icon = currentItem.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">
                Step {currentStep + 1} of {consentItems.length}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(((currentStep + 1) / consentItems.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / consentItems.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${currentItem.bgColor}`}>
              <Icon className={`w-8 h-8 ${currentItem.color}`} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentItem.title}</h2>
            <p className="text-gray-600 mb-4">{currentItem.description}</p>
            <div className="bg-gray-50 rounded-lg p-4 text-left">
              <p className="text-sm text-gray-700">{currentItem.detail}</p>
            </div>
          </div>

          {/* Toggle */}
          <div className="flex items-center justify-center mb-8">
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={consent[currentItem.id as keyof typeof consent]}
                  onChange={() => handleToggleConsent(currentItem.id as keyof typeof consent)}
                  className="sr-only"
                />
                <div className={`block w-14 h-8 rounded-full transition-colors ${
                  consent[currentItem.id as keyof typeof consent] ? 'bg-blue-600' : 'bg-gray-300'
                }`} />
                <div className={`absolute left-1 top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  consent[currentItem.id as keyof typeof consent] ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </div>
              <span className="ml-3 text-lg font-medium text-gray-900">
                {consent[currentItem.id as keyof typeof consent] ? 'Allowed' : 'Not Allowed'}
              </span>
            </label>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {currentStep === consentItems.length - 1 ? 'Review' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};