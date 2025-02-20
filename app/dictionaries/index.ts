import { api } from '../services/api';

export interface GameConfig {
    extraAttempts: number;
}

interface CacheEntry<T> {
    data: T;
    timestamp: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos en milisegundos
const AVAILABLE_LENGTHS = [1, 2, 3, 4, 5, 6];
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

let availableLengthsCache: number[] | null = null;
const cache = {
    lengths: null as CacheEntry<number[]> | null,
    dictionaries: new Map<string, CacheEntry<string[]>>(),
    configs: new Map<number, CacheEntry<GameConfig>>()
};

function isCacheValid<T>(entry: CacheEntry<T> | null | undefined): entry is CacheEntry<T> {
    if (!IS_PRODUCTION || !entry) return false;
    return Date.now() - entry.timestamp < CACHE_DURATION;
}

export async function getAvailableLengths(): Promise<number[]> {
    if (isCacheValid(cache.lengths)) {
        return cache.lengths.data;
    }

    const lengths = await api.getAvailableLengths();
    
    if (IS_PRODUCTION) {
        cache.lengths = {
            data: lengths,
            timestamp: Date.now()
        };
    }
    
    return lengths || AVAILABLE_LENGTHS;
}

export async function getDictionary(length: number, useRare = false): Promise<string[]> {
    const cacheKey = `${length}-${useRare}`;
    const cached = cache.dictionaries.get(cacheKey);

    if (isCacheValid(cached)) {
        return cached.data;
    }

    const words = await api.getWords(length, useRare);
    
    if (IS_PRODUCTION) {
        cache.dictionaries.set(cacheKey, {
            data: words,
            timestamp: Date.now()
        });
    }
    
    return words;
}

export async function getGameConfig(length: number): Promise<GameConfig> {
    const cached = cache.configs.get(length);

    if (isCacheValid(cached)) {
        return cached.data;
    }

    const config = await api.getGameConfig(length);
    
    if (IS_PRODUCTION) {
        cache.configs.set(length, {
            data: config,
            timestamp: Date.now()
        });
    }
    
    return config;
} 