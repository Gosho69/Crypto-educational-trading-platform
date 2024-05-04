import React, { useEffect, useState } from "react";
import Loading from "@/app/components/loading/loading";
import api from "@/app/api";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

const SellCrypto = () => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();

  const name = searchParams.get("name");
  const amount1 = searchParams.get("amount");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await api.post(`/dashboard/mycrypto/${name}/`, {
        amount,
      });
      console.log(response.data);
    } catch (error) {
      console.error("Error selling crypto:", error);
    } finally {
      setLoading(false);
      router.push("/my_crypto");
    }
  };

  useEffect(() => {
    if (name) {
      setLoading(false);
    }
  }, [name]);

  return loading ? (
    <Loading />
  ) : (
    <ProtectedRoute>
      <div>
        <h1>Sell {name}</h1>
        <p>Amount you have: {amount1}</p>
        <form onSubmit={handleSubmit}>
          <label>
            Amount:
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </label>
          <button type="submit">Sell</button>
        </form>
      </div>
    </ProtectedRoute>
  );
};
export default SellCrypto;
