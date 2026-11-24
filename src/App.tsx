import { useState } from "react";
import { Link, NavLink, Route, Routes, useNavigate } from "react-router";
import { useAuth } from "./hooks/useAuth";
import { useFavorites } from "./store/useFavoritesStore";
import PrivateRoute from "./components/PrivateRoute";
import NotFound from "./components/NotFound";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import HistoryPage from "./pages/History";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyRecipes from "./pages/MyRecipes";
import NewRecipe from "./pages/NewRecipe";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `font-bold transition-colors ${
    isActive ? "text-blue-700 underline" : "text-blue-500 hover:underline"
  }`;

export default function App() {
  const { user, loading, signOut } = useAuth();
  const count = useFavorites((s) => s.ids.length);
  const navigate = useNavigate();
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState("");

  const handleSignOut = async () => {
    setSigningOut(true);
    setSignOutError("");

    const ok = await signOut()
      .then(() => true)
      .catch(() => false);

    setSigningOut(false);

    if (ok) {
      navigate("/");
    } else {
      setSignOutError(
        "Не удалось выйти. Проверьте соединение и попробуйте ещё раз.",
      );
    }
  };

  return (
    <div className="mx-auto max-w-full">
      <nav className="flex flex-wrap items-center gap-4 border-b border-gray-200 bg-gray-100 p-3 shadow-md">
        <NavLink to="/" className={navLinkClass} end>
          Поиск
        </NavLink>
        <NavLink to="/favorites" className={navLinkClass}>
          Избранное ({count})
        </NavLink>
        <NavLink to="/history" className={navLinkClass}>
          История
        </NavLink>

        <div className="ml-auto flex flex-wrap items-center gap-4">
          {loading ? (
            <span
              aria-hidden="true"
              className="h-5 w-40 animate-pulse rounded bg-gray-300"
            />
          ) : user ? (
            <>
              <NavLink to="/my-recipes" className={navLinkClass}>
                Мои рецепты
              </NavLink>
              <button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                className="cursor-pointer font-bold text-red-500 hover:underline disabled:opacity-50"
              >
                {signingOut ? "Выходим..." : "Выйти"}
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClass}>
                Войти
              </NavLink>
              <Link
                to="/register"
                className="rounded-lg bg-blue-500 px-3 py-1 font-bold text-white transition-colors hover:bg-blue-600"
              >
                Регистрация
              </Link>
            </>
          )}
        </div>
      </nav>

      {signOutError && (
        <div
          role="alert"
          className="flex items-start gap-3 bg-red-100 px-4 py-2 text-sm text-red-700"
        >
          <span>{signOutError}</span>
          <button
            type="button"
            onClick={() => setSignOutError("")}
            className="ml-auto cursor-pointer font-bold hover:underline"
          >
            Скрыть
          </button>
        </div>
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<PrivateRoute />}>
          <Route path="/my-recipes" element={<MyRecipes />} />
          <Route path="/my-recipes/new" element={<NewRecipe />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
