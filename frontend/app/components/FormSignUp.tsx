import { useState } from "react";
import api from "../api";
import { useRouter } from "next/navigation";
import Loading from "./loading/loading";

export default function Form({ route }: { route: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordconfirm, setPasswordconfirm] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();
    if (password != passwordconfirm) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    try {
      const res = await api.post(route, { username, email, password });
      router.push("/login?success=true");
    } catch (error) {
      setError(
        "There is an existing user with this email or username. Please try again."
      );
    } finally {
      localStorage.clear();
      setLoading(false);
    }
  };

  return loading ? (
    <Loading />
  ) : (
    <div className="form-wrapper">
      <form onSubmit={handleSubmit} className="form-container">
        {error && <div className="alert alert-danger">{error}</div>}
        <h1 className="label1">Sign Up</h1>
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
          <label className="form-label">Email address</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={passwordconfirm}
            onChange={(e) => setPasswordconfirm(e.target.value)}
            placeholder="Confirm Password"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Confirm Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </div>
        <a href="/login">Already have an account?Login</a>
        <button type="submit" className="btn btn-dark w-100">
          Sign Up
        </button>
      </form>
    </div>
  );
}
