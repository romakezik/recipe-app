import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate, Link } from "react-router";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setPending(true);
    setError("");

    try {
      const { error } = await supabase.auth.signUp({ email, password });

      if (error) {
        setError(error.message);
        return;
      }

      navigate("/my-recipes");
    } catch {
      setError("Произошла ошибка сети. Попробуйте ещё раз.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Регистрация</h1>
      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 border rounded"
          required
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Зарегистрироваться
        </button>
      </form>
      <p className="mt-4 text-sm text-center">
        Уже есть аккаунт?{" "}
        <Link to="/login" className="text-blue-500 hover:underline">
          Войти
        </Link>
      </p>
    </div>
  );
}
