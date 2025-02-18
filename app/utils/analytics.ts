type GameEvent = 'game_started' | 'custom_game_created' | 'custom_game_played';
type EventParams = Record<string, string | number | boolean>;

interface WindowWithGtag extends Window {
  gtag: (command: string, event: GameEvent, params?: EventParams) => void;
}

export const trackEvent = (eventName: GameEvent, params?: EventParams) => {
  if (typeof window !== 'undefined' && (window as WindowWithGtag).gtag) {
    (window as WindowWithGtag).gtag('event', eventName, params);
  }
}; 