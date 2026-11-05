import Image from "next/image";
import { PlateArt, type PlateVariant } from "./PlateArt";

export type PlateImage = {
  /** Path in /public (e.g. "/images/photography/night-01.jpg") or remote URL allowed in next.config. */
  src?: string;
  alt: string;
  /** Generated stand-in shown while `src` is empty. */
  variant: PlateVariant;
  /** Render the supplied photo in monochrome (default true — matches the art direction). */
  mono?: boolean;
  /** Crop focus when the frame's shape differs from the image (CSS object-position, e.g. "50% 30%"). */
  position?: string;
};

/**
 * A photographic "plate". Uses the real image when `src` is provided,
 * otherwise an original generated composition clearly tagged as a placeholder.
 */
export function Plate({
  image,
  className = "",
  sizes = "(max-width: 768px) 100vw, 40vw",
  priority = false,
  showTag = true,
  tagClass = "bottom-1.5 left-2",
}: {
  image: PlateImage;
  className?: string;
  sizes?: string;
  priority?: boolean;
  showTag?: boolean;
  /** Position of the "placeholder" tag (Tailwind classes). */
  tagClass?: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-ash ${className}`}>
      {image.src ? (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          priority={priority}
          className={`object-cover ${image.mono === false ? "" : "photo-mono"}`}
          style={image.position ? { objectPosition: image.position } : undefined}
        />
      ) : (
        <>
          <PlateArt variant={image.variant} className="absolute inset-0 h-full w-full" />
          <span className="sr-only">{image.alt} (placeholder artwork)</span>
          {showTag && (
            <span className={`t-label pointer-events-none absolute z-[1] ${tagClass} text-[0.6875rem] tracking-[0.2em] text-ivory/60 mix-blend-difference`}>
              placeholder
            </span>
          )}
        </>
      )}
    </div>
  );
}
