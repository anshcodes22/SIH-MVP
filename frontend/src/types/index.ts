export interface User {
  id: string;
  mobile_number: string;
  role: 'user' | 'scientist';
  has_consented: boolean;
  created_at: string;
  updated_at: string;
}

export interface Trip {
  id: string;
  user_id: string;
  origin: string;
  destination: string;
  destination_status: 'decided' | 'not_decided' | 'auto_detected';
  mode: TripMode;
  purpose: TripPurpose;
  purpose_notes?: string;
  start_time: string;
  end_time: string;
  companions_count: number;
  companions_relation?: string;
  companions?: Companion[];
  gps_route?: GpsPoint[];
  is_synced: boolean;
  is_complete: boolean;
  created_at: string;
  updated_at: string;
}

export interface Companion {
  count: number;
  relation: 'family' | 'friends' | 'colleagues' | 'classmates' | 'other';
  notes?: string;
}

export interface GpsPoint {
  latitude: number;
  longitude: number;
  timestamp: string;
  is_stop?: boolean;
  duration_minutes?: number;
}

export type TripMode = 'walk' | 'bike' | 'car' | 'bus' | 'train' | 'metro' | 'auto' | 'motorcycle' | 'taxi' | 'other';

export type TripPurpose = 'work' | 'education' | 'shopping' | 'recreation' | 'healthcare' | 'social' | 'business' | 'leisure' | 'other';

export interface UserConsent {
  id: string;
  user_id: string;
  gps_tracking: boolean;
  data_collection: boolean;
  data_sharing: boolean;
  notifications: boolean;
  consented_at: string;
}

export interface ODMatrix {
  origin: string;
  destination: string;
  count: number;
  mode_distribution: Record<TripMode, number>;
}

export interface TripChain {
  user_id: string;
  date: string;
  trips: Trip[];
  total_distance?: number;
  total_duration?: number;
  incomplete_trips_count: number;
}

export interface TripReminder {
  id: string;
  trip_id: string;
  user_id: string;
  type: 'incomplete_destination' | 'missing_purpose' | 'confirm_auto_detected';
  message: string;
  created_at: string;
  dismissed: boolean;
}