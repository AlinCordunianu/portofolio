import "./HeroAtmosphere.scss";

export function HeroAtmosphere() {
  return (
    <div className="hero-atmosphere" aria-hidden="true">
      <svg
        className="hero-cloud fog-layer fog-layer--base"
        viewBox="0 0 1440 800"
        preserveAspectRatio="none"
      >
        <defs>
          <filter
            id="hero-cloud-smoke"
            x="-30%"
            y="-50%"
            width="160%"
            height="200%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency=".006 .011"
              numOctaves="2"
              seed="17"
              result="cloud-noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="cloud-noise"
              scale="135"
              xChannelSelector="R"
              yChannelSelector="G"
            />
            <feGaussianBlur stdDeviation="26" />
          </filter>
          <linearGradient id="hero-cloud-color" x1="0" y1="1" x2="1" y2="0">
            <stop stopColor="#17291a" stopOpacity="0" />
            <stop offset=".38" stopColor="#3e5d2b" stopOpacity=".65" />
            <stop offset=".72" stopColor="#748b36" stopOpacity=".85" />
            <stop offset="1" stopColor="#9aaf53" stopOpacity=".3" />
          </linearGradient>
        </defs>
        <g filter="url(#hero-cloud-smoke)">
          <path
            d="M-160 390C90 180 170 375 360 210S620 200 800 145 1180 110 1520 330L1490 580C1260 470 1110 705 900 560S650 590 470 475 160 640-160 510Z"
            fill="url(#hero-cloud-color)"
            opacity=".4"
          />
          <path
            d="M490 405C590 320 685 405 765 270S1010 215 1070 315 1250 310 1375 430C1240 560 1170 425 1070 540S850 460 755 485 615 555 490 405Z"
            fill="#547333"
            opacity=".32"
          />
          <path
            d="M780 380C835 240 960 300 1040 230S1140 330 1100 395 1195 510 1040 500 985 600 890 480 800 500 780 380Z"
            fill="#9aaa52"
            opacity=".25"
          />
          <path
            d="M110 310C280 220 360 455 590 345S780 495 850 535C625 640 510 470 340 555S80 540 110 310Z"
            fill="#304e2c"
            opacity=".35"
          />
        </g>
      </svg>
      <div className="fog-layer fog-layer--drift" />
      <div className="fog-layer fog-layer--fragment" />
      <div className="fog-layer fog-layer--highlight" />
    </div>
  );
}
