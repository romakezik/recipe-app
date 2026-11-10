import { useAuth } from "../hooks/useAuth";

export default function MyRecipes() {
  const { signOut, user } = useAuth();

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-500">Мои рецепты</h1>
        <button onClick={signOut} className="text-red-500 hover:underline">
          Выйти ({user?.email})
        </button>
      </div>
      <p className="text-gray-500">
        Здесь скоро будут ваши собственные рецепты.
      </p>
    </div>
  );
}
