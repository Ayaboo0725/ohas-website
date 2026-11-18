import type { ReactNode } from "react";

/**
 * Line illustrations used inside photo placeholders.
 * They are deliberately drawn, not photographic, so nobody mistakes
 * them for real OHAS products. Replace with real photos via the data files.
 */

const F = { fill: "currentColor", fillOpacity: 0.09 } as const;
const F2 = { fill: "currentColor", fillOpacity: 0.2 } as const;
const HI = { stroke: "#fff", strokeOpacity: 0.75 } as const;

function zigzag(x0: number, x1: number, y: number, step = 4, amp = 2.5) {
  let d = `M${x0} ${y}`;
  let up = true;
  for (let x = x0 + step; x <= x1; x += step) {
    d += ` L${x} ${up ? y - amp : y}`;
    up = !up;
  }
  return d;
}

function verticals(x0: number, x1: number, step: number, y0: number, y1: number) {
  let d = "";
  for (let x = x0; x <= x1; x += step) d += `M${x} ${y0} L${x} ${y1} `;
  return d;
}

function strawberry(cx: number, cy: number, s = 1) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${s})`}>
      <path {...F2} d="M0 -8 C-6 -8 -9 -2 -7 4 C-5 9 0 12 0 12 C0 12 5 9 7 4 C9 -2 6 -8 0 -8 Z" />
      <path d="M-4 -8 L0 -12 L4 -8 M0 -12 L0 -8" />
      <circle cx="-2.5" cy="-1" r="0.5" />
      <circle cx="2.5" cy="1" r="0.5" />
      <circle cx="0" cy="5" r="0.5" />
    </g>
  );
}

function steam(xs: number[], y: number, h = 24) {
  return xs.map((x, i) => (
    <path
      key={i}
      opacity={0.55}
      d={`M${x} ${y} C${x - 6} ${y - h * 0.33} ${x + 6} ${y - h * 0.6} ${x} ${y - h}`}
    />
  ));
}

const ART: Record<string, ReactNode> = {
  croissant: (
    <>
      <path d="M26 122 C60 128 100 128 134 122" opacity={0.3} />
      <path
        {...F}
        d="M14 108 C20 86 44 62 80 60 C116 62 140 86 146 108 C136 101 122 98 110 102 C100 108 60 108 50 102 C38 98 24 101 14 108 Z"
      />
      <path d="M62 63 C57 77 57 93 60 106" />
      <path d="M98 63 C103 77 103 93 100 106" />
      <path d="M42 72 C38 82 39 93 44 101" />
      <path d="M118 72 C122 82 121 93 116 101" />
      <path d="M27 86 C26 92 28 97 31 100" />
      <path d="M133 86 C134 92 132 97 129 100" />
      <path {...HI} d="M70 69 C76 66 84 66 90 69" />
      <path {...HI} d="M48 80 C50 76 53 73 56 71" />
      <path {...HI} d="M106 71 C109 73 112 76 113 80" />
      <circle cx="40" cy="128" r="1.3" />
      <circle cx="47" cy="131" r="0.9" />
      <circle cx="118" cy="130" r="1.1" />
    </>
  ),
  baguette: (
    <g transform="rotate(-30 80 80)">
      <path d="M22 104 C60 110 104 110 140 104" opacity={0.3} />
      <path
        {...F}
        d="M16 82 C16 72 30 67 46 67 L114 67 C130 67 144 72 144 82 C144 90 130 94 114 94 L46 94 C30 94 16 90 16 82 Z"
      />
      {[38, 58, 78, 98, 118].map((x) => (
        <g key={x}>
          <path d={`M${x - 9} 79 C${x - 3} 73 ${x + 5} 71 ${x + 11} 73`} />
          <path {...HI} d={`M${x - 6} 76 C${x - 1} 72.5 ${x + 4} 71.5 ${x + 8} 72`} />
        </g>
      ))}
      {[[33, 86], [52, 88], [71, 85], [90, 88], [109, 86], [126, 84], [45, 74], [84, 76]].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="0.9" fill="currentColor" />
      ))}
    </g>
  ),
  apple: (
    <>
      <path d="M40 134 C64 138 96 138 120 134" opacity={0.3} />
      <path
        {...F}
        d="M80 54 C70 44 44 44 36 68 C28 94 46 126 64 128 C71 129 75 125 80 125 C85 125 89 129 96 128 C114 126 132 94 124 68 C116 44 90 44 80 54 Z"
      />
      <path d="M80 54 C79 46 81 40 86 34" />
      <path {...F2} d="M85 42 C92 32 106 32 110 36 C104 44 94 46 85 42 Z" />
      <path d="M87 41 C95 38 102 37 108 36" opacity={0.6} />
      <path {...HI} d="M48 76 C48 67 53 60 61 57" />
      <path d="M70 57 C75 59 85 59 90 57" opacity={0.5} />
      {[[60, 90], [74, 100], [96, 92], [104, 106], [66, 112], [88, 112]].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="0.8" fill="currentColor" opacity={0.6} />
      ))}
    </>
  ),
  layers: (
    <>
      <path d="M16 126 L144 126" opacity={0.4} />
      <rect {...F} x="32" y="70" width="96" height="50" rx="3" />
      <path d="M32 70 C36 62 44 62 48 70 C52 62 60 62 64 70 C68 62 76 62 80 70 C84 62 92 62 96 70 C100 62 108 62 112 70 C116 62 124 62 128 70" />
      <path d="M32 84 C48 81 64 87 80 84 C96 81 112 87 128 84" />
      <path d="M32 96 C48 93 64 99 80 96 C96 93 112 99 128 96" />
      <path d="M32 108 C48 105 64 111 80 108 C96 105 112 111 128 108" />
      {strawberry(54, 54, 0.95)}
      {strawberry(80, 50, 1.15)}
      {strawberry(106, 54, 0.95)}
      <path {...HI} d="M38 76 L58 75" />
    </>
  ),
  sandwich: (
    <>
      <path d="M26 124 C60 130 100 130 134 124" opacity={0.3} />
      <path {...F} d="M18 90 C24 70 46 52 80 50 C114 52 136 70 142 90 C120 86 40 86 18 90 Z" />
      <path d="M62 53 C58 64 58 76 60 87" />
      <path d="M98 53 C102 64 102 76 100 87" />
      <path d="M40 62 C37 70 38 79 41 86" />
      <path d="M120 62 C123 70 122 79 119 86" />
      <path d="M16 95 C24 89 30 99 38 93 C46 87 52 99 60 93 C68 87 74 99 82 93 C90 87 96 99 104 93 C112 87 118 99 126 93 C134 87 140 97 144 95" />
      <path {...F2} d="M22 99 C50 106 110 106 138 99 L136 104 C110 110 50 110 24 104 Z" />
      <ellipse cx="56" cy="102" rx="6" ry="2" opacity={0.6} />
      <ellipse cx="100" cy="103" rx="6" ry="2" opacity={0.6} />
      <path {...F} d="M22 106 C34 120 126 120 138 106" />
      <path {...HI} d="M70 59 C76 56 84 56 90 59" />
    </>
  ),
  cake: (
    <>
      <path d="M14 124 C14 132 146 132 146 124" opacity={0.4} />
      <path {...F} d="M30 60 L30 106 C30 115 52 122 80 122 C108 122 130 115 130 106 L130 60 Z" />
      <ellipse cx="80" cy="60" rx="50" ry="14" fill="currentColor" fillOpacity={0.05} />
      <path d="M30 84 C30 93 52 100 80 100 C108 100 130 93 130 84" />
      {[[42, 66], [56, 71], [71, 73.5], [89, 73.5], [104, 71], [118, 66]].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="4.5" fill="currentColor" fillOpacity={0.12} />
      ))}
      {strawberry(80, 52, 1.1)}
      {strawberry(60, 55, 0.8)}
      {strawberry(100, 55, 0.8)}
      <path {...HI} d="M36 88 L36 104" />
    </>
  ),
  slice: (
    <>
      <path d="M10 122 C40 130 120 130 150 120" opacity={0.4} />
      <path {...F} d="M24 88 L122 62 C132 68 138 76 140 86 Z" />
      <path {...F} d="M24 88 L24 112 L140 110 L140 86" />
      <path {...F2} d="M24 104 L140 102 L140 110 L24 112 Z" />
      <path d="M122 62 C126 70 128 78 128 86" opacity={0.5} />
      <path {...HI} d="M34 92 L34 100" />
      {strawberry(118, 66, 0.9)}
    </>
  ),
  tart: (
    <>
      <path {...F} d="M26 80 L30 96 C36 106 124 106 130 96 L134 80 Z" />
      <ellipse cx="80" cy="80" rx="54" ry="20" fill="currentColor" fillOpacity={0.05} />
      <path d={verticals(36, 124, 8, 92, 100)} opacity={0.5} />
      <ellipse cx="80" cy="79" rx="45" ry="15" />
      {[[62, 77, 6], [80, 72, 7], [98, 77, 6], [71, 85, 5], [90, 85, 5], [54, 84, 3.5], [106, 84, 3.5]].map(([x, y, r]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r={r} fill="currentColor" fillOpacity={0.16} />
      ))}
      <path {...HI} d="M77 69 C79 68 82 68 84 69" />
    </>
  ),
  macaron: (
    <>
      <path d="M22 116 C50 122 110 122 138 116" opacity={0.3} />
      <g transform="translate(34 -18)" opacity={0.75}>
        <path {...F} d="M48 70 C48 58 104 58 104 70 Z" />
        <path d={zigzag(49, 103, 74, 3.5, 2)} />
        <path {...F2} d="M50 76 L102 76 L102 81 L50 81 Z" />
        <path d={zigzag(49, 103, 85, 3.5, 2)} />
        <path {...F} d="M48 86 L104 86 C104 94 48 94 48 86 Z" />
      </g>
      <path {...F} d="M24 76 C24 58 108 58 108 76 Z" />
      <path d={zigzag(25, 107, 80, 4, 2.5)} />
      <path {...F2} d="M27 82 L105 82 L105 90 L27 90 Z" />
      <path d={zigzag(25, 107, 94, 4, 2.5)} />
      <path {...F} d="M24 95 L108 95 C108 106 24 106 24 95 Z" />
      <path {...HI} d="M38 68 C44 64 52 62 60 62" />
    </>
  ),
  cookie: (
    <>
      <path
        {...F}
        d="M80 34 C104 34 124 52 126 74 C118 72 112 78 114 86 C106 86 102 94 106 100 C98 116 88 126 80 126 C54 126 34 106 34 80 C34 54 54 34 80 34 Z"
      />
      {[[62, 60], [84, 54], [56, 90], [78, 100], [96, 74], [66, 112], [100, 104], [74, 78]].map(([x, y], i) => (
        <path
          key={i}
          fill="currentColor"
          fillOpacity={0.35}
          stroke="none"
          d={`M${x} ${y} l5 -2 l3 4 l-2 5 l-6 0 z`}
        />
      ))}
      <circle cx="128" cy="92" r="1.6" />
      <circle cx="133" cy="101" r="1" />
      <circle cx="122" cy="106" r="1.3" />
      <path {...HI} d="M50 62 C54 54 60 48 68 44" />
    </>
  ),
  cup: (
    <>
      <path {...F} d="M22 126 C22 134 138 134 138 126 C138 120 22 120 22 126 Z" />
      <path {...F} d="M44 72 L48 108 C50 120 62 126 80 126 C98 126 110 120 112 108 L116 72 Z" />
      <ellipse cx="80" cy="72" rx="36" ry="7" fill="#fff" fillOpacity={0.35} />
      <ellipse cx="80" cy="73" rx="30" ry="4.5" fill="currentColor" fillOpacity={0.3} stroke="none" />
      <path d="M114 82 C130 80 134 98 120 104 C116 106 112 105 110 104" />
      {steam([68, 82, 96], 60, 26)}
      <path {...HI} d="M54 80 L57 108" />
    </>
  ),
  iced: (
    <>
      <path d="M40 138 L120 138" opacity={0.35} />
      <path {...F} d="M50 36 L56 128 C56 132 60 134 64 134 L96 134 C100 134 104 132 104 128 L110 36 Z" />
      <path {...F2} d="M53 92 C66 88 78 96 90 92 C98 89 104 92 107 91 L104 128 C104 132 100 134 96 134 L64 134 C60 134 56 132 56 128 Z" />
      <path d="M51 50 C62 46 72 54 82 50 C92 46 100 54 109 50" />
      <rect x="60" y="56" width="16" height="16" rx="3" transform="rotate(12 68 64)" fill="#fff" fillOpacity={0.4} />
      <rect x="84" y="62" width="15" height="15" rx="3" transform="rotate(-10 91 69)" fill="#fff" fillOpacity={0.4} />
      <rect x="70" y="76" width="14" height="14" rx="3" transform="rotate(20 77 83)" fill="#fff" fillOpacity={0.4} />
      <path d="M92 36 L102 12" strokeWidth={3} />
      <path {...HI} d="M58 44 L62 120" />
    </>
  ),
  cubes: (
    <>
      <path d="M30 138 L130 138" opacity={0.35} />
      <path {...F} d="M40 56 L48 126 C48 130 52 132 56 132 L104 132 C108 132 112 130 112 126 L120 56 Z" />
      <path d="M42 70 C60 66 100 74 118 70" />
      {[[54, 74, 22, -8], [82, 80, 22, 12], [62, 100, 20, 24], [88, 104, 18, -14]].map(([x, y, s, r], i) => (
        <rect
          key={i}
          x={x}
          y={y}
          width={s}
          height={s}
          rx="3.5"
          transform={`rotate(${r} ${x + s / 2} ${y + s / 2})`}
          fill="currentColor"
          fillOpacity={0.32}
        />
      ))}
      <path d="M66 98 C64 106 68 112 66 120" opacity={0.5} />
      <path d="M94 102 C96 110 92 116 94 124" opacity={0.5} />
      <path {...HI} d="M48 64 L54 122" />
    </>
  ),
  coconut: (
    <>
      <path d="M14 136 L146 136" opacity={0.35} />
      <path {...F} d="M84 40 L90 128 C90 132 94 134 98 134 L122 134 C126 134 130 132 130 128 L136 40 Z" />
      <path d="M85 54 C96 50 104 58 114 54 C122 50 130 56 135 54" />
      <path d="M120 40 L128 16" strokeWidth={3} />
      <path {...F2} d="M18 104 C18 134 94 134 94 104 Z" />
      <ellipse cx="56" cy="104" rx="38" ry="7" fill="#fff" fillOpacity={0.6} />
      <ellipse cx="56" cy="104" rx="31" ry="4.5" />
      <path d="M26 116 C40 124 72 124 86 116" opacity={0.5} />
      <path d="M32 124 C46 130 66 130 80 124" opacity={0.5} />
      {[[40, 88, 20], [62, 80, -30], [76, 92, 45], [50, 70, 10]].map(([x, y, r], i) => (
        <rect key={i} x={x} y={y} width="6" height="2.5" rx="1" transform={`rotate(${r} ${x} ${y})`} />
      ))}
      <path {...HI} d="M92 50 L96 124" />
    </>
  ),
  bingsu: (
    <>
      <path {...F} d="M26 96 C28 122 132 122 134 96 Z" />
      <ellipse cx="80" cy="96" rx="54" ry="8" fill="#fff" fillOpacity={0.6} />
      <path d="M62 120 L58 130 L102 130 L98 120" />
      <path d="M32 96 C34 70 56 48 80 46 C104 48 126 70 128 96" fill="#fff" fillOpacity={0.45} />
      {[[50, 80], [62, 66], [72, 84], [92, 70], [104, 82], [86, 90], [58, 92], [112, 92], [44, 90], [96, 60]].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="0.9" />
      ))}
      <circle cx="80" cy="50" r="14" fill="currentColor" fillOpacity={0.25} />
      <path d="M71 60 C70 66 72 68 72 72" />
      <path {...HI} d="M72 42 C75 39 79 38 83 38" />
      <path d="M108 54 L132 22" strokeWidth={2.4} />
      <ellipse cx="134" cy="19" rx="5" ry="3" transform="rotate(-52 134 19)" />
    </>
  ),
  tea: (
    <>
      <path {...F} d="M22 124 C22 132 138 132 138 124 C138 118 22 118 22 124 Z" />
      <path {...F} d="M38 78 C38 106 56 120 80 120 C104 120 122 106 122 78 Z" />
      <ellipse cx="80" cy="78" rx="42" ry="7" fill="#fff" fillOpacity={0.35} />
      <ellipse cx="80" cy="79" rx="36" ry="4.5" fill="currentColor" fillOpacity={0.22} stroke="none" />
      <path d="M121 86 C134 86 136 102 124 106" />
      <path d="M96 76 C100 62 106 52 112 46" opacity={0.7} />
      <rect x="108" y="34" width="14" height="12" rx="1.5" transform="rotate(10 115 40)" fill="currentColor" fillOpacity={0.15} />
      {steam([66, 80], 66, 22)}
    </>
  ),
  smoothie: (
    <>
      <path d="M40 136 L120 136" opacity={0.35} />
      <path {...F} d="M56 50 C52 80 54 118 62 130 L98 130 C106 118 108 80 104 50 Z" />
      <path {...F2} d="M55 74 C66 70 78 78 90 74 C98 71 102 74 105 73 C106 96 104 118 98 130 L62 130 C56 118 54 96 55 74 Z" />
      <path d="M52 50 C54 34 106 34 108 50 Z" fill="#fff" fillOpacity={0.5} />
      <path d="M88 38 L100 10" strokeWidth={3} />
      {strawberry(108, 50, 1.1)}
      <path {...HI} d="M62 58 L64 122" />
    </>
  ),
  affogato: (
    <>
      <path d="M36 136 L124 136" opacity={0.35} />
      <path {...F} d="M48 70 L56 124 C56 128 60 130 64 130 L96 130 C100 130 104 128 104 124 L112 70 Z" />
      <path d="M54 70 C52 50 68 42 80 42 C92 42 108 50 106 70" fill="#fff" fillOpacity={0.5} />
      <path d="M62 70 C62 76 64 78 64 84 M96 70 C96 74 94 76 94 80" opacity={0.6} />
      <path {...F2} d="M122 24 L142 18 L146 32 C144 38 132 40 126 36 Z" />
      <path {...F2} d="M126 34 C116 40 104 46 92 50 L90 46 C102 42 114 36 124 30 Z" />
      <path d="M58 78 C70 82 90 82 102 78" opacity={0.6} />
      <path {...HI} d="M58 90 L62 122" />
    </>
  ),
  heart: (
    <>
      <path
        {...F}
        d="M80 124 C60 108 30 90 30 64 C30 48 42 38 56 38 C66 38 74 44 80 52 C86 44 94 38 104 38 C118 38 130 48 130 64 C130 90 100 108 80 124 Z"
      />
      <path
        strokeDasharray="3 4"
        opacity={0.6}
        d="M80 112 C64 99 42 85 42 65 C42 54 50 48 58 48 C66 48 72 53 80 62 C88 53 94 48 102 48 C110 48 118 54 118 65 C118 85 96 99 80 112 Z"
      />
      <path {...HI} d="M44 60 C46 52 52 47 58 46" />
    </>
  ),
  charlotte: (
    <>
      <path d="M14 122 C14 130 146 130 146 122" opacity={0.4} />
      <path {...F} d="M32 64 L32 112 C32 118 54 122 80 122 C106 122 128 118 128 112 L128 64 Z" />
      <ellipse cx="80" cy="64" rx="48" ry="12" fill="#fff" fillOpacity={0.3} />
      {Array.from({ length: 12 }).map((_, i) => {
        const x = 34 + i * 8;
        return <path key={i} opacity={0.65} d={`M${x} 118 L${x} 66 C${x} 60 ${x + 7} 60 ${x + 7} 66 L${x + 7} 119`} />;
      })}
      <path {...F2} d="M32 92 C32 100 128 100 128 92 L128 98 C128 106 32 106 32 98 Z" />
      <path d="M80 100 C70 92 64 104 80 102 C96 104 90 92 80 100 Z" />
      <path d="M80 102 L74 114 M80 102 L86 114" />
      {strawberry(64, 58, 1)}
      {strawberry(80, 55, 1.15)}
      {strawberry(96, 58, 1)}
    </>
  ),
  mousse: (
    <>
      <path d="M14 122 C14 130 146 130 146 122" opacity={0.4} />
      <path {...F2} d="M28 108 L132 108 L132 117 L28 117 Z" />
      <path {...F} d="M34 108 C34 70 56 50 80 50 C104 50 126 70 126 108 Z" />
      <path {...HI} d="M50 82 C52 70 60 62 70 58" />
      <path {...HI} d="M48 92 L48 98" />
      {strawberry(80, 46, 1.1)}
      {[[64, 66], [96, 66], [72, 78], [90, 80], [58, 90], [104, 90]].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="1.1" fill="currentColor" />
      ))}
    </>
  ),
  building: (
    <>
      <path d="M6 132 L154 132" />
      <path d="M6 138 L154 138" opacity={0.3} strokeDasharray="8 6" />
      <path {...F} d="M24 132 L24 50 L132 50 L132 132 Z" />
      <path {...F2} d="M20 50 L136 50 L136 44 L20 44 Z" />
      <rect x="62" y="35" width="32" height="9" rx="1" fill="currentColor" fillOpacity={0.15} />
      <path d="M24 90 L132 90" />
      <path d={verticals(28, 128, 6, 80, 90)} opacity={0.7} />
      <path d="M24 80 L132 80" />
      {[34, 66, 98].map((x) => (
        <rect key={x} x={x} y="56" width="22" height="20" rx="1" fill="#fff" fillOpacity={0.35} />
      ))}
      <path d="M28 98 L78 98 L74 105 L32 105 Z" fill="currentColor" fillOpacity={0.18} />
      <rect x="32" y="106" width="38" height="26" fill="#fff" fillOpacity={0.35} />
      <rect x="80" y="104" width="16" height="28" />
      <rect x="102" y="104" width="24" height="28" fill="#fff" fillOpacity={0.35} />
      <path d="M150 132 C147 110 148 92 151 76" strokeWidth={2.2} />
      <path d="M151 76 C140 70 130 72 124 78 M151 76 C146 64 136 60 128 62 M151 76 C156 66 154 56 148 50 M151 76 C160 72 164 74 158 84" />
      <circle cx="30" cy="22" r="8" opacity={0.6} />
    </>
  ),
  case: (
    <>
      <path {...F} d="M18 92 L142 92 L142 132 L18 132 Z" />
      <path d="M22 92 L22 56 C22 50 26 46 32 46 L128 46 C134 46 138 50 138 56 L138 92" fill="#fff" fillOpacity={0.3} />
      <path d="M22 70 L138 70" />
      <path {...F2} d="M28 70 C28 61 42 61 42 70 Z" />
      <path {...F2} d="M48 70 C50 62 60 60 66 62 C70 64 72 68 72 70 Z" />
      <path {...F2} d="M78 70 C78 62 92 62 92 70 Z" />
      <path {...F2} d="M98 70 C100 63 112 61 118 64 C121 66 122 69 122 70 Z" />
      <rect x="28" y="80" width="18" height="12" rx="1" fill="currentColor" fillOpacity={0.18} />
      <rect x="52" y="78" width="22" height="14" rx="1" fill="currentColor" fillOpacity={0.18} />
      <circle cx="88" cy="86" r="6" fill="currentColor" fillOpacity={0.18} />
      <circle cx="104" cy="86" r="6" fill="currentColor" fillOpacity={0.18} />
      <rect x="114" y="80" width="18" height="12" rx="1" fill="currentColor" fillOpacity={0.18} />
      <path d="M40 50 L52 66 M98 50 L110 66" opacity={0.4} />
      <path d="M18 112 L142 112" opacity={0.4} />
    </>
  ),
  oven: (
    <>
      <rect {...F} x="20" y="28" width="120" height="70" rx="4" />
      <rect x="32" y="44" width="96" height="40" rx="2" fill="currentColor" fillOpacity={0.22} />
      <path d="M40 38 L120 38" opacity={0.6} />
      <path d="M28 122 L132 122 L124 130 L36 130 Z" fill="currentColor" fillOpacity={0.14} />
      {[44, 72, 100].map((x) => (
        <g key={x}>
          <path {...F2} d={`M${x} 122 C${x} 106 ${x + 22} 106 ${x + 22} 122 Z`} />
          <path d={`M${x + 6} 114 C${x + 10} 111 ${x + 14} 111 ${x + 17} 112`} opacity={0.7} />
        </g>
      ))}
      {steam([55, 83, 111], 104, 18)}
    </>
  ),
  dough: (
    <>
      <path d="M10 118 L150 118" />
      <path {...F} d="M38 118 C34 92 56 78 80 78 C104 78 124 92 120 118 Z" />
      <path d="M58 96 C68 90 90 90 102 96" opacity={0.6} />
      <path {...HI} d="M52 98 C54 90 60 86 66 84" />
      <path {...F2} d="M120 68 L142 90 L134 98 L112 76 Z" />
      <path d="M114 74 L108 68 L128 48 L134 54" />
      <path d="M16 134 L104 134" strokeWidth={5} opacity={0.35} />
      {[[24, 110], [30, 104], [132, 110], [140, 104], [50, 72], [110, 70], [68, 66], [92, 64], [20, 96], [140, 114]].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="0.9" fill="currentColor" />
      ))}
    </>
  ),
  table: (
    <>
      {[46, 80, 114].map((x) => (
        <g key={x}>
          <path d={`M${x} 0 L${x} 26`} opacity={0.6} />
          <path {...F2} d={`M${x - 11} 36 C${x - 11} 27 ${x + 11} 27 ${x + 11} 36 Z`} />
          <circle cx={x} cy="42" r="5" fill="#fff" fillOpacity={0.6} stroke="none" />
        </g>
      ))}
      {[22, 42, 62, 82, 102, 122].map((x) => (
        <path key={x} {...F} d={`M${x} 96 L${x} 70 C${x} 65 ${x + 14} 65 ${x + 14} 70 L${x + 14} 96`} />
      ))}
      <path {...F2} d="M10 96 L150 96 L150 102 L10 102 Z" />
      <path d="M20 102 L20 132 M140 102 L140 132 M80 102 L80 132" />
      {[34, 70, 106].map((x) => (
        <path key={x} d={`M${x} 96 L${x + 2} 88 L${x + 10} 88 L${x + 12} 96`} />
      ))}
    </>
  ),
  terrace: (
    <>
      <path d="M0 74 L160 74" opacity={0.3} />
      <path d="M8 64 L40 64 L40 74 M52 56 L84 56 L84 74 M120 60 L150 60 L150 74" opacity={0.3} />
      <circle cx="118" cy="40" r="14" fill="#fff" fillOpacity={0.5} />
      <path d="M10 100 L150 100" strokeWidth={2.2} />
      <path d={verticals(16, 146, 10, 100, 132)} opacity={0.75} />
      <path d="M10 132 L150 132" />
      <path {...F} d="M92 100 L94 88 L110 88 L112 100" />
      <path d="M111 91 C116 91 117 96 112 97" />
      {steam([98, 104], 84, 14)}
      <path d="M0 24 C14 26 26 34 34 46 M0 24 C10 16 24 14 34 18 M0 24 C4 34 4 46 0 56" />
    </>
  ),
};

export function Illustration({ name, className, size }: { name: string; className?: string; size?: number }) {
  const art = ART[name] ?? ART.croissant;
  return (
    <svg
      viewBox="0 0 160 160"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={`art ${className ?? ""}`}
    >
      {art}
    </svg>
  );
}
