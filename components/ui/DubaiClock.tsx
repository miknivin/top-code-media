"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";

export function DubaiClock({ className }: { className?: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const format = new Intl.DateTimeFormat("en-GB", {
      timeZone: site.timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const update = () => setTime(format.format(new Date()));
    update();
    const id = window.setInterval(update, 10_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className={className}>
      Dubai <time className="tabular-nums">{time ?? "--:--"}</time> GST
    </span>
  );
}
