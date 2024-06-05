"use client";
import React, { use, useEffect, useState } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import Loading from "../components/loading/loading";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "../components/Navbar";

interface Crypto {
  id: string;
  name: string;
  change: string;
  price: string;
}

async function getData(): Promise<{ [key: string]: Crypto }> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}dashboard/all_crypto/`,
    {
      next: {
        revalidate: 5,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await res.json();
  return data.data;
}

function AllCrypto() {
  const [data, setData] = useState<{ [key: string]: Crypto }>({});
  const [loading, setLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getData();
        setData(result);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
      if(success){
        setShowSuccessMessage(true);
        const timer = setTimeout(() => {
          setShowSuccessMessage(false);
          router.replace('/all_crypto', undefined);
        }, 10000);
        return () => clearTimeout(timer);
      }
  }, [success, router])

  const handleBuyClick = (crypto: Crypto) => {
    const { name, price } = crypto;
    router.push(`/all_crypto/buy?name=${name}&price=${price}`);
  };

  const capitalize = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return loading ? (
    <Loading />
  ) : (
    <ProtectedRoute>
      <Navbar />
      <div className="container-fluid">
        <div className="profile-wrapper">
          {showSuccessMessage && (
            <div className="alert alert-success">
              Crypto bought successfully!
            </div>
          )}
          <h1 className="welcome-text">All Crypto</h1>
          <table className="table custom-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Change</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(data).map((crypto, index) => (
                <tr key={index}>
                  <td>{capitalize(crypto.name)}</td>
                  <td>{parseFloat(crypto.price).toFixed(2)}</td>
                  <td>{parseFloat(crypto.change).toFixed(2)}%</td>
                  <td>
                    <button onClick={() => handleBuyClick(crypto)}>Buy</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default AllCrypto;
