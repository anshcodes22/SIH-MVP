import { useState, useEffect } from 'react';
import { GpsPoint } from '../types';

interface GeolocationState {
  position: GeolocationPosition | null;
  error: GeolocationPositionError | null;
  loading: boolean;
}

export const useGeolocation = (watch: boolean = false) => {
  const [state, setState] = useState<GeolocationState>({
    position: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: {
          code: 0,
          message: 'Geolocation is not supported',
          PERMISSION_DENIED: 1,
          POSITION_UNAVAILABLE: 2,
          TIMEOUT: 3,
        } as GeolocationPositionError,
        loading: false,
      }));
      return;
    }

    const onSuccess = (position: GeolocationPosition) => {
      setState({
        position,
        error: null,
        loading: false,
      });
    };

    const onError = (error: GeolocationPositionError) => {
      setState({
        position: null,
        error,
        loading: false,
      });
    };

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000,
    };

    let watchId: number | undefined;

    if (watch) {
      watchId = navigator.geolocation.watchPosition(onSuccess, onError, options);
    } else {
      navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
    }

    return () => {
      if (watchId !== undefined) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watch]);

  const getCurrentLocation = (): Promise<GpsPoint> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: new Date().toISOString(),
          });
        },
        (error) => reject(error),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    });
  };

  return {
    ...state,
    getCurrentLocation,
  };
};