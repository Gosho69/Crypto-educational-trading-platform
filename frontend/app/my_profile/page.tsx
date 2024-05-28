"use client";
import React, { useEffect, useState } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import Loading from "../components/loading/loading";
import api from "../api";
import { useRouter } from "next/navigation";

interface UserData {
  username: string;
  email: string;
  credits: number;
}

const MyProfile = () => {
  const [data, setData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.clear();
    router.push("/");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/dashboard/my_profile/");
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <ProtectedRoute>
      <div>
        <h1>{data?.username}</h1>
        <p>{data?.email}</p>
        <p>Credits: {data?.credits}</p>
        <button onClick={logout}>Log out</button>
      </div>
    </ProtectedRoute>
  );
};

export default MyProfile;
