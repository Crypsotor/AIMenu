
import { useState, useEffect, useCallback } from 'react';
import { UserProfile } from '../types';

const PROFILES_STORAGE_KEY = 'ai_meal_planner_profiles';
const ACTIVE_PROFILE_STORAGE_KEY = `${PROFILES_STORAGE_KEY}_active`;

const useProfiles = () => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedProfiles = localStorage.getItem(PROFILES_STORAGE_KEY);
      if (storedProfiles) {
        setProfiles(JSON.parse(storedProfiles));
      }
      const storedActiveId = localStorage.getItem(ACTIVE_PROFILE_STORAGE_KEY);
      if (storedActiveId) {
        setActiveProfileId(storedActiveId);
      }
    } catch (error) {
      console.error('Failed to parse profiles from localStorage', error);
      localStorage.removeItem(PROFILES_STORAGE_KEY);
      localStorage.removeItem(ACTIVE_PROFILE_STORAGE_KEY);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const saveProfiles = useCallback((newProfiles: UserProfile[]) => {
    setProfiles(newProfiles);
    localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(newProfiles));
  }, []);

  const selectActiveProfile = useCallback((profileId: string) => {
    setActiveProfileId(profileId);
    localStorage.setItem(ACTIVE_PROFILE_STORAGE_KEY, profileId);
  }, []);

  // Ensure an active profile is always selected if possible.
  // This is the core fix to prevent states where no profile is active.
  useEffect(() => {
    if (isLoaded && profiles.length > 0) {
      const activeProfileIsValid = profiles.some(p => p.id === activeProfileId);
      if (!activeProfileIsValid) {
        // If the current activeProfileId is not valid (or null), set the first profile as active.
        selectActiveProfile(profiles[0].id);
      }
    }
  }, [isLoaded, profiles, activeProfileId, selectActiveProfile]);


  const addProfile = useCallback((profile: Omit<UserProfile, 'id'>) => {
    const newProfile = { ...profile, id: `profile_${Date.now()}` };
    const updatedProfiles = [...profiles, newProfile];
    saveProfiles(updatedProfiles);
    // If it's the first profile, make it active
    if (profiles.length === 0) {
      selectActiveProfile(newProfile.id);
    }
    return newProfile;
  }, [profiles, saveProfiles, selectActiveProfile]);


  const updateProfile = useCallback((updatedProfile: UserProfile) => {
    const updatedProfiles = profiles.map(p => p.id === updatedProfile.id ? updatedProfile : p);
    saveProfiles(updatedProfiles);
  }, [profiles, saveProfiles]);

  const deleteProfile = useCallback((profileId: string) => {
    const updatedProfiles = profiles.filter(p => p.id !== profileId);
    saveProfiles(updatedProfiles);
    if (activeProfileId === profileId) {
      const newActiveId = updatedProfiles[0]?.id || null;
      setActiveProfileId(newActiveId);
      if (newActiveId) {
        selectActiveProfile(newActiveId);
      } else {
        localStorage.removeItem(ACTIVE_PROFILE_STORAGE_KEY);
      }
    }
  }, [profiles, saveProfiles, activeProfileId, selectActiveProfile]);
  
  const activeProfile = profiles.find(p => p.id === activeProfileId) || null;

  return { profiles, addProfile, updateProfile, deleteProfile, activeProfile, selectActiveProfile, isLoaded };
};

export default useProfiles;
