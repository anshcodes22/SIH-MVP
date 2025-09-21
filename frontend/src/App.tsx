import React, { useState } from 'react';
import { AddTrip } from './components/AddTrip';
import { Dashboard } from './components/Dashboard';
import { Navigation } from './components/Navigation';
import { Trip } from './types';

// Pre-populated trips
const initialTrips: Trip[] = [
  {
    id: '1',
    startLocation: 'Delhi',
    endLocation: 'Jaipur',
    mode: 'Car',
    distance: 268,
    timestamp: new Date('2025-01-08T09:30:00').toISOString(),
  },
  {
    id: '2',
    startLocation: 'Guru Tegh Bahadur Institute, Subhash Nagar',
    endLocation: 'Noida',
    mode: 'Metro',
    distance: 32,
    timestamp: new Date('2025-01-08T14:15:00').toISOString(),
  },
  {
    id: '3',
    startLocation: 'Connaught Place',
    endLocation: 'Karol Bagh',
    mode: 'Bus',
    distance: 8,
    timestamp: new Date('2025-01-09T11:45:00').toISOString(),
  },
];

export default function App() {
  const [currentTab, setCurrentTab] = useState<'add-trip' | 'dashboard'>('dashboard');
  const [trips, setTrips] = useState<Trip[]>(initialTrips);

  const addTrip = (trip: Trip) => {
    setTrips(prev => [trip, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-4">
          <h1 className="text-xl font-semibold text-gray-900">Trip Tracker</h1>
          <p className="text-sm text-gray-500">Auto-detect your journeys</p>
        </div>
      </header>

      {/* Content */}
      <main className="pb-20">
        {currentTab === 'add-trip' ? (
          <AddTrip onTripAdded={addTrip} />
        ) : (
          <Dashboard trips={trips} />
        )}
      </main>

      {/* Bottom Navigation */}
      <Navigation currentTab={currentTab} onTabChange={setCurrentTab} />
    </div>
  );
}