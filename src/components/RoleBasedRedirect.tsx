
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '@/types/roles';

interface RoleBasedRedirectProps {
  userRole: UserRole | null;
  isLoading: boolean;
}

const RoleBasedRedirect: React.FC<RoleBasedRedirectProps> = ({ userRole, isLoading }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading || !userRole) return;

    const currentPath = window.location.pathname;
    
    // Redirect based on role
    switch (userRole) {
      case 'admin':
        if (!currentPath.startsWith('/admin')) {
          navigate('/admin/dashboard');
        }
        break;
      case 'teacher':
        if (!currentPath.startsWith('/teacher')) {
          navigate('/teacher/dashboard');
        }
        break;
      case 'student':
        if (!currentPath.startsWith('/student')) {
          navigate('/student/dashboard');
        }
        break;
      case 'parent':
        if (!currentPath.startsWith('/dashboard') && currentPath !== '/') {
          navigate('/dashboard');
        }
        break;
      default:
        navigate('/login');
    }
  }, [userRole, isLoading, navigate]);

  return null;
};

export default RoleBasedRedirect;
