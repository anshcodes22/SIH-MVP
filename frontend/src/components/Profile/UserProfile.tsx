import React from 'react';
import { User, Phone, Shield, LogOut, Wifi, WifiOff } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTrips } from '../../hooks/useTrips';

export const UserProfile: React.FC = () => {
  const { user, signOut } = useAuth();
  const { trips, syncTrips } = useTrips();
  const [syncing, setSyncing] = React.useState(false);

  const unsyncedTrips = trips.filter(trip => !trip.is_synced);

  const handleSync = async () => {
    setSyncing(true);
    try {
      await syncTrips();
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setSyncing(false);
    }
  };

  const handleSignOut = async () => {
    if (confirm('Are you sure you want to sign out?')) {
      await signOut();
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="p-3 bg-blue-100 rounded-full">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {user?.role === 'scientist' ? 'NATPAC Scientist' : 'Survey Participant'}
            </h2>
            <div className="flex items-center text-gray-600">
              <Phone className="w-4 h-4 mr-1" />
              +91 {user?.mobile_number}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Card */}
      {user?.role === 'user' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Activity</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{trips.length}</div>
              <div className="text-sm text-gray-600">Total Trips</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {trips.length - unsyncedTrips.length}
              </div>
              <div className="text-sm text-gray-600">Synced Trips</div>
            </div>
          </div>
        </div>
      )}

      {/* Sync Status */}
      {user?.role === 'user' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Sync</h3>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              {unsyncedTrips.length > 0 ? (
                <WifiOff className="w-5 h-5 text-orange-600 mr-2" />
              ) : (
                <Wifi className="w-5 h-5 text-green-600 mr-2" />
              )}
              <span className="text-gray-700">
                {unsyncedTrips.length > 0 
                  ? `${unsyncedTrips.length} trips pending sync`
                  : 'All trips synced'
                }
              </span>
            </div>
            
            {unsyncedTrips.length > 0 && (
              <button
                onClick={handleSync}
                disabled={syncing}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center"
              >
                {syncing ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Sync Now'
                )}
              </button>
            )}
          </div>

          <div className="text-sm text-gray-600">
            Your trip data is stored locally and synchronized with our secure servers when you have internet connectivity.
          </div>
        </div>
      )}

      {/* Consent Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy & Consent</h3>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Shield className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-gray-700">
              {user?.has_consented ? 'Consent provided' : 'Consent pending'}
            </span>
          </div>
          <div className="text-sm text-gray-500">
            {user?.has_consented ? 'Active' : 'Required'}
          </div>
        </div>

        <div className="mt-3 text-sm text-gray-600">
          Your data is anonymized and used only for transportation research. 
          Personal information is never shared.
        </div>
      </div>

      {/* Language Settings */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Language</h3>
        
        <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option value="en">English</option>
          <option value="hi" disabled>हिंदी (Coming soon)</option>
          <option value="ml" disabled>മലയാളം (Coming soon)</option>
          <option value="ta" disabled>தமிழ் (Coming soon)</option>
        </select>
      </div>

      {/* Sign Out */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Sign Out
        </button>
      </div>
    </div>
  );
};