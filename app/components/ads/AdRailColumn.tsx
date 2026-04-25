import { AdUnit } from "./AdUnit";
import { ADSENSE, isAdsenseSlotReady } from "@/app/constants/adsense";
import { cn } from "@/lib/utils";

const GUTTER = "hidden 2xl:block w-[min(160px,7.5vw)] shrink-0";
const card =
  "rounded-lg border border-border/50 bg-muted/20 p-1.5 shadow-sm dark:bg-muted/10";

type Side = "left" | "right";

export function AdRailColumn({ side }: { side: Side }) {
  const slot = side === "left" ? ADSENSE.railLeft : ADSENSE.railRight;
  const has = isAdsenseSlotReady(slot);

  if (!has) return null;

  return (
    <div
      className={cn(
        GUTTER,
        "border-border/30 py-1",
        side === "left" && "border-r",
        side === "right" && "border-l"
      )}
    >
      <div className="sticky top-20 max-h-[min(100vh,920px)] overflow-y-auto">
        <div className={card}>
          <p className="mb-1 text-center text-[10px] text-muted-foreground/80">
            Publicidad
          </p>
          <div className="w-full min-w-0 min-h-[200px]">
            <AdUnit
              slot={slot}
              className="max-w-full"
              data-ad-format="vertical"
              fullWidthResponsive={false}
              style={{ display: "block", minHeight: 200, width: "100%" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
