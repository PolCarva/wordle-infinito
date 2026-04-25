"use client";

import { AdUnit } from "./AdUnit";
import { ADSENSE, isAdsenseSlotReady } from "@/app/constants/adsense";

export function HomeArticleAd() {
  if (!isAdsenseSlotReady(ADSENSE.article)) return null;
  return (
    <div className="not-prose my-6 flex justify-center rounded-md border border-border/40 bg-muted/15 p-2 dark:bg-muted/10">
      <div className="w-full min-h-[100px] max-w-lg">
        <p className="mb-1 text-center text-[10px] text-muted-foreground/70">
          Publicidad
        </p>
        <AdUnit
          slot={ADSENSE.article}
          data-ad-format="auto"
          fullWidthResponsive
        />
      </div>
    </div>
  );
}
