import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Actualiza el estado para mostrar la UI alternativa
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Aquí puedes enviar el error a un servicio externo como Sentry
    console.error("Error atrapado por ErrorBoundary:", error, errorInfo);
    // Ejemplo: Sentry.captureException(error, { extra: errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // Puedes personalizar esta UI
      return <h2>Algo salió mal. Por favor, recarga la página.</h2>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
