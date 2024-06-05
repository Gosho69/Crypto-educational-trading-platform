"use client";
import React, { useEffect, useState } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import Loading from "../components/loading/loading";
import api from "../api";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";

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
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <ProtectedRoute>
      <Navbar />
      <div className="container-fluid">
        <div className="profile-wrapper">
          <h1 className="welcome-text">Welcome, {data?.username}!</h1>
          <form className="form-container">
            <p>{data?.email}</p>
            <p>Credits: {data?.credits}</p>
            <button onClick={logout} className="btn btn-dark w-100">
              Log out
            </button>
          </form>
          <h2 className="text-profile">Ready to learn new things?</h2>
          <button className="btn btn-dark ">Start Buying Crypto</button>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default MyProfile;
