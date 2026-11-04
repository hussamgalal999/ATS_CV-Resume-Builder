import ErrorBoundary from "../components/ErrorBoundary";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <ErrorBoundary>
      <Component {...pageProps} />
      <footer className="text-center py-4 bg-gray-100 mt-8">
        <p className="text-gray-600 text-sm">
          Made with ❤️ in Egypt | Powered by{" "}
          <a href="https://qud-system.vercel.app/" target="_blank" rel="noopener noreferrer"
            className="inline-block text-blue-500 font-semibold hover:underline">
            QudSystem
          </a>
        </p>
      </footer>
    </ErrorBoundary>
  );
}

export default MyApp;
