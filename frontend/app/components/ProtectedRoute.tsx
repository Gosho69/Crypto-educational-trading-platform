import { redirect } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import { useEffect, useState } from "react";
import Loading from "./loading/loading";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isAuthorised, setIsAuthorised] = useState<boolean | null>(null);

  useEffect(() => {
    auth().catch(() => setIsAuthorised(false)); // Perform initial authorization check
  }, []);

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    try {
      const res = await api.post("/token/refresh/", {
        refresh: refreshToken,
      });
      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        setIsAuthorised(true);
      } else {
        setIsAuthorised(false);
      }
    } catch (e) {
      console.error(e);
      setIsAuthorised(false);
    }
  };

  const auth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setIsAuthorised(false);
      return;
    }
    try {
      const decoded: any = jwtDecode(token);
      if (!decoded || typeof decoded.exp !== "number") {
        setIsAuthorised(false);
        return;
      }
      const tokenExpiration = decoded.exp;
      const now = Date.now() / 1000;
      if (tokenExpiration < now) {
        await refreshToken();
      } else {
        setIsAuthorised(true);
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      setIsAuthorised(false);
    }
  };

  if (isAuthorised === null) {
    return <Loading />;
  }

  return isAuthorised ? children : redirect("/login");
}

export default ProtectedRoute;
