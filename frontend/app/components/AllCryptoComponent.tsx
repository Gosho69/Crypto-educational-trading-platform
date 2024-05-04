"use client";
import React, { useEffect, useState } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import Loading from "../components/loading/loading";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getData();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleBuyClick = (crypto: Crypto) => {
    const { name, price } = crypto;
    router.push(`/all_crypto/buy?name=${name}&price=${price}`);
  };

  return loading ? (
    <Loading />
  ) : (
    <ProtectedRoute>
      <>
        {Object.values(data).map((crypto, index) => (
          <div key={index}>
            <h1>{crypto.name}</h1>
            <p>Price: {parseFloat(crypto.price).toFixed(2)}</p>
            <p>Change: {parseFloat(crypto.change).toFixed(2)}%</p>
            <button onClick={() => handleBuyClick(crypto)}>Buy</button>
          </div>
        ))}
      </>
    </ProtectedRoute>
  );
}

export default AllCrypto;
