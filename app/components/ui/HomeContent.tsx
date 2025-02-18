'use client';

import { Share2 } from "lucide-react";
import { Button } from "./button";
import { useState } from "react";

export function HomeContent() {
  const [showShareMessage, setShowShareMessage] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: 'Wordle Infinito',
      text: '¡Juega múltiples partidas de Wordle simultáneamente! 🎮✨',
      url: window.location.origin
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.origin);
        setShowShareMessage(true);
        setTimeout(() => setShowShareMessage(false), 2000);
      }
    } catch (err) {
      console.error('Error compartiendo:', err);
    }
  };

  return (
    <article className="max-w-4xl mx-auto px-4 py-8 prose dark:prose-invert prose-sm">
      <div className="fixed bottom-4 right-4 z-50">
        <div className="relative">
          <Button
            onClick={handleShare}
            className="rounded-full p-4 bg-green-500 hover:bg-green-600 text-white shadow-lg"
          >
            <Share2 className="w-6 h-6" />
          </Button>
          {showShareMessage && (
            <div className="absolute bottom-full right-0 mb-2 whitespace-nowrap bg-black text-white text-sm py-1 px-2 rounded">
              ¡Link copiado!
            </div>
          )}
        </div>
      </div>

      <h1 className="sr-only">Wordle Infinito - El Juego de Palabras Definitivo</h1>
      
      <section className="mt-8">
        <h2 className="text-xl font-bold mb-4">¿Qué es Wordle Infinito?</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Wordle Infinito revoluciona el clásico juego de palabras permitiéndote jugar múltiples partidas simultáneamente. 
          A diferencia del Wordle tradicional que limita a una palabra por día, aquí puedes desafiar tu mente con 8, 16, 32, 
          64 o incluso más palabras al mismo tiempo, creando una experiencia única y más desafiante.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold mb-4">Características Principales</h2>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
          <li>Múltiples tableros simultáneos para un desafío mayor</li>
          <li>Sistema de vidas que te permite seguir jugando incluso si cometes errores</li>
          <li>Modo de palabras raras para jugadores expertos</li>
          <li>Creación y compartición de partidas personalizadas</li>
          <li>Interfaz intuitiva adaptada a todos los dispositivos</li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold mb-4">Cómo Jugar</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          El objetivo es descubrir todas las palabras antes de agotar tus intentos. Cada palabra debe tener 5 letras, y tras cada 
          intento, el juego te dará pistas mediante colores: verde para letras en la posición correcta, amarillo para letras 
          presentes pero en posición incorrecta, y gris para letras que no están en la palabra.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold mb-4">Modos de Juego</h2>
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Elige entre el modo normal con palabras comunes o el modo experto con palabras más raras. Personaliza la cantidad 
            de tableros según tu nivel de habilidad y tiempo disponible.
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            Crea tus propias partidas personalizadas seleccionando las palabras que desees y comparte el enlace con amigos 
            para competir o usar en entornos educativos.
          </p>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold mb-4">Beneficios del Juego</h2>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
          <li>Mejora tu vocabulario en español de forma divertida</li>
          <li>Desarrolla el pensamiento lógico y la deducción</li>
          <li>Entrena tu memoria y capacidad de concentración</li>
          <li>Perfecciona tu ortografía mientras juegas</li>
          <li>Compite contigo mismo y supera tus récords</li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold mb-4">Juega Donde Quieras</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Wordle Infinito está optimizado para funcionar en cualquier dispositivo, ya sea computadora, tablet o teléfono móvil. 
          No requiere instalación ni registro, simplemente abre el navegador y comienza a jugar. ¡Desafía tu mente con este 
          adictivo juego de palabras en español!
        </p>
      </section>
    </article>
  );
} 