import React, { useEffect, useState } from "react";
import Loading from "@/app/components/loading/loading";
import api from "@/app/api";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

const SellCrypto = () => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  const name = searchParams.get("name");
  const amount1 = searchParams.get("amount");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (parseInt(amount) < 0) {
      setError("Please enter a valid amount");
      return;
    }
    try {
      const response = await api.post(`/dashboard/mycrypto/${name}/`, {
        amount,
      });
      console.log(response.data);
      router.push("/my_crypto?success=true");
    } catch (error) {
      setError(
        "Error selling crypto, check the amount you want to sell and try again."
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (name) {
      setLoading(false);
    }
  }, [name]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push("/my_crypto");
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
            <h1 className="welcome-text">Sell {name}</h1>
            <p className="welcome-text">Amount you have: {amount1}</p>
            <label className="label4">
              Amount:
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </label>
            <button type="submit" className="btn btn-dark mt-3">
              Sell
            </button>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
};
export default SellCrypto;
