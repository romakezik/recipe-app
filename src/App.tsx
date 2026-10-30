import { Routes, Route, Link } from "react-router";
import Home from "./pages/Home";
import History from "./pages/History";
import Favorites from "./pages/Favorites";
import { useFavorites } from "./store/useFavoritesStore";

function App() {
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
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </div>
  );
}
export default App;
