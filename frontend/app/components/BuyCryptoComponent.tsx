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
  const [error, setError] = useState("");
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
      router.push("/all_crypto?success=true");
    } catch (error) {
      setError(
        "Error buying crypto, check the amount you want to buy and try again."
      );
    } finally {
      setLoading(false);
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
    }, 40000); // 40 seconds
    return () => clearTimeout(timeout);
  }, [router]);

  return loading ? (
    <Loading />
  ) : (
    <ProtectedRoute>
      <div className="container-fluid">
        <div className="profile-wrapper">
          <form onSubmit={handleSubmit} className="form-container">
            {error && <div className="alert alert-danger">{error}</div>}
            <h1>{name}</h1>
            <p>
              Price of {name}: {price}
            </p>
            <label>
              Amount:
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </label>
            <p>Total Price: {totalPrice.toFixed(2)}</p>
            <button type="submit" className="btn btn-dark mt-3">
              Buy
            </button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
};
export default BuyCryptoComponent;
