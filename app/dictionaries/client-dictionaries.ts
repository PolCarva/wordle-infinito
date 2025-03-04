// Diccionarios del lado del cliente para evitar peticiones al servidor
// Estos son datos dummy que serán reemplazados con las palabras reales

import { normal_five_letter, normal_four_letter, normal_one_letter, normal_six_letter, normal_three_letter, normal_two_letter } from "./lists/normal";

import { rare_one_letter, rare_three_letter, rare_two_letter, rare_four_letter, rare_five_letter, rare_six_letter } from "./lists/rare";

// Diccionario de palabras aceptadas por longitud
export const clientDictionaries: Record<number, string[]> = {
  1: normal_one_letter,
  2: normal_two_letter,
  3: normal_three_letter,
  4: normal_four_letter,
  5: normal_five_letter,
  6: normal_six_letter
};

// Diccionario de palabras raras por longitud
export const clientRareDictionaries: Record<number, string[]> = {
  1: rare_one_letter,
  2: rare_two_letter,
  3: rare_three_letter,
  4: rare_four_letter,
  5: rare_five_letter,
  6: rare_six_letter
};

// Configuración del juego por longitud
export const clientGameConfigs: Record<number, { extraAttempts: number }> = {
  1: { extraAttempts: 8 },
  2: { extraAttempts: 7 },
  3: { extraAttempts: 6 },
  4: { extraAttempts: 5 },
  5: { extraAttempts: 5 },
  6: { extraAttempts: 5 }
};

// Longitudes disponibles
export const clientAvailableLengths = [1, 2, 3, 4, 5, 6];

// Función para obtener el diccionario del cliente
export function getClientDictionary(length: number, useRare = false): string[] {
  const dictionary = useRare ? clientRareDictionaries[length] || [] : clientDictionaries[length] || [];
  return dictionary;
}

// Función para obtener la configuración del juego del cliente
export function getClientGameConfig(length: number): { extraAttempts: number } {
  return clientGameConfigs[length] || { extraAttempts: 1 };
}

// Función para obtener las longitudes disponibles del cliente
export function getClientAvailableLengths(): number[] {
  return clientAvailableLengths;
} 