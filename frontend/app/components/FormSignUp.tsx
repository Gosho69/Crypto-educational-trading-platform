import { useState } from "react";
import api from "../api";
import { useRouter } from "next/navigation";
import Loading from "./loading/loading";

export default function Form({ route }: { route: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();
    router.push("/login");
    try {
      const res = await api.post(route, { username, email, password });
    } catch (error) {
      alert(error);
    } finally {
      localStorage.clear();
      setLoading(false);
    }
  };

  return loading ? (
    <Loading />
  ) : (
    <form onSubmit={handleSubmit} className="form-container">
      <h1>Sign Up</h1>
      <input
        className="form-input"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      ></input>
      <input
        className="form-input"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      ></input>
      <input
        className="form-input"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      ></input>
      <button className="form-button" type="submit">
        Sign Up
      </button>
    </form>
  );
}
