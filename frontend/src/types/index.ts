// Original survey types
export type TripMode = 'walk' | 'bike' | 'car' | 'bus' | 'train' | 'metro' | 'auto' | 'motorcycle' | 'taxi' | 'other';

export interface Trip {
  id: string;
  user_id: string;
  origin: string;
  destination: string;
  destination_status: 'decided' | 'not_decided' | 'auto_detected';
  mode: TripMode;
  purpose: string;
  start_time: string;
  end_time: string;
  companions_count: number;
  companions_relation?: string;
  is_synced: boolean;
  is_complete: boolean;
  created_at: string;
  updated_at: string;
}

export interface ODMatrix {
  origin: string;
  destination: string;
  count: number;
  mode_distribution: Record<TripMode, number>;
}

// New simple trip tracking types
export interface SimpleTrip {
  id: string;
  startLocation: string;
  endLocation: string;
  mode: 'Car' | 'Metro' | 'Bus' | 'Walking';
  distance: number; // in km
  timestamp: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'participant' | 'scientist';
  interests?: string[];
  created_at: string;
}