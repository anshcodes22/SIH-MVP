export interface Trip {
  id: string;
  startLocation: string;
  endLocation: string;
  mode: 'Car' | 'Metro' | 'Bus' | 'Walking';
  distance: number; // in km
  timestamp: string;
}