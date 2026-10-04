import Image from "next/image";
import logoMark from "@/assets/brand/logo-mark.png";
import { cn } from "@/lib/cn";

// The supplied mark is white strokes on transparent, so it always sits on an ink tile.
// That keeps the client's colours intact on the light sections as well as the dark ones.
const MARK_HEIGHT = 24;
const MARK_WIDTH = Math.round((MARK_HEIGHT * logoMark.width) / logoMark.height);

export function LogoMark({ className }: { className?: string }) {
  return (
    <span className={cn("grid size-9 shrink-0 place-items-center rounded-[10px] bg-ink", className)}>
      <Image src={logoMark} alt="" width={MARK_WIDTH} height={MARK_HEIGHT} loading="eager" />
    </span>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="text-[1.05rem] font-bold leading-none tracking-[-0.04em]">
        Top Code <span className="font-light">Media</span>
      </span>
    </span>
  );
}
