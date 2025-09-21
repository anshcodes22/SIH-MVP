import React, { useState } from 'react';
import { Plus, Calendar, MapPin, TrendingUp, RefreshCw, AlertCircle, Bell } from 'lucide-react';
import { useTrips } from '../../hooks/useTrips';
import { TripTimeline } from '../Trips/TripTimeline';
import { Trip } from '../../types';

interface UserHomeProps {
  onAddTrip: () => void;
  onEditTrip?: (trip: Trip) => void;
}

export const UserHome: React.FC<UserHomeProps> = ({ onAddTrip, onEditTrip }) => {
  const { trips, getTripsByDate, getIncompleteTrips, updateTrip, reminders, dismissReminder } = useTrips();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const todayTrips = getTripsByDate(selectedDate);
  const recentTrips = trips.slice(-5).reverse();
  const incompleteTrips = getIncompleteTrips();
  const activeReminders = reminders.slice(0, 3); // Show max 3 reminders

  const getDateLabel = (date: string) => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    if (date === today) return 'Today';
    if (date === yesterday) return 'Yesterday';
    return new Date(date).toLocaleDateString('en-IN', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleConfirmDestination = (tripId: string, destination: string) => {
    updateTrip(tripId, {
      destination,
      destination_status: 'decided',
    });
  };

  const handleDismissReminder = (reminderId: string) => {
    dismissReminder(reminderId);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome to Travel Survey</h1>
        <p className="text-blue-100 mb-4">
          Help improve transportation by recording your daily trips
        </p>
        
        <button
          onClick={onAddTrip}
          className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Record New Trip
        </button>
      </div>

      {/* Reminders & Notifications */}
      {activeReminders.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-orange-200 p-4">
          <div className="flex items-center mb-3">
            <Bell className="w-5 h-5 text-orange-600 mr-2" />
            <h3 className="font-semibold text-orange-800">Reminders</h3>
          </div>
          <div className="space-y-2">
            {activeReminders.map((reminder) => (
              <div key={reminder.id} className="flex items-start justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm text-orange-800">{reminder.message}</p>
                  <p className="text-xs text-orange-600 mt-1">
                    {new Date(reminder.created_at).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDismissReminder(reminder.id)}
                  className="text-xs text-orange-600 hover:text-orange-800 ml-2"
                >
                  Dismiss
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{trips.length}</div>
          <div className="text-sm text-gray-600">Total Trips</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {new Set(
              trips.map(t =>
                typeof t.start_time === 'string' && t.start_time.includes('T')
                  ? t.start_time.split('T')[0]
                  : 'N/A'
              )
            ).size}
          </div>
          <div className="text-sm text-gray-600">Days Active</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
          <div className={`text-2xl font-bold ${incompleteTrips.length > 0 ? 'text-orange-600' : 'text-purple-600'}`}>
            {incompleteTrips.length}
          </div>
          <div className="text-sm text-gray-600">Incomplete</div>
        </div>
      </div>

      {/* Incomplete Trips Alert */}
      {incompleteTrips.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-orange-200 p-4">
          <div className="flex items-center mb-3">
            <AlertCircle className="w-5 h-5 text-orange-600 mr-2" />
            <h3 className="font-semibold text-orange-800">Action Required</h3>
          </div>
          <p className="text-sm text-orange-700 mb-3">
            You have {incompleteTrips.length} incomplete trip{incompleteTrips.length !== 1 ? 's' : ''} that need your attention.
          </p>
          <div className="space-y-2">
            {incompleteTrips.slice(0, 2).map((trip) => (
              <div key={trip.id} className="flex items-center justify-between p-2 bg-orange-50 rounded-lg">
                <div className="text-sm">
                  <span className="font-medium">{trip.origin}</span>
                  {trip.destination === 'Not decided yet' ? (
                    <span className="text-orange-600"> → Destination pending</span>
                  ) : (
                    <span> → {trip.destination}</span>
                  )}
                </div>
                {onEditTrip && (
                  <button
                    onClick={() => onEditTrip(trip)}
                    className="text-xs text-orange-600 hover:text-orange-800 font-medium"
                  >
                    Complete
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Date Selector */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Daily Trips
          </h3>
          
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="text-sm text-gray-600 mb-4">
          Viewing trips for {getDateLabel(selectedDate)}
        </div>
      </div>

      {/* Trip Timeline */}
      <TripTimeline 
        trips={todayTrips} 
        date={selectedDate}
        onEditTrip={onEditTrip}
        onConfirmDestination={handleConfirmDestination}
      />

      {/* Recent Activity */}
      {recentTrips.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Recent Activity
          </h3>
          
          <div className="space-y-3">
            {recentTrips.slice(0, 3).map((trip) => (
              <div key={trip.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl mr-3">
                  {trip.mode === 'walk' ? '🚶' : 
                   trip.mode === 'car' ? '🚗' :
                   trip.mode === 'bus' ? '🚌' : '📍'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {trip.origin} → {trip.destination}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(trip.start_time).toLocaleDateString('en-IN')} • 
                    {trip.purpose.charAt(0).toUpperCase() + trip.purpose.slice(1)}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {!trip.is_complete && (
                    <div className="w-2 h-2 bg-orange-400 rounded-full" title="Incomplete" />
                  )}
                  {!trip.is_synced && (
                  <div className="w-2 h-2 bg-orange-400 rounded-full" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Tips */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-yellow-800 mb-2">💡 Quick Tips</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Record trips as soon as possible for better accuracy</li>
          <li>• Use "Not decided yet" if you don't know your destination</li>
          <li>• Enable location services for automatic trip detection</li>
          <li>• Complete incomplete trips to improve data quality</li>
        </ul>
      </div>
    </div>
  );
};