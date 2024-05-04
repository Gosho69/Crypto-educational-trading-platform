import React, { useEffect, useState } from "react";
import Loading from "@/app/components/loading/loading";
import api from "@/app/api";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

const BuyCryptoComponent = () => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState(0);
  const searchParams = useSearchParams();
  const router = useRouter();

  const name = searchParams.get("name");
  const price = parseFloat(searchParams.get("price") || "0");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await api.post(`/dashboard/all_crypto/${name}/`, {
        amount,
      });
      console.log(response.data);
    } catch (error) {
      console.error("Error selling crypto:", error);
    } finally {
      setLoading(false);
      router.push("/all_crypto");
    }
  };

  useEffect(() => {
    const amountFloat = parseFloat(amount);
    if (amount.trim() === "" || Number.isNaN(amountFloat)) {
      setTotalPrice(0);
    } else {
      setTotalPrice(amountFloat * price);
    }
  }, [amount, price]);

  useEffect(() => {
    if (name) {
      setLoading(false);
    }
  }, [name]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push("/all_crypto");
    }, 20000); // 20 seconds
    return () => clearTimeout(timeout);
  }, [router]);

  return loading ? (
    <Loading />
  ) : (
    <ProtectedRoute>
      <div>
        <h1>{name}</h1>
        <p>{price}</p>
        <form onSubmit={handleSubmit}>
          <label>
            Amount:
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </label>
          <button type="submit">Buy</button>
          <p>Total Price: {totalPrice.toFixed(2)}</p>
        </form>
      </div>
    </ProtectedRoute>
  );
};
export default BuyCryptoComponent;
