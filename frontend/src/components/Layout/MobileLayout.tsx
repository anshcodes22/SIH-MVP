import React, { ReactNode } from 'react';
import { Home, Plus, BarChart3, User, Menu } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface MobileLayoutProps {
  children: ReactNode;
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({ 
  children, 
  currentTab, 
  onTabChange 
}) => {
  const { user } = useAuth();

  const userTabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'add-trip', label: 'Add Trip', icon: Plus },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const scientistTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'analytics', label: 'Analytics', icon: Menu },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const tabs = user?.role === 'scientist' ? scientistTabs : userTabs;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-4">
          <h1 className="text-xl font-semibold text-gray-900">
            {user?.role === 'scientist' ? 'NATPAC Travel Survey' : 'Travel Survey'}
          </h1>
          {user?.role === 'scientist' && (
            <p className="text-sm text-gray-500">Scientist Portal</p>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                currentTab === id
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon size={20} />
              <span className="text-xs mt-1 font-medium">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};