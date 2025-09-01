import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface RoleGuardProps {
  allowedRoles: string[];
  children: React.ReactElement; // 👈 must be element, not just node
}

const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [user, setUser] = useState<{ id: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      setLoading(false);
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    if (!parsedUser?.id) {
      setLoading(false);
      return;
    }

    const verifyUserRole = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/auth/user/${parsedUser.id}`, {
          withCredentials: true,
        });
        console.log(data.user.role)
        setUser({ id: data.user.id, role: data.user.role });
      } catch {
        toast.error("Could not verify role");
      } finally {
        setLoading(false);
      }
    };

    verifyUserRole();
  }, [API_URL]);

if (loading) return null;

if (user && !allowedRoles.includes(user.role)) {
  return React.cloneElement(children as React.ReactElement, {
    onClick: (e: React.MouseEvent) => {
      e.preventDefault(); // stop default behavior
      e.stopPropagation(); // stop bubbling
      toast.error("Access denied: You are not authorized");
      // ❌ do NOT call child's original onClick
    },
  });
}

// ✅ If allowed → preserve child’s original onClick
return React.cloneElement(children as React.ReactElement, {
  onClick: (e: React.MouseEvent) => {
    const childOnClick = (children as any).props?.onClick;
    if (childOnClick) {
      childOnClick(e); // run original click if defined
    }
  },
});
}
export default RoleGuard
    