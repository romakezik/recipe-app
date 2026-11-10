import { useAuth } from "./hooks/useAuth";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyRecipes from "./pages/MyRecipes";
import PrivateRoute from "./components/PrivateRoute";
import { Link, Route, Routes } from "react-router";
import Favorites from "./pages/Favorites";
import Home from "./pages/Home";
import { useFavorites } from "./store/useFavoritesStore";
import HistoryPage from "./pages/History";

export default function App() {
  const { user } = useAuth();
  const count = useFavorites((s) => s.ids.length);

  return (
    <div className="mx-auto max-w-full">
      <nav className="flex gap-4 border-b-gray-400 p-3 shadow-md bg-gray-100">
        <Link to="/" className="text-blue-500 hover:underline font-bold">
          Поиск
        </Link>
        <Link
          to="/favorites"
          className="text-blue-500 hover:underline font-bold"
        >
          Избранное ({count})
        </Link>
        <Link to="/history" className="text-blue-500 hover:underline font-bold">
          История
        </Link>

        {user && (
          <Link
            to="/my-recipes"
            className="text-blue-500 hover:underline font-bold ml-auto"
          >
            Мои рецепты
          </Link>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<PrivateRoute />}>
          <Route path="/my-recipes" element={<MyRecipes />} />
        </Route>
      </Routes>
    </div>
  );
}
