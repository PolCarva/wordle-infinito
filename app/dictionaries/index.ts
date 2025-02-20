import { api } from '../services/api';

export interface GameConfig {
    extraAttempts: number;
}

let availableLengthsCache: number[] | null = null;
let dictionaryCache: Record<number, string[]> = {};
let configCache: Record<number, GameConfig> = {};

export async function getAvailableLengths(): Promise<number[]> {
    if (!availableLengthsCache) {
        availableLengthsCache = await api.getAvailableLengths();
    }
    return availableLengthsCache;
}

export async function getDictionary(length: number, useRare = false): Promise<string[]> {
    const cacheKey = length;
    if (!dictionaryCache[cacheKey]) {
        dictionaryCache[cacheKey] = await api.getWords(length, useRare);
    }
    return dictionaryCache[cacheKey];
}

export async function getGameConfig(length: number): Promise<GameConfig> {
    if (!configCache[length]) {
        configCache[length] = await api.getGameConfig(length);
    }
    return configCache[length];
}

// Para compatibilidad con el código existente
export const AVAILABLE_LENGTHS = [4, 5]; 