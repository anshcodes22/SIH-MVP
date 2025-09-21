import React, { useState, useEffect } from 'react';
import { BarChart3, Users, MapPin, Clock, TrendingUp, Download, AlertTriangle, Filter } from 'lucide-react';
import { Trip, TripMode, ODMatrix } from '../../types';

export const ScientistDashboard: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'complete' | 'incomplete' | 'auto_detected'>('all');
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    loadAggregatedData();
  }, [dateRange, filterStatus]);

  const loadAggregatedData = () => {
    setLoading(true);
    
    // Mock data loading - in real app, this would come from API
    setTimeout(() => {
      const mockTrips: Trip[] = [
        {
          id: 'trip_1',
          user_id: 'user_1',
          origin: 'Kochi',
          destination: 'Ernakulam',
          destination_status: 'decided',
          mode: 'bus',
          purpose: 'work',
          start_time: '2025-01-09T09:00:00Z',
          end_time: '2025-01-09T09:30:00Z',
          companions_count: 0,
          is_synced: true,
          is_complete: true,
          created_at: '2025-01-09T09:00:00Z',
          updated_at: '2025-01-09T09:00:00Z',
        },
        {
          id: 'trip_2',
          user_id: 'user_2',
          origin: 'Thiruvananthapuram',
          destination: 'Technopark',
          destination_status: 'decided',
          mode: 'car',
          purpose: 'work',
          start_time: '2025-01-09T08:30:00Z',
          end_time: '2025-01-09T09:00:00Z',
          companions_count: 2,
          companions_relation: 'Colleagues',
          is_synced: true,
          is_complete: true,
          created_at: '2025-01-09T08:30:00Z',
          updated_at: '2025-01-09T08:30:00Z',
        },
        {
          id: 'trip_3',
          user_id: 'user_3',
          origin: 'Kozhikode',
          destination: 'Not decided yet',
          destination_status: 'not_decided',
          mode: 'walk',
          purpose: 'leisure',
          start_time: '2025-01-09T17:00:00Z',
          end_time: '2025-01-09T17:45:00Z',
          companions_count: 1,
          companions_relation: 'Family members',
          is_synced: true,
          is_complete: false,
          created_at: '2025-01-09T17:00:00Z',
          updated_at: '2025-01-09T17:00:00Z',
        },
        {
          id: 'trip_4',
          user_id: 'user_4',
          origin: 'Kottayam',
          destination: 'Auto-detected: Medical College',
          destination_status: 'auto_detected',
          mode: 'auto',
          purpose: 'healthcare',
          start_time: '2025-01-09T14:00:00Z',
          end_time: '2025-01-09T14:30:00Z',
          companions_count: 0,
          is_synced: true,
          is_complete: true,
          created_at: '2025-01-09T14:00:00Z',
          updated_at: '2025-01-09T14:00:00Z',
        },
      ];
      
      setTrips(mockTrips);
      setLoading(false);
    }, 1000);
  };

  const getFilteredTrips = () => {
    switch (filterStatus) {
      case 'complete':
        return trips.filter(trip => trip.is_complete);
      case 'incomplete':
        return trips.filter(trip => !trip.is_complete);
      case 'auto_detected':
        return trips.filter(trip => trip.destination_status === 'auto_detected');
      default:
        return trips;
    }
  };

  const filteredTrips = getFilteredTrips();

  const getModeDistribution = () => {
    const distribution: Record<TripMode, number> = {
      walk: 0, bike: 0, car: 0, bus: 0, train: 0, 
      metro: 0, auto: 0, motorcycle: 0, taxi: 0, other: 0
    };
    
    filteredTrips.forEach(trip => {
      distribution[trip.mode]++;
    });

    return Object.entries(distribution)
      .filter(([_, count]) => count > 0)
      .map(([mode, count]) => ({ mode, count }));
  };

  const getPurposeDistribution = () => {
    const purposes: Record<string, number> = {};
    filteredTrips.forEach(trip => {
      purposes[trip.purpose] = (purposes[trip.purpose] || 0) + 1;
    });

    return Object.entries(purposes).map(([purpose, count]) => ({ purpose, count }));
  };

  const getODMatrix = (): ODMatrix[] => {
    const matrix: Record<string, ODMatrix> = {};
    
    filteredTrips.forEach(trip => {
      // Skip incomplete trips for OD matrix
      if (!trip.is_complete) return;
      
      const key = `${trip.origin}-${trip.destination}`;
      if (!matrix[key]) {
        matrix[key] = {
          origin: trip.origin,
          destination: trip.destination,
          count: 0,
          mode_distribution: {
            walk: 0, bike: 0, car: 0, bus: 0, train: 0,
            metro: 0, auto: 0, motorcycle: 0, taxi: 0, other: 0
          }
        };
      }
      matrix[key].count++;
      matrix[key].mode_distribution[trip.mode]++;
    });

    return Object.values(matrix);
  };

  const handleExport = () => {
    const data = {
      trips: filteredTrips,
      mode_distribution: getModeDistribution(),
      purpose_distribution: getPurposeDistribution(),
      od_matrix: getODMatrix(),
      data_quality: {
        total_trips: trips.length,
        complete_trips: trips.filter(t => t.is_complete).length,
        incomplete_trips: trips.filter(t => !t.is_complete).length,
        auto_detected_trips: trips.filter(t => t.destination_status === 'auto_detected').length,
      },
      date_range: dateRange,
      filter_applied: filterStatus,
      exported_at: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `travel_survey_data_${filterStatus}_${dateRange.start}_to_${dateRange.end}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const modeDistribution = getModeDistribution();
  const purposeDistribution = getPurposeDistribution();
  const odMatrix = getODMatrix();
  const incompleteTrips = trips.filter(trip => !trip.is_complete);
  const autoDetectedTrips = trips.filter(trip => trip.destination_status === 'auto_detected');

  if (loading) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="ml-3 text-gray-600">Loading dashboard data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Travel Analytics Dashboard</h1>
          <p className="text-gray-600">NATPAC Research Portal</p>
        </div>
        
        <button
          onClick={handleExport}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700 mr-2">Trip Status:</span>
          <div className="flex gap-2">
            {[
              { value: 'all', label: 'All Trips' },
              { value: 'complete', label: 'Complete' },
              { value: 'incomplete', label: 'Incomplete' },
              { value: 'auto_detected', label: 'Auto-detected' },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setFilterStatus(filter.value as any)}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  filterStatus === filter.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Data Quality Alert */}
      {incompleteTrips.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <div className="flex items-center mb-2">
            <AlertTriangle className="w-5 h-5 text-orange-600 mr-2" />
            <h3 className="font-medium text-orange-800">Data Quality Notice</h3>
          </div>
          <p className="text-sm text-orange-700">
            {incompleteTrips.length} trip{incompleteTrips.length !== 1 ? 's' : ''} have incomplete information. 
            These may affect the accuracy of aggregated statistics.
          </p>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-500">
                {filterStatus === 'all' ? 'Total Trips' : 'Filtered Trips'}
              </div>
              <div className="text-2xl font-bold text-gray-900">{filteredTrips.length}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-500">Active Users</div>
              <div className="text-2xl font-bold text-gray-900">
                {new Set(filteredTrips.map(t => t.user_id)).size}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${incompleteTrips.length > 0 ? 'bg-orange-100' : 'bg-purple-100'}`}>
              <MapPin className={`w-5 h-5 ${incompleteTrips.length > 0 ? 'text-orange-600' : 'text-purple-600'}`} />
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-500">
                {filterStatus === 'incomplete' ? 'Incomplete' : 'Complete OD Pairs'}
              </div>
              <div className={`text-2xl font-bold ${incompleteTrips.length > 0 && filterStatus === 'incomplete' ? 'text-orange-600' : 'text-gray-900'}`}>
                {filterStatus === 'incomplete' ? incompleteTrips.length : odMatrix.length}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${autoDetectedTrips.length > 0 ? 'bg-blue-100' : 'bg-orange-100'}`}>
              <TrendingUp className={`w-5 h-5 ${autoDetectedTrips.length > 0 ? 'text-blue-600' : 'text-orange-600'}`} />
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-500">Auto-detected</div>
              <div className={`text-2xl font-bold ${autoDetectedTrips.length > 0 ? 'text-blue-600' : 'text-gray-900'}`}>
                {autoDetectedTrips.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mode Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Mode Share</h3>
          <div className="space-y-3">
            {modeDistribution.map(({ mode, count }) => (
              <div key={mode} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-600 rounded-full mr-3" />
                  <span className="text-sm font-medium text-gray-700 capitalize">{mode}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(count / filteredTrips.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Purpose Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Trip Purpose</h3>
          <div className="space-y-3">
            {purposeDistribution.map(({ purpose, count }) => (
              <div key={purpose} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-600 rounded-full mr-3" />
                  <span className="text-sm font-medium text-gray-700 capitalize">{purpose}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${(count / filteredTrips.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* OD Matrix */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Origin-Destination Matrix</h3>
          {filterStatus === 'incomplete' && (
            <span className="text-sm text-orange-600 font-medium">
              Incomplete trips excluded from OD analysis
            </span>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Origin</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Destination</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Trips</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Top Mode</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody>
              {odMatrix.map((od, index) => {
                const topMode = Object.entries(od.mode_distribution)
                  .sort(([,a], [,b]) => b - a)[0];
                
                const hasAutoDetected = filteredTrips.some(trip => 
                  trip.origin === od.origin && 
                  trip.destination === od.destination && 
                  trip.destination_status === 'auto_detected'
                );
                
                return (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{od.origin}</td>
                    <td className="py-3 px-4 text-gray-700">{od.destination}</td>
                    <td className="py-3 px-4 font-semibold text-blue-600">{od.count}</td>
                    <td className="py-3 px-4 capitalize text-gray-700">{topMode[0]}</td>
                    <td className="py-3 px-4">
                      {hasAutoDetected ? (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          Auto-detected
                        </span>
                      ) : (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          Confirmed
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};