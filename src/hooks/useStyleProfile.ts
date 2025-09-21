"use client";

import { useState, useEffect, useCallback } from 'react';

const STYLE_PROFILE_KEY = 'ungatekeepStyleProfile';

export function useStyleProfile(): [string, (newProfile: string) => void] {
  const [profile, setProfile] = useState<string>('Your style profile is currently empty. Analyze some outfits to build it!');

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(STYLE_PROFILE_KEY);
      if (item) {
        setProfile(item);
      }
    } catch (error) {
      console.warn(`Error reading localStorage key “${STYLE_PROFILE_KEY}”:`, error);
    }
  }, []);

  const setProfileValue = useCallback((newProfile: string) => {
    try {
      window.localStorage.setItem(STYLE_PROFILE_KEY, newProfile);
      setProfile(newProfile);
    } catch (error) {
      console.warn(`Error setting localStorage key “${STYLE_PROFILE_KEY}”:`, error);
    }
  }, []);

  return [profile, setProfileValue];
}
