import { useEffect, useState } from "react";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { useRouter, useSearchParams } from "next/navigation";
import Loading from "./loading/loading";

export default function Form({ route }: { route: string }) {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(false);
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();
    try {
      const res = await api.post(route, { username, password });
      localStorage.setItem(ACCESS_TOKEN, res.data.access);
      localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
      router.push("/my_profile");
    } catch (error) {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (success) {
      setSuccessMessage(true);
      const timer = setTimeout(() => {
        setSuccessMessage(false);
        router.replace("/login", undefined);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, router]);

  return loading ? (
    <Loading />
  ) : (
    <div className="form-wrapper">
      <form onSubmit={handleSubmit} className="form-container">
        {successMessage && (
          <div className="alert alert-success">
            Created account successfully! Now you can login!
          </div>
        )}
        {error && <div className="alert alert-danger">{error}</div>}
        <h1 className="label1">Login</h1>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="username"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </div>
        <a href="/sign_up">Doesn't have an account?Sign Up</a>
        <button type="submit" className="btn btn-dark w-100">
          Login
        </button>
      </form>
    </div>
  );
}
