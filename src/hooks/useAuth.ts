import { useEffect, useState } from "react";

const useAuth = (): { isAuthenticated: boolean; loading: boolean } => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    setLoading(false);
  }, []);

  return { isAuthenticated, loading };
};

export default useAuth;
