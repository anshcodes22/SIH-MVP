import React, { useState } from 'react';
import { LoginForm } from './components/Auth/LoginForm';
import { ConsentFlow } from './components/Consent/ConsentFlow';
import { MobileLayout } from './components/Layout/MobileLayout';
import { UserHome } from './components/Home/UserHome';
import { TripForm } from './components/Trips/TripForm';
import { ScientistDashboard } from './components/Dashboard/ScientistDashboard';
import { UserProfile } from './components/Profile/UserProfile';
import { useAuthProvider, useAuth } from './hooks/useAuth';
import { useTrips } from './hooks/useTrips';
import { AuthContext } from './hooks/useAuth';
import { UserConsent } from './types';

function AppContent() {
  const { user, loading } = useAuth();
  const { addTrip } = useTrips();
  const [currentTab, setCurrentTab] = useState('home');
  const [showConsentFlow, setShowConsentFlow] = useState(false);
  const [editingTrip, setEditingTrip] = useState<any>(null);

  React.useEffect(() => {
    if (user && !user.has_consented) {
      setShowConsentFlow(true);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  if (showConsentFlow) {
    return (
      <ConsentFlow
        onComplete={(consent: UserConsent) => {
          setShowConsentFlow(false);
          setCurrentTab(user.role === 'scientist' ? 'dashboard' : 'home');
        }}
      />
    );
  }

  const handleAddTrip = (tripData: any) => {
    addTrip(tripData);
    setEditingTrip(null);
    setCurrentTab('home');
  };

  const handleEditTrip = (trip: any) => {
    setEditingTrip(trip);
    setCurrentTab('add-trip');
  };

  const renderContent = () => {
    if (user.role === 'scientist') {
      switch (currentTab) {
        case 'dashboard':
        case 'analytics':
          return <ScientistDashboard />;
        case 'profile':
          return <UserProfile />;
        default:
          return <ScientistDashboard />;
      }
    }

    switch (currentTab) {
      case 'home':
        return <UserHome 
          onAddTrip={() => {
            setEditingTrip(null);
            setCurrentTab('add-trip');
          }} 
          onEditTrip={handleEditTrip}
        />;
      case 'add-trip':
        return (
          <TripForm
            onSubmit={handleAddTrip}
            onCancel={() => {
              setEditingTrip(null);
              setCurrentTab('home');
            }}
            editingTrip={editingTrip}
          />
        );
      case 'profile':
        return <UserProfile />;
      default:
        return <UserHome 
          onAddTrip={() => {
            setEditingTrip(null);
            setCurrentTab('add-trip');
          }} 
          onEditTrip={handleEditTrip}
        />;
    }
  };

  return (
    <MobileLayout currentTab={currentTab} onTabChange={setCurrentTab}>
      {renderContent()}
    </MobileLayout>
  );
}

export default function App() {
  const authContextValue = useAuthProvider();

  return (
    <AuthContext.Provider value={authContextValue}>
      <AppContent />
    </AuthContext.Provider>
  );
}