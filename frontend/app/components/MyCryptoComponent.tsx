import React, { useEffect, useState } from "react";
import Loading from "../components/loading/loading";
import api from "../api";
import ProtectedRoute from "../components/ProtectedRoute";
import { useRouter } from "next/navigation";

interface CryptoData {
  name: string;
  amount: number;
}

async function getData(): Promise<CryptoData[]> {
  try {
    const response = await api.get("/dashboard/mycrypto/");
    const cryptoData: CryptoData[] = Object.entries(response.data.cryptos).map(
      ([name, amount]) => ({
        name,
        amount:
          typeof amount === "number" ? amount : parseFloat(amount as string),
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

  const handleSellClick = (crypto: CryptoData) => {
    const { name, amount } = crypto;
    router.push(`/my_crypto/sell?name=${name}&amount=${amount}`);
  };

  return loading ? (
    <Loading />
  ) : (
    <ProtectedRoute>
      <div>
        <h1>Crypto Balances</h1>
        {data.length === 0 ? (
          <p>You don't have any cryptocurrencies yet.</p>
        ) : (
          <ul>
            {data.map((crypto, index) => (
              <li key={index}>
                {crypto.name}: {crypto.amount}
                <button onClick={() => handleSellClick(crypto)}>
                  Withdraw
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </ProtectedRoute>
  );
}

export default CryptoBalancesComponent;
