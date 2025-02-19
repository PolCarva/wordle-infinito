import { WORD_LIST } from './lists/word-list';
import { ACCEPTED_WORDS } from './accepted/accepted-words';
import { WORD_LIST_2 } from './lists/word-list-2';
import { ACCEPTED_WORDS_2 } from './accepted/accepted-words-2';
import { WORD_LIST_3 } from './lists/word-list-3';
import { ACCEPTED_WORDS_3 } from './accepted/accepted-words-3';
import { WORD_LIST_4 } from './lists/word-list-4';
import { ACCEPTED_WORDS_4 } from './accepted/accepted-words-4';
import { WORD_LIST_6 } from './lists/word-list-6';
import { ACCEPTED_WORDS_6 } from './accepted/accepted-words-6';

interface Dictionary {
  common: string[];
  accepted: string[];
  config: GameConfig;
}

interface GameConfig {
  extraAttempts: number;
  initialLives: number;
}

export const DICTIONARIES: Record<number, Dictionary> = {
  2: {
    common: WORD_LIST_2,
    accepted: ACCEPTED_WORDS_2,
    config: {
      extraAttempts: 8,
      initialLives: 10,
    }
  },
  3: {
    common: WORD_LIST_3,
    accepted: ACCEPTED_WORDS_3,
    config: {
      extraAttempts: 7,
      initialLives: 8,
    }
  },
  4: {
    common: WORD_LIST_4,
    accepted: ACCEPTED_WORDS_4,
    config: {
      extraAttempts: 6,
      initialLives: 6,
    }
  },
  5: {
    common: WORD_LIST,
    accepted: ACCEPTED_WORDS,
    config: {
      extraAttempts: 5,
      initialLives: 5,
    }
  },
  6: {
    common: WORD_LIST_6,
    accepted: ACCEPTED_WORDS_6,
    config: {
      extraAttempts: 4,
      initialLives: 4,
    }
  },
};

export const AVAILABLE_LENGTHS = Object.keys(DICTIONARIES).map(Number);

export function getDictionary(length: number, useRare = false): string[] {
  const dictionary = DICTIONARIES[length];
  if (!dictionary) {
    throw new Error(`No hay diccionario para palabras de ${length} letras`);
  }
  return useRare ? dictionary.accepted : dictionary.common;
}

export function getGameConfig(length: number): GameConfig {
  const dictionary = DICTIONARIES[length];
  if (!dictionary) {
    throw new Error(`No hay diccionario para palabras de ${length} letras`);
  }
  return dictionary.config;
} 