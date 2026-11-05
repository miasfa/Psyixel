/**
 * Shared SVG filters + gradients, rendered once in the root layout.
 * Every placeholder plate references these by id, so each one stays tiny.
 */
export function SvgDefs() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
    >
      <defs>
        {/* Stone / lunar relief */}
        <filter id="f-stone" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="5" seed="3" result="n" />
          <feDiffuseLighting in="n" lightingColor="#fff" surfaceScale="3.4" result="l">
            <feDistantLight azimuth="225" elevation="40" />
          </feDiffuseLighting>
          <feColorMatrix type="saturate" values="0" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>

        {/* Fine film grain, clipped to the shape it is applied to */}
        <filter id="f-noise" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>

        {/* Volumetric clouds */}
        <filter id="f-cloud" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.009 0.018" numOctaves="5" seed="11" result="t" />
          <feColorMatrix in="t" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  1.9 0 0 0 -0.62" result="c" />
          <feGaussianBlur in="SourceAlpha" stdDeviation="22" result="m" />
          <feComposite in="c" in2="m" operator="in" />
        </filter>

        <filter id="f-soft" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="16" />
        </filter>

        <filter id="f-motion" x="-40%" y="-20%" width="180%" height="140%">
          <feGaussianBlur stdDeviation="20 3" />
        </filter>

        {/* Brush / ruffled edges */}
        <filter id="f-paint" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="turbulence" baseFrequency="0.018 0.07" numOctaves="3" seed="2" result="t" />
          <feDisplacementMap in="SourceGraphic" in2="t" scale="22" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="f-ruffle" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="9" result="t" />
          <feDisplacementMap in="SourceGraphic" in2="t" scale="9" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="f-ruffle-lg" x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence type="fractalNoise" baseFrequency="0.022 0.05" numOctaves="3" seed="4" result="t" />
          <feDisplacementMap in="SourceGraphic" in2="t" scale="20" xChannelSelector="R" yChannelSelector="G" />
        </filter>

        <filter id="f-soft-s" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <filter id="f-soft-m" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="9" />
        </filter>

        <radialGradient id="g-moon" cx="0.38" cy="0.35" r="0.75">
          <stop offset="0" stopColor="#f1ede6" />
          <stop offset="0.55" stopColor="#bdb8b0" />
          <stop offset="1" stopColor="#5d5a56" />
        </radialGradient>
        <radialGradient id="g-redmoon" cx="0.4" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#e07a55" />
          <stop offset="0.6" stopColor="#b8492f" />
          <stop offset="1" stopColor="#5e1f14" />
        </radialGradient>
        <linearGradient id="g-petal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5b4585" />
          <stop offset="0.45" stopColor="#a68bd6" />
          <stop offset="1" stopColor="#d9c9f2" />
        </linearGradient>
        <linearGradient id="g-skin" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e2dcd2" />
          <stop offset="0.45" stopColor="#9d978e" />
          <stop offset="1" stopColor="#2a2725" />
        </linearGradient>
        <linearGradient id="g-stone" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#dcd8d2" />
          <stop offset="1" stopColor="#5a5652" />
        </linearGradient>
        <linearGradient id="g-sheet" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f2efe9" />
          <stop offset="0.6" stopColor="#9a968f" />
          <stop offset="1" stopColor="#2b2a28" />
        </linearGradient>
      </defs>
    </svg>
  );
}
