import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string | string[];
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, isAuthenticated, loading } = useAuth(); // now includes localStorage loading
  const navigate = useNavigate();
  const { toast } = useToast();
  const [checkingRole, setCheckingRole] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (loading) return; // wait until auth state is ready

    if (!user?.id) {
      toast({
        title: "Error",
        description: "Could not verify your access. Redirecting...",
        variant: "destructive",
      });
      navigate('/');
      return;
    }

    const verifyUserRole = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/auth/user/${user.id}`, {
          withCredentials: true,
        });

        const userRole = data?.user?.role || 'user';

        if (requiredRole) {
          const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
          if (!allowedRoles.includes(userRole)) {
            toast({
              title: "Access Denied",
              description: "You are not authorized to access this resource.",
              variant: "destructive",
            });
            navigate('/');
            return;
          }
        }
      } catch (error) {
        console.error("Role check failed:", error);
        toast({
          title: "Error",
          description: "Could not verify your access. Redirecting...",
          variant: "destructive",
        });
        navigate('/');
      } finally {
        setCheckingRole(false);
      }
    };

    verifyUserRole();
  }, [user, loading, requiredRole, navigate, toast, API_URL]);

  if (loading || checkingRole) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Checking access...
      </div>
    );
  }

  return <>{children}</>;
};


