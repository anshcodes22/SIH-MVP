import React from 'react';
import { MapPin, Clock, Route, Car, Train, Bus, User } from 'lucide-react';
import { Trip } from '../types';

interface DashboardProps {
  trips: Trip[];
}

const getModeIcon = (mode: Trip['mode']) => {
  switch (mode) {
    case 'Car':
      return <Car className="w-5 h-5" />;
    case 'Metro':
      return <Train className="w-5 h-5" />;
    case 'Bus':
      return <Bus className="w-5 h-5" />;
    case 'Walking':
      return <User className="w-5 h-5" />;
    default:
      return <MapPin className="w-5 h-5" />;
  }
};

const getModeColor = (mode: Trip['mode']) => {
  switch (mode) {
    case 'Car':
      return 'text-blue-600 bg-blue-50';
    case 'Metro':
      return 'text-purple-600 bg-purple-50';
    case 'Bus':
      return 'text-green-600 bg-green-50';
    case 'Walking':
      return 'text-orange-600 bg-orange-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};

const formatDate = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 24) {
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  } else if (diffInHours < 48) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-IN', { 
      month: 'short', 
      day: 'numeric' 
    });
  }
};

export const Dashboard: React.FC<DashboardProps> = ({ trips }) => {
  const totalDistance = trips.reduce((sum, trip) => sum + trip.distance, 0);
  const totalTrips = trips.length;
  const mostUsedMode = trips.reduce((acc, trip) => {
    acc[trip.mode] = (acc[trip.mode] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const topMode = Object.entries(mostUsedMode).sort(([,a], [,b]) => b - a)[0]?.[0] || 'Car';

  return (
    <div className="p-4 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{totalTrips}</div>
          <div className="text-xs text-gray-600">Total Trips</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{totalDistance}</div>
          <div className="text-xs text-gray-600">Total KM</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{topMode}</div>
          <div className="text-xs text-gray-600">Top Mode</div>
        </div>
      </div>

      {/* Trips Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Recent Trips</h2>
        <span className="text-sm text-gray-500">{trips.length} trips</span>
      </div>

      {/* Trips List */}
      <div className="space-y-3">
        {trips.map((trip) => (
          <div key={trip.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            {/* Trip Header */}
            <div className="flex items-center justify-between mb-3">
              <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${getModeColor(trip.mode)}`}>
                {getModeIcon(trip.mode)}
                <span className="ml-2">{trip.mode}</span>
              </div>
              
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="w-3 h-3 mr-1" />
                {formatDate(trip.timestamp)}
              </div>
            </div>

            {/* Route */}
            <div className="flex items-start mb-3">
              <div className="flex flex-col items-center mr-3 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="w-px h-8 bg-gray-300 my-1"></div>
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate mb-1">
                  {trip.startLocation}
                </div>
                <div className="text-sm text-gray-600 truncate">
                  {trip.endLocation}
                </div>
              </div>
            </div>

            {/* Distance */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex items-center text-sm text-gray-600">
                <Route className="w-4 h-4 mr-1" />
                <span>{trip.distance} km</span>
              </div>
              
              {/* Duration estimate based on mode and distance */}
              <div className="text-xs text-gray-500">
                {trip.mode === 'Walking' && `~${Math.ceil(trip.distance * 12)} min`}
                {trip.mode === 'Bus' && `~${Math.ceil(trip.distance * 3)} min`}
                {trip.mode === 'Metro' && `~${Math.ceil(trip.distance * 2)} min`}
                {trip.mode === 'Car' && `~${Math.ceil(trip.distance * 1.5)} min`}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State (if no trips) */}
      {trips.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="text-4xl mb-3">🗺️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No trips yet</h3>
          <p className="text-gray-600 mb-4">Enable GPS tracking to start logging your journeys</p>
        </div>
      )}

      {/* Quick Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h4 className="text-sm font-semibold text-blue-800 mb-2">💡 Tips</h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Keep GPS enabled for automatic trip detection</li>
          <li>• Trips are saved locally on your device</li>
          <li>• Distance and duration are estimated based on travel mode</li>
        </ul>
      </div>
    </div>
  );
};