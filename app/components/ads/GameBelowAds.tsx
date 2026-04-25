"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { AdUnit } from "./AdUnit";
import { isAdsenseSlotReady, isBelowGameAdReady, mobileAdSlot } from "@/app/constants/adsense";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "wi-ad-below-m";

function useDismissed() {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      setDismissed(localStorage.getItem(STORAGE_KEY) === "1");
    } catch {
      setDismissed(false);
    }
  }, []);

  function onDismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
    setDismissed(true);
  }

  return { dismissed, onDismiss };
}

export function GameBelowAds() {
  const { dismissed, onDismiss } = useDismissed();
  const slot = mobileAdSlot();

  if (!isBelowGameAdReady()) return null;
  if (!isAdsenseSlotReady(slot)) return null;

  return (
    <div
      className={cn(
        "2xl:hidden w-full max-w-3xl mx-auto px-2 my-2",
        dismissed && "max-lg:hidden"
      )}
    >
      <div
        className={cn(
          "relative",
          "max-lg:rounded-lg max-lg:border max-lg:border-border/50",
          "max-lg:bg-muted/20 max-lg:pl-1 max-lg:pr-2 max-lg:py-1",
          "dark:max-lg:bg-muted/10"
        )}
      >
        <button
          type="button"
          onClick={onDismiss}
          className={cn(
            "lg:hidden absolute right-1 top-1 z-10 h-7 w-7",
            "rounded-md border border-border/60 bg-background/90 text-muted-foreground",
            "hover:bg-muted hover:text-foreground shadow-sm",
            "flex items-center justify-center"
          )}
          aria-label="Cerrar anuncio"
        >
          <X className="h-3.5 w-3.5" />
        </button>
        <p className="mb-0.5 text-center text-[10px] text-muted-foreground/80 max-lg:pr-5 lg:hidden">
          Publicidad
        </p>
        <AdUnit
          slot={slot}
          className="max-w-full"
          data-ad-format="auto"
          fullWidthResponsive
        />
      </div>
    </div>
  );
}
