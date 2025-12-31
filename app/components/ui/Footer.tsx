import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-12">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center space-y-4">
          {/* Sección de desarrollador */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p>
              Desarrollado con ♥ por{' '}
              <Link
                href="https://linkedin.com/in/pablo-carvalho-gimenez"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
              >
                Pablo Carvalho
              </Link>
            </p>
          </div>

          {/* Sección de más juegos */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p className="mb-2">Más juegos del creador:</p>
            <Link
              href="https://impostor.pablocarvalho.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
            >
              El impostor
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
