import React from 'react';
import { MapPin, Clock, Users, Edit3, Trash2, AlertCircle, CheckCircle, MessageSquare } from 'lucide-react';
import { Trip } from '../../types';

interface TripTimelineProps {
  trips: Trip[];
  date: string;
  onEditTrip?: (trip: Trip) => void;
  onDeleteTrip?: (tripId: string) => void;
  onConfirmDestination?: (tripId: string, destination: string) => void;
}

const modeEmojis: Record<string, string> = {
  walk: '🚶',
  bike: '🚴',
  car: '🚗',
  bus: '🚌',
  train: '🚊',
  metro: '🚇',
  auto: '🛺',
  motorcycle: '🏍️',
  taxi: '🚕',
  other: '❓',
};

const purposeLabels: Record<string, string> = {
  work: 'Work/Office',
  education: 'Education',
  shopping: 'Shopping',
  recreation: 'Recreation',
  leisure: 'Other/Leisure',
  healthcare: 'Healthcare',
  social: 'Social/Visiting',
  business: 'Business',
  other: 'Other',
};

export const TripTimeline: React.FC<TripTimelineProps> = ({ 
  trips, 
  date, 
  onEditTrip, 
  onDeleteTrip,
  onConfirmDestination
}) => {
  const [confirmingTrip, setConfirmingTrip] = React.useState<string | null>(null);
  const [newDestination, setNewDestination] = React.useState('');

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (trip: Trip) => {
    if (!trip.is_complete) return 'text-orange-600 bg-orange-50';
    if (trip.destination_status === 'auto_detected') return 'text-blue-600 bg-blue-50';
    return 'text-green-600 bg-green-50';
  };

  const getStatusIcon = (trip: Trip) => {
    if (!trip.is_complete) return <AlertCircle className="w-3 h-3" />;
    if (trip.destination_status === 'auto_detected') return <Clock className="w-3 h-3" />;
    return <CheckCircle className="w-3 h-3" />;
  };

  const getStatusText = (trip: Trip) => {
    if (!trip.is_complete) return 'Incomplete';
    if (trip.destination_status === 'auto_detected') return 'Auto-detected';
    return 'Confirmed';
  };

  const handleConfirmDestination = (tripId: string) => {
    if (onConfirmDestination && newDestination.trim()) {
      onConfirmDestination(tripId, newDestination.trim());
      setConfirmingTrip(null);
      setNewDestination('');
    }
  };

  if (trips.length === 0) {
    return (
      <div className="p-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="text-4xl mb-3">📅</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No trips recorded</h3>
          <p className="text-gray-600">Start adding your trips for {formatDate(date)}</p>
        </div>
      </div>
    );
  }

  const incompleteTrips = trips.filter(trip => !trip.is_complete);
  const completeTrips = trips.filter(trip => trip.is_complete);

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">{formatDate(date)}</h2>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>{trips.length} trip{trips.length !== 1 ? 's' : ''} recorded</span>
          {incompleteTrips.length > 0 && (
            <span className="text-orange-600 font-medium">
              {incompleteTrips.length} incomplete
            </span>
          )}
        </div>
      </div>

      {/* Incomplete Trips Alert */}
      {incompleteTrips.length > 0 && (
        <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-xl">
          <div className="flex items-center mb-2">
            <AlertCircle className="w-5 h-5 text-orange-600 mr-2" />
            <h3 className="font-medium text-orange-800">Incomplete Trips</h3>
          </div>
          <p className="text-sm text-orange-700">
            You have {incompleteTrips.length} trip{incompleteTrips.length !== 1 ? 's' : ''} with missing information. 
            Please complete them for better data accuracy.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {trips.map((trip, index) => (
          <div
            key={trip.id}
            className={`bg-white rounded-xl shadow-sm border overflow-hidden ${
              trip.is_complete ? 'border-gray-200' : 'border-orange-200'
            }`}
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="text-2xl mr-3">{modeEmojis[trip.mode] || '❓'}</div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Trip {index + 1}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatTime(trip.start_time)} - {formatTime(trip.end_time)}
                    </div>
                  </div>
                </div>
                
                {/* Trip Status */}
                {!trip.is_synced && (
                  <>
                    <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(trip)}`}>
                      {getStatusIcon(trip)}
                      <span className="ml-1">{getStatusText(trip)}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-orange-400 rounded-full mr-2" />
                      <span className="text-xs text-orange-600">Not synced</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Route */}
              <div className="flex items-start mb-4">
                <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {trip.origin}
                  </div>
                  <div className="flex items-center my-1">
                    <div className="w-4 border-t border-dashed border-gray-300" />
                    <div className="text-xs text-gray-500 px-2">to</div>
                    <div className="w-4 border-t border-dashed border-gray-300" />
                  </div>
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {trip.destination}
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Purpose</div>
                  <div className="text-sm font-medium text-gray-900">
                    {purposeLabels[trip.purpose] || trip.purpose}
                  </div>
                </div>
                {trip.companions_count > 0 && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Companions</div>
                    <div className="flex items-center text-xs">
                      <Users className="w-3 h-3 mr-1" />
                      <span className="text-orange-600">Not synced</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Destination Confirmation */}
              {trip.destination === 'Not decided yet' && confirmingTrip === trip.id && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <label className="block text-sm font-medium text-blue-800 mb-2">
                    Confirm your destination:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newDestination}
                      onChange={(e) => setNewDestination(e.target.value)}
                      placeholder="Enter destination"
                      className="flex-1 px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <button
                      onClick={() => handleConfirmDestination(trip.id)}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setConfirmingTrip(null)}
                      className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Notes */}
              {trip.purpose_notes && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start">
                    <MessageSquare className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Notes</div>
                      <div className="text-sm text-gray-700">{trip.purpose_notes}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-gray-100">
                {trip.destination === 'Not decided yet' && confirmingTrip !== trip.id && (
                  <button
                    onClick={() => setConfirmingTrip(trip.id)}
                    className="flex-1 flex items-center justify-center px-3 py-2 text-sm text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                  >
                    <Target className="w-4 h-4 mr-1" />
                    Confirm Destination
                  </button>
                )}
                
                {(onEditTrip || onDeleteTrip) && (
                  <>
                  {onEditTrip && (
                    <button
                      onClick={() => onEditTrip(trip)}
                      className="flex-1 flex items-center justify-center px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4 mr-1" />
                      Edit
                    </button>
                  )}
                  {onDeleteTrip && (
                    <button
                      onClick={() => onDeleteTrip(trip.id)}
                      className="flex-1 flex items-center justify-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </button>
                  )}
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};