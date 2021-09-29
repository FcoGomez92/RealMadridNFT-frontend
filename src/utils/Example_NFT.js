import * as React from "react";

const Example_NFT = ({ name, number, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMinYMin meet"
    viewBox="0 0 350 350"
    {...props}
  >
    <defs>
      <style>
        {
          "\n      @import url(https://fonts.googleapis.com/css?family=Press+Start+2P);.base{fill:#084b94;font-family:&apos;Press Start 2P&apos;}\n    "
        }
      </style>
    </defs>
    <rect width="100%" height="100%" fill="#F39528" />
    <rect width="98%" height="98%" x="1%" y="1%" fill="#042BA0" />
    <rect width="94%" height="94%" x="3%" y="3%" fill="#fff" />
    <text
      x="50%"
      y="33%"
      className="base"
      dominantBaseline="middle"
      textAnchor="middle"
      style={{
        fontSize: 30,
      }}
    >
      {name}
    </text>
    <text
      x="50%"
      y="70%"
      className="base"
      dominantBaseline="middle"
      textAnchor="middle"
      style={{
        fontSize: 120,
      }}
    >
      {number}
    </text>
    <circle cx="50%" cy="9%" r={13} fill="#042BA0" />
    <circle cx="50%" cy="9%" r={12.45} fill="#F39528" />
    <circle cx="50%" cy="9%" r={11.35} fill="#042BA0" />
    <circle cx="50%" cy="9%" r={8.6} fill="#F39528" />
    <circle cx="50%" cy="9%" r={7.5} fill="#042BA0" />
    <circle cx="50%" cy="9%" r={6.4} fill="#F39528" />
    <circle cx="50%" cy="9%" r={5.3} fill="#042BA0" />
  </svg>
);

export default Example_NFT;
