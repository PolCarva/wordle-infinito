/** Crea en AdSense (Anuncios → Unidades) y pega el ID de cada unidad. */
export const AD_CLIENT = "ca-pub-8052007653549292";

export const ADSENSE = {
  railLeft: process.env.NEXT_PUBLIC_ADSENSE_SLOT_RAIL_LEFT ?? "",
  railRight: process.env.NEXT_PUBLIC_ADSENSE_SLOT_RAIL_RIGHT ?? "",
  /** Debajo del juego cuando no hay cinta lateral (hasta 2xl). Misma clave se puede reutilizar en otras. */
  belowGame: process.env.NEXT_PUBLIC_ADSENSE_SLOT_BELOW_GAME ?? "",
  /** Cinta móvil con cierre; si vacío, usa belowGame. */
  mobile: process.env.NEXT_PUBLIC_ADSENSE_SLOT_MOBILE ?? "",
  /** Párrafo SEO (Home). */
  article: process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE ?? "",
} as const;

export function isAdsenseSlotReady(slot: string): boolean {
  return slot.trim().length > 0;
}

export function mobileAdSlot(): string {
  if (isAdsenseSlotReady(ADSENSE.mobile)) return ADSENSE.mobile;
  return ADSENSE.belowGame;
}

export function isBelowGameAdReady(): boolean {
  return isAdsenseSlotReady(ADSENSE.belowGame) || isAdsenseSlotReady(ADSENSE.mobile);
}
