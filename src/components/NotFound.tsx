import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="mx-auto mt-16 max-w-md p-6 text-center">
      <p className="text-6xl font-bold text-blue-500">404</p>
      <h1 className="mt-4 text-2xl font-bold text-gray-800">
        Страница не найдена
      </h1>
      <p className="mt-2 text-gray-600">
        Такого адреса нет. Возможно, ссылка устарела или в ней опечатка.
      </p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-lg bg-blue-500 px-4 py-2 font-bold text-white transition-colors hover:bg-blue-600"
      >
        Вернуться к поиску
      </Link>
    </div>
  );
}
