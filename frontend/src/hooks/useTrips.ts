import { useState, useEffect } from 'react';
import { Trip, TripMode, TripPurpose, TripReminder } from '../types';
import { useAuth } from './useAuth';

export const useTrips = () => {
  const { user } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [reminders, setReminders] = useState<TripReminder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadTrips();
      loadReminders();
    }
  }, [user]);

  const loadTrips = () => {
    setLoading(true);
    // Load trips from localStorage (offline storage)
    const storedTrips = localStorage.getItem(`trips_${user?.id}`);
    if (storedTrips) {
      setTrips(JSON.parse(storedTrips));
    }
    setLoading(false);
  };

  const loadReminders = () => {
    const storedReminders = localStorage.getItem(`reminders_${user?.id}`);
    if (storedReminders) {
      setReminders(JSON.parse(storedReminders));
    }
  };

  const saveTrips = (updatedTrips: Trip[]) => {
    setTrips(updatedTrips);
    localStorage.setItem(`trips_${user?.id}`, JSON.stringify(updatedTrips));
    updateReminders(updatedTrips);
  };

  const saveReminders = (updatedReminders: TripReminder[]) => {
    setReminders(updatedReminders);
    localStorage.setItem(`reminders_${user?.id}`, JSON.stringify(updatedReminders));
  };

  const addTrip = (tripData: Omit<Trip, 'id' | 'user_id' | 'is_synced' | 'is_complete' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    const isComplete = tripData.destination_status === 'decided' && 
                      tripData.destination !== 'Not decided yet' && 
                      tripData.purpose !== '';

    const newTrip: Trip = {
      ...tripData,
      id: `trip_${Date.now()}`,
      user_id: user.id,
      is_synced: false,
      is_complete: isComplete,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const updatedTrips = [...trips, newTrip];
    saveTrips(updatedTrips);
    
    return newTrip.id;
  };

  const updateTrip = (tripId: string, updates: Partial<Trip>) => {
    const isComplete = updates.destination_status === 'decided' && 
                      updates.destination !== 'Not decided yet' && 
                      updates.purpose !== '';

    const updatedTrips = trips.map(trip =>
      trip.id === tripId
        ? { 
            ...trip, 
            ...updates, 
            is_complete: isComplete !== undefined ? isComplete : trip.is_complete,
            updated_at: new Date().toISOString(), 
            is_synced: false 
          }
        : trip
    );
    saveTrips(updatedTrips);
  };

  const deleteTrip = (tripId: string) => {
    const updatedTrips = trips.filter(trip => trip.id !== tripId);
    saveTrips(updatedTrips);
    
    // Remove related reminders
    const updatedReminders = reminders.filter(reminder => reminder.trip_id !== tripId);
    saveReminders(updatedReminders);
  };

  const getTripsByDate = (date: string) => {
    return trips.filter(trip => 
      typeof trip.start_time === 'string' && trip.start_time.startsWith(date)
    ).sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
  };

  const getIncompleteTrips = () => {
    return trips.filter(trip => !trip.is_complete);
  };

  const updateReminders = (currentTrips: Trip[]) => {
    if (!user) return;

    const newReminders: TripReminder[] = [];
    
    currentTrips.forEach(trip => {
      if (!trip.is_complete) {
        if (trip.destination_status === 'not_decided' || trip.destination === 'Not decided yet') {
          newReminders.push({
            id: `reminder_${trip.id}_destination`,
            trip_id: trip.id,
            user_id: user.id,
            type: 'incomplete_destination',
            message: `Please confirm your destination for the trip from ${trip.origin}`,
            created_at: new Date().toISOString(),
            dismissed: false,
          });
        }
        
        if (trip.destination_status === 'auto_detected') {
          newReminders.push({
            id: `reminder_${trip.id}_confirm`,
            trip_id: trip.id,
            user_id: user.id,
            type: 'confirm_auto_detected',
            message: `Please confirm the auto-detected destination: ${trip.destination}`,
            created_at: new Date().toISOString(),
            dismissed: false,
          });
        }
      }
    });

    // Filter out dismissed reminders and add new ones
    const existingReminders = reminders.filter(r => r.dismissed);
    const allReminders = [...existingReminders, ...newReminders];
    saveReminders(allReminders);
  };

  const dismissReminder = (reminderId: string) => {
    const updatedReminders = reminders.map(reminder =>
      reminder.id === reminderId ? { ...reminder, dismissed: true } : reminder
    );
    saveReminders(updatedReminders);
  };

  const detectStopPoint = async (gpsPoints: any[], currentLocation: any) => {
    // Mock stop point detection logic
    // In real implementation, this would analyze GPS points for stationary periods
    const lastPoint = gpsPoints[gpsPoints.length - 1];
    if (lastPoint && currentLocation) {
      const timeDiff = new Date().getTime() - new Date(lastPoint.timestamp).getTime();
      const stationaryTime = timeDiff / (1000 * 60); // minutes
      
      if (stationaryTime >= 5) {
        return {
          detected: true,
          location: `${currentLocation.latitude.toFixed(4)}, ${currentLocation.longitude.toFixed(4)}`,
          duration: Math.round(stationaryTime),
        };
      }
    }
    return { detected: false };
  };

  const syncTrips = async () => {
    // Mock sync - in real app, this would sync with backend
    const unsyncedTrips = trips.filter(trip => !trip.is_synced);
    console.log(`Syncing ${unsyncedTrips.length} trips...`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mark all trips as synced
    const syncedTrips = trips.map(trip => ({ ...trip, is_synced: true }));
    saveTrips(syncedTrips);
  };

  return {
    trips,
    reminders: reminders.filter(r => !r.dismissed),
    loading,
    addTrip,
    updateTrip,
    deleteTrip,
    getTripsByDate,
    getIncompleteTrips,
    dismissReminder,
    detectStopPoint,
    syncTrips,
  };
};