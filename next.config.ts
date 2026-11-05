import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // WebP only, at a high quality: the collage pieces and photos carry film
    // grain and torn-paper edges, which AVIF and lower qualities smear away.
    formats: ["image/webp"],
    qualities: [92],
    // Local images may carry a ?v= cache-busting query (added when a collage
    // asset is replaced) so a new file is never served from a stale cache.
    localPatterns: [{ pathname: "/images/**" }],
    // Album art for the Last.fm "recently played" list on /music.
    remotePatterns: [
      { protocol: "https", hostname: "lastfm.freetls.fastly.net" },
      { protocol: "https", hostname: "lastfm-img.freetls.fastly.net" },
    ],
  },
};

export default nextConfig;
