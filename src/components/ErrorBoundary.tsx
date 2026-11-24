import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Необработанная ошибка рендера:", error, info.componentStack);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="mx-auto mt-16 max-w-md p-6 text-center">
        <p className="text-5xl font-bold text-red-500">Упс</p>
        <h1 className="mt-4 text-2xl font-bold text-gray-800">
          Что-то пошло не так
        </h1>
        <p className="mt-2 text-gray-600">
          Приложение столкнулось с непредвиденной ошибкой. Перезагрузка обычно
          решает проблему — ваши данные на сервере не пострадали.
        </p>
        <button
          type="button"
          onClick={this.handleReload}
          className="mt-6 cursor-pointer rounded-lg bg-blue-500 px-4 py-2 font-bold text-white transition-colors hover:bg-blue-600"
        >
          Перезагрузить страницу
        </button>
      </div>
    );
  }
}
