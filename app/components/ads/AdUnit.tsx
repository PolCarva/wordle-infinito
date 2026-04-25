"use client";

import { useEffect, useRef } from "react";
import { AD_CLIENT, isAdsenseSlotReady } from "@/app/constants/adsense";
import { cn } from "@/lib/utils";

type WindowWithAds = Window & { adsbygoogle?: object[] };

type AdUnitProps = {
  slot: string;
  className?: string;
  insClassName?: string;
  "data-ad-format"?: "auto" | "vertical" | "horizontal" | "fluid" | "rectangle";
  fullWidthResponsive?: boolean;
  style?: React.CSSProperties;
};

function AdUnit({
  slot,
  className,
  insClassName,
  "data-ad-format": adFormat = "auto",
  fullWidthResponsive = true,
  style,
}: AdUnitProps) {
  const insRef = useRef<HTMLModElement>(null);
  const pushedRef = useRef(false);
  const ready = isAdsenseSlotReady(slot);

  useEffect(() => {
    if (!ready) return;
    if (pushedRef.current) return;
    if (!insRef.current) return;
    pushedRef.current = true;
    try {
      const w = window as WindowWithAds;
      w.adsbygoogle = w.adsbygoogle || [];
      w.adsbygoogle.push({});
    } catch {
      pushedRef.current = false;
    }
  }, [ready, slot]);

  if (!ready) return null;

  return (
    <div className={cn("text-center", className)} aria-label="Anuncio">
      <ins
        ref={insRef}
        className={cn("adsbygoogle", insClassName)}
        style={style ?? { display: "block" }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={slot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
      />
    </div>
  );
}

export { AdUnit };
