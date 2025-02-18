type GameEvent = 'game_started' | 'custom_game_created' | 'custom_game_played';
type EventParams = Record<string, string | number | boolean>;

interface WindowWithGtag {
  gtag?: (command: string, event: GameEvent, params?: EventParams) => void;
}

export const trackEvent = (eventName: GameEvent, params?: EventParams) => {
  if (typeof window !== 'undefined') {
    const w = window as unknown as WindowWithGtag;
    if (w.gtag) {
      w.gtag('event', eventName, params);
    }
  }
}; 