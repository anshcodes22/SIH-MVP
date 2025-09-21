import React, { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { UserProfile } from './components/UserProfile';
import { ScientistDashboard } from './components/Dashboard/ScientistDashboard';
import { AddTrip } from './components/AddTrip';
import { Dashboard } from './components/Dashboard';
import { Navigation } from './components/Navigation';
import { SimpleTrip, User } from './types';

// Pre-populated trips for the simple dashboard
const initialTrips: SimpleTrip[] = [
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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'login' | 'profile' | 'scientist-dashboard' | 'trip-tracker'>('login');
  const [currentTab, setCurrentTab] = useState<'add-trip' | 'dashboard'>('dashboard');
  const [trips, setTrips] = useState<SimpleTrip[]>(initialTrips);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'scientist') {
      setCurrentView('scientist-dashboard');
    } else {
      setCurrentView('trip-tracker');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('login');
  };

  const addTrip = (trip: SimpleTrip) => {
    setTrips(prev => [trip, ...prev]);
  };

  const handleViewChange = (view: 'profile' | 'scientist-dashboard' | 'trip-tracker') => {
    setCurrentView(view);
  };

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (currentView === 'profile') {
    return (
      <UserProfile 
        user={currentUser} 
        onBack={() => setCurrentView(currentUser.role === 'scientist' ? 'scientist-dashboard' : 'trip-tracker')}
        onLogout={handleLogout}
      />
    );
  }

  if (currentView === 'scientist-dashboard') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header with navigation */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">NATPAC Research Portal</h1>
              <p className="text-sm text-gray-500">Travel Survey Analytics</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleViewChange('profile')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-gray-700"
              >
                Logout
              </button>
            </div>
          </div>
        </header>
        <ScientistDashboard />
      </div>
    );
  }

  // Trip Tracker View (for participants)
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Trip Tracker</h1>
            <p className="text-sm text-gray-500">Auto-detect your journeys</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleViewChange('profile')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-600 hover:text-gray-700"
            >
              Logout
            </button>
          </div>
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