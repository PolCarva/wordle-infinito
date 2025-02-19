'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <div className="relative">
      <button
        onClick={() => router.back()}
        className="fixed top-4 left-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
      >
        <ArrowLeft className="h-6 w-6" />
      </button>
      <article className="max-w-4xl mx-auto px-4 py-8 prose dark:prose-invert">
        <h1>Política de Privacidad</h1>

        <section>
          <h2>1. Información que Recopilamos</h2>
          <p>
            Recopilamos la siguiente información cuando creas una cuenta:
          </p>
          <ul>
            <li>Nombre de usuario</li>
            <li>Dirección de correo electrónico</li>
            <li>Estadísticas de juego</li>
          </ul>
        </section>

        <section>
          <h2>2. Uso de la Información</h2>
          <p>
            Utilizamos la información recopilada para:
          </p>
          <ul>
            <li>Gestionar tu cuenta</li>
            <li>Mantener estadísticas de juego</li>
            <li>Mejorar la experiencia del usuario</li>
            <li>Enviar notificaciones importantes sobre el servicio</li>
          </ul>
        </section>

        <section>
          <h2>3. Protección de Datos</h2>
          <p>
            Implementamos medidas de seguridad para proteger tu información personal.
            No compartimos tus datos con terceros sin tu consentimiento explícito.
          </p>
        </section>

        <section>
          <h2>4. Cookies</h2>
          <p>
            Utilizamos cookies para mantener tu sesión y preferencias de juego.
            Puedes configurar tu navegador para rechazar cookies, pero esto podría
            afectar algunas funcionalidades del juego.
          </p>
        </section>

        <section>
          <h2>5. Derechos del Usuario</h2>
          <p>
            Tienes derecho a:
          </p>
          <ul>
            <li>Acceder a tus datos personales</li>
            <li>Corregir información inexacta</li>
            <li>Solicitar la eliminación de tus datos</li>
            <li>Exportar tus datos en un formato portable</li>
          </ul>
        </section>

        <section>
          <h2>6. Contacto</h2>
          <p>
            Para cualquier consulta sobre privacidad, puedes contactarnos en:
            privacy@wordleinfinito.com
          </p>
        </section>
      </article>
    </div>
  );
} 