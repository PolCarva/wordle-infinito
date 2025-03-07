// Rate limiter específico para actualizaciones de juego
// Previene que un usuario pueda actualizar sus estadísticas demasiado rápido

interface GameRateLimitEntry {
  count: number;
  timestamp: number;
  lastGameTimestamp: number;
}

// Almacena los intentos de actualización por usuario
const gameRateLimitStore: Record<string, GameRateLimitEntry> = {};

// Tiempo mínimo entre juegos (en milisegundos)
// Un juego normal de Wordle debería tomar al menos 30 segundos
const MIN_GAME_TIME_MS = 30 * 1000;

// Tiempo de ventana para rate limiting (1 hora)
const WINDOW_MS = 60 * 60 * 1000;

// Máximo número de actualizaciones en la ventana de tiempo
const MAX_GAME_UPDATES = 20; // Máximo 20 juegos por hora

/**
 * Verifica si un usuario puede actualizar sus estadísticas
 * @param userId ID del usuario
 * @returns true si está permitido, false si excede el límite
 */
export function checkGameRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = gameRateLimitStore[userId];
  
  // Si no hay entrada previa o ha pasado la ventana de tiempo, crear nueva entrada
  if (!entry || now - entry.timestamp > WINDOW_MS) {
    gameRateLimitStore[userId] = {
      count: 1,
      timestamp: now,
      lastGameTimestamp: now
    };
    return true;
  }
  
  // Verificar tiempo mínimo entre juegos
  if (now - entry.lastGameTimestamp < MIN_GAME_TIME_MS) {
    return false; // Demasiado rápido entre juegos
  }
  
  // Si no ha excedido el límite, incrementar contador
  if (entry.count < MAX_GAME_UPDATES) {
    entry.count++;
    entry.lastGameTimestamp = now;
    return true;
  }
  
  // Ha excedido el límite
  return false;
}

/**
 * Obtiene información sobre el estado actual del rate limit para juegos
 * @param userId ID del usuario
 * @returns Información sobre el rate limit o null si no hay entrada
 */
export function getGameRateLimitInfo(userId: string): { 
  remaining: number, 
  resetTime: number,
  canPlay: boolean,
  nextGameTime: number 
} | null {
  const entry = gameRateLimitStore[userId];
  
  if (!entry) {
    return null;
  }
  
  const now = Date.now();
  const timeUntilNextGame = Math.max(0, MIN_GAME_TIME_MS - (now - entry.lastGameTimestamp));
  
  return {
    remaining: Math.max(0, MAX_GAME_UPDATES - entry.count),
    resetTime: entry.timestamp + WINDOW_MS,
    canPlay: entry.count < MAX_GAME_UPDATES && timeUntilNextGame === 0,
    nextGameTime: entry.lastGameTimestamp + MIN_GAME_TIME_MS
  };
} 