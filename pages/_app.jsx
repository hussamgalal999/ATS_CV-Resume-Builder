import '/styles/globals.css';
import { useEffect, useRef } from 'react';

export default function App({ Component, pageProps }) {
  const linkRef = useRef(null);

  useEffect(() => {
    const text = "QudSystem";
    let index = 0;

    const typingInterval = setInterval(() => {
      if (index < text.length) {
        linkRef.current.textContent += text.charAt(index);
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100); // Adjust speed here (lower value = faster)

    return () => clearInterval(typingInterval);
  }, []);

  return (
    <div>
      <Component {...pageProps} />
      <footer className="text-center py-4 bg-gray-100 mt-8">
        <p className="text-gray-600 text-sm">
          Made with ❤️ in Egypt | Powered by{' '}
          <a
            href="https://qud-system.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-blue-500 font-semibold hover:underline"
            ref={linkRef}
          >
            {/* Text content will be added here */}
          </a>
        </p>
      </footer>
    </div>
  );
}
