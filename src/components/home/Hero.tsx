import { heroSlots, portrait } from "@/content/hero";
import { findCollageAsset } from "@/lib/collage";
import { HeroClient } from "./HeroClient";

/**
 * Server wrapper: looks up the hero's collage images in public/images/collage/
 * (portrait, eye, moon, iris, rock) and hands them to the animated client hero.
 */
export async function Hero() {
  const [p, eye, moon, iris, rock] = await Promise.all(["portrait", "eye", "moon", "iris", "rock"].map((s) => findCollageAsset(s)));
  return <HeroClient assets={{ portrait: p, eye, moon, iris, rock }} portrait={portrait} alts={heroSlots} />;
}
