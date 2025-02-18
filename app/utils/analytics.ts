type GameEvent = 'game_started' | 'custom_game_created' | 'custom_game_played';

export const trackEvent = (eventName: GameEvent, params?: Record<string, any>) => {
  // Verificamos que gtag esté disponible
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, params);
  }
}; 