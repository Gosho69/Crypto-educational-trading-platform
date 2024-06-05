import React, { useEffect, useState } from "react";
import Loading from "../components/loading/loading";
import api from "../api";
import ProtectedRoute from "../components/ProtectedRoute";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "../components/Navbar";

interface CryptoData {
  name: string;
  amount: string;
}

async function getData(): Promise<CryptoData[]> {
  try {
    const response = await api.get("/dashboard/mycrypto/");
    const cryptoData: CryptoData[] = Object.entries(response.data.cryptos).map(
      ([name, amount]) => ({
        name,
        amount: amount as string,
      })
    );
    return cryptoData;
  } catch {
    throw new Error(`Error fetching data`);
  }
}

function CryptoBalancesComponent() {
  const [data, setData] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState(false);
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
    if (success) {
      setSuccessMessage(true);
      const timer = setTimeout(() => {
        setSuccessMessage(false);
        router.replace("/my_crypto", undefined);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [success, router]);

  const handleSellClick = (crypto: CryptoData) => {
    const { name, amount } = crypto;
    router.push(`/my_crypto/sell?name=${name}&amount=${amount}`);
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
          {successMessage && (
            <div className="alert alert-success">Successfully sold crypto!</div>
          )}
          <h1 className="welcome-text">Crypto Balances</h1>
          {data.length === 0 ? (
            <h1 className="welcome-text">
              You don't have any cryptocurrencies yet.
            </h1>
          ) : (
            <table className="table custom-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Amount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((crypto, index) => (
                  <tr key={index}>
                    <td>{capitalize(crypto.name)}</td>
                    <td>{crypto.amount}</td>
                    <td>
                      <button
                        onClick={() => handleSellClick(crypto)}
                        className="btn btn-dark"
                      >
                        Withdraw
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default CryptoBalancesComponent;
