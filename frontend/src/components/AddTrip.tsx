import React, { useState } from 'react';
import { MapPin, Loader2, Navigation } from 'lucide-react';
import { Trip } from '../types';

interface AddTripProps {
  onTripAdded: (trip: Trip) => void;
}

const mockLocations = [
  'Connaught Place',
  'India Gate',
  'Red Fort',
  'Lotus Temple',
  'Qutub Minar',
  'Chandni Chowk',
  'Karol Bagh',
  'Rajouri Garden',
  'Lajpat Nagar',
  'Nehru Place',
  'Dwarka',
  'Gurgaon Cyber City',
  'Noida Sector 18',
  'Faridabad',
  'Greater Kailash',
  'Vasant Kunj',
  'Janakpuri',
  'Rohini',
  'Pitampura',
  'Laxmi Nagar'
];

const travelModes: Trip['mode'][] = ['Car', 'Metro', 'Bus', 'Walking'];

export const AddTrip: React.FC<AddTripProps> = ({ onTripAdded }) => {
  const [gpsEnabled, setGpsEnabled] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);

  const generateMockTrip = (): Trip => {
    const startLocation = mockLocations[Math.floor(Math.random() * mockLocations.length)];
    let endLocation = mockLocations[Math.floor(Math.random() * mockLocations.length)];
    
    // Ensure start and end are different
    while (endLocation === startLocation) {
      endLocation = mockLocations[Math.floor(Math.random() * mockLocations.length)];
    }

    const mode = travelModes[Math.floor(Math.random() * travelModes.length)];
    
    // Generate realistic distance based on mode
    let distance: number;
    switch (mode) {
      case 'Walking':
        distance = Math.floor(Math.random() * 5) + 1; // 1-5 km
        break;
      case 'Bus':
        distance = Math.floor(Math.random() * 15) + 3; // 3-18 km
        break;
      case 'Metro':
        distance = Math.floor(Math.random() * 25) + 5; // 5-30 km
        break;
      case 'Car':
        distance = Math.floor(Math.random() * 50) + 10; // 10-60 km
        break;
      default:
        distance = 10;
    }

    return {
      id: `trip_${Date.now()}`,
      startLocation,
      endLocation,
      mode,
      distance,
      timestamp: new Date().toISOString(),
    };
  };

  const handleGpsToggle = async () => {
    if (!gpsEnabled) {
      setGpsEnabled(true);
      setIsDetecting(true);
      
      // Simulate GPS detection delay
      setTimeout(() => {
        const newTrip = generateMockTrip();
        onTripAdded(newTrip);
        setIsDetecting(false);
      }, 2000);
    } else {
      setGpsEnabled(false);
      setIsDetecting(false);
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* GPS Toggle Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">GPS Tracking</h2>
            <p className="text-sm text-gray-600">Auto-detect your trips</p>
          </div>
          
          {/* Toggle Switch */}
          <button
            onClick={handleGpsToggle}
            disabled={isDetecting}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 ${
              gpsEnabled ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                gpsEnabled ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Status Messages */}
        {!gpsEnabled && !isDetecting && (
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <MapPin className="w-5 h-5 text-gray-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-700">GPS is disabled</p>
              <p className="text-xs text-gray-500">Enable GPS to auto-detect trips</p>
            </div>
          </div>
        )}

        {isDetecting && (
          <div className="flex items-center p-4 bg-blue-50 rounded-lg">
            <Loader2 className="w-5 h-5 text-blue-600 mr-3 animate-spin" />
            <div>
              <p className="text-sm font-medium text-blue-700">Detecting trip...</p>
              <p className="text-xs text-blue-600">Please wait while we analyze your movement</p>
            </div>
          </div>
        )}

        {gpsEnabled && !isDetecting && (
          <div className="flex items-center p-4 bg-green-50 rounded-lg">
            <Navigation className="w-5 h-5 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-green-700">GPS is active</p>
              <p className="text-xs text-green-600">Monitoring your location for trip detection</p>
            </div>
          </div>
        )}
      </div>

      {/* How it works */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">How it works</h3>
        <div className="space-y-3">
          <div className="flex items-start">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
              <span className="text-xs font-semibold text-blue-600">1</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Enable GPS tracking</p>
              <p className="text-xs text-gray-600">Turn on the GPS toggle to start monitoring</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
              <span className="text-xs font-semibold text-blue-600">2</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Automatic detection</p>
              <p className="text-xs text-gray-600">We'll detect when you start and end trips</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
              <span className="text-xs font-semibold text-blue-600">3</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Trip logging</p>
              <p className="text-xs text-gray-600">All trips are automatically saved to your dashboard</p>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <h4 className="text-sm font-semibold text-yellow-800 mb-2">🔒 Privacy Notice</h4>
        <p className="text-xs text-yellow-700">
          Your location data is processed locally on your device. We only store trip summaries 
          (start/end locations and travel mode) for your personal tracking.
        </p>
      </div>
    </div>
  );
};