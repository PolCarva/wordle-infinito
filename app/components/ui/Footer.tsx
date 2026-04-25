import { Coffee } from 'lucide-react';
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
              href="https://impostor.gratis"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
            >
              El impostor
            </Link>
          </div>

          {/* Botón de café */}
          <div className="pt-2 flex flex-col items-center gap-2">
            <h2 className='text-lg font-medium'>Querés apoyarme?</h2>
            <Link
              href="https://buymeacoffee.com/pablocarvalho"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 rounded-full border border-amber-200 dark:border-amber-800 hover:bg-amber-200 dark:hover:bg-amber-900/40 transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              <Coffee className='size-4'/>
              <span className="font-medium">Comprame un café</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
