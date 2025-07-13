
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserRole, UserProfile } from '@/types/roles';
import { User } from '@supabase/supabase-js';

export const useUserRole = (user: User | null) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setUserProfile(null);
      setIsLoading(false);
      return;
    }

    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
          setError(error.message);
          // Fallback: create a default parent profile if none exists
          const defaultProfile: UserProfile = {
            id: user.id,
            email: user.email || '',
            first_name: '',
            last_name: '',
            role: 'parent',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          setUserProfile(defaultProfile);
        } else {
          // Add role if not present (for existing users) - safely handle missing role property
          const profileWithRole: UserProfile = {
            ...data,
            role: (data as any).role || 'parent', // Safe type assertion for role property
          };
          setUserProfile(profileWithRole);
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Erreur lors du chargement du profil');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  return { userProfile, isLoading, error };
};
