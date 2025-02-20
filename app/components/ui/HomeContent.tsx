"use client";

import { Button } from "@/app/components/ui/button";
import { Swords } from "lucide-react";
import Link from "next/link";

export function HomeContent() {

  return (
    <article className="max-w-4xl mx-auto px-4 py-8 prose dark:prose-invert prose-sm">
      <h1 className="sr-only">
        Wordle Infinito - El Juego de Palabras Definitivo
      </h1>

      <section className="mt-8">
        <h2 className="text-xl font-bold mb-4">¿Qué es Wordle Infinito?</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Wordle Infinito revoluciona el clásico juego de palabras permitiéndote
          jugar múltiples partidas simultáneamente. A diferencia del Wordle
          tradicional que limita a una palabra por día, aquí puedes desafiar tu
          mente con 8, 16, 32, 64 o incluso más palabras al mismo tiempo,
          creando una experiencia única y más desafiante.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold mb-4">Características Principales</h2>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
          <li>Múltiples tableros simultáneos para un desafío mayor</li>
          <li>
            Sistema de vidas que te permite seguir jugando incluso si cometes
            errores
          </li>
          <li>Modo de palabras raras para jugadores expertos</li>
          <li>Creación y compartición de partidas personalizadas</li>
          <li>Interfaz intuitiva adaptada a todos los dispositivos</li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold mb-4">Cómo Jugar</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          El objetivo es descubrir todas las palabras antes de agotar tus
          intentos. Cada palabra debe tener 5 letras, y tras cada intento, el
          juego te dará pistas mediante colores: verde para letras en la
          posición correcta, amarillo para letras presentes pero en posición
          incorrecta, y gris para letras que no están en la palabra.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold mb-4">Modos de Juego</h2>
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Elige entre el modo normal con palabras comunes o el modo experto
            con palabras más raras. Personaliza la cantidad de tableros según tu
            nivel de habilidad y tiempo disponible.
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            Crea tus propias partidas personalizadas seleccionando las palabras
            que desees y comparte el enlace con amigos para competir o usar en
            entornos educativos.
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
          Wordle Infinito está optimizado para funcionar en cualquier
          dispositivo, ya sea computadora, tablet o teléfono móvil. No requiere
          instalación ni registro, simplemente abre el navegador y comienza a
          jugar. ¡Desafía tu mente con este adictivo juego de palabras en
          español!
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold mb-4">¡Nuevo! Modo Versus</h2>
        <div className="flex flex-col items-center space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Desafía a otros jugadores en tiempo real. ¡El primero en adivinar la palabra gana!
          </p>
          <Link href="/versus">
            <Button className="flex items-center space-x-2">
              <Swords className="h-5 w-5" />
              <span>Jugar Versus</span>
            </Button>
          </Link>
        </div>
      </section>
    </article>
  );
}
