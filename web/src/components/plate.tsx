// Original black-and-white "photographic plates" with an AI / technology theme.
// Drawn in code, so there are no image files or licences to manage.
// The plate is always the opposite of the page (black on light, white on dark).

export type Variant = "network" | "halftone" | "orbit" | "circuit" | "chip" | "terrain" | "code" | "tensor";

export const TECH_VARIANTS: Variant[] = ["chip", "network", "terrain", "code", "tensor", "orbit", "halftone", "circuit"];

const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";

function rng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const W = 400;
const H = 500;
const f = (n: number) => Math.round(n * 10) / 10;

function Network({ seed }: { seed: number }) {
  const r = rng(seed);
  const nodes = Array.from({ length: 36 }, () => ({ x: 24 + r() * (W - 48), y: 24 + r() * (H - 48), s: r() }));
  const edges = new Set<string>();
  const lines: { a: number; b: number }[] = [];
  nodes.forEach((n, i) => {
    nodes
      .map((m, j) => ({ j, d: (m.x - n.x) ** 2 + (m.y - n.y) ** 2 }))
      .filter((m) => m.j !== i)
      .sort((p, q) => p.d - q.d)
      .slice(0, 3)
      .forEach(({ j }) => {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (!edges.has(key)) {
          edges.add(key);
          lines.push({ a: i, b: j });
        }
      });
  });
  return (
    <>
      {[95, 160, 230].map((rad) => (
        <circle key={rad} cx={W / 2} cy={H / 2} r={rad} fill="none" stroke="currentColor" strokeOpacity={0.18} strokeWidth={0.8} />
      ))}
      {lines.map(({ a, b }) => (
        <line key={`${a}-${b}`} x1={f(nodes[a].x)} y1={f(nodes[a].y)} x2={f(nodes[b].x)} y2={f(nodes[b].y)} stroke="currentColor" strokeOpacity={0.55} strokeWidth={0.7} />
      ))}
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={f(n.x)} cy={f(n.y)} r={f(2 + n.s * 4.5)} fill="currentColor" />
          {i % 5 === 0 && <circle cx={f(n.x)} cy={f(n.y)} r={f(9 + n.s * 6)} fill="none" stroke="currentColor" strokeWidth={0.8} />}
        </g>
      ))}
    </>
  );
}

function Halftone({ seed }: { seed: number }) {
  const r = rng(seed);
  const cx = 150 + r() * 100;
  const cy = 190 + r() * 60;
  const radius = 150;
  const light = { x: cx - 55, y: cy - 60 };
  const step = 13;
  const dots: { x: number; y: number; d: number }[] = [];
  for (let y = step / 2; y < H; y += step) {
    for (let x = step / 2; x < W; x += step) {
      const dist = Math.hypot(x - cx, y - cy);
      let v = 0;
      if (dist < radius) {
        const z = Math.sqrt(1 - (dist / radius) ** 2);
        const l = Math.hypot(x - light.x, y - light.y);
        v = Math.max(0.12, 1 - l / (radius * 1.55)) * (0.55 + 0.45 * z);
      }
      // faint horizon bands below the sphere
      const band = y > cy + radius * 0.75 ? 0.12 + 0.1 * Math.sin(x / 38 + y / 11) : 0;
      const size = Math.min(1, v + band) * 6.2;
      if (size > 0.6) dots.push({ x, y, d: size });
    }
  }
  return (
    <>
      {dots.map((d, i) => (
        <circle key={i} cx={f(d.x)} cy={f(d.y)} r={f(d.d)} fill="currentColor" />
      ))}
    </>
  );
}

function Orbit({ seed }: { seed: number }) {
  const r = rng(seed);
  const rings = Array.from({ length: 10 }, (_, i) => ({ rx: 36 + i * 22, tilt: i * 17 - 40, a: r() * Math.PI * 2, a2: r() * Math.PI * 2 }));
  return (
    <>
      <g transform={`translate(${W / 2} ${H / 2})`}>
        {rings.map((g, i) => {
          const ry = g.rx * 0.38;
          const dot = (a: number) => ({ x: f(Math.cos(a) * g.rx), y: f(Math.sin(a) * ry) });
          const p1 = dot(g.a);
          const p2 = dot(g.a2);
          return (
            <g key={i} transform={`rotate(${g.tilt})`}>
              <ellipse rx={g.rx} ry={f(ry)} fill="none" stroke="currentColor" strokeWidth={0.9} strokeOpacity={0.85} />
              <circle cx={p1.x} cy={p1.y} r={3.2} fill="currentColor" />
              <circle cx={p2.x} cy={p2.y} r={1.8} fill="currentColor" />
            </g>
          );
        })}
        <circle r={22} fill="currentColor" />
        <circle r={34} fill="none" stroke="currentColor" strokeWidth={0.9} />
      </g>
    </>
  );
}

function Circuit({ seed }: { seed: number }) {
  const r = rng(seed);
  const paths = Array.from({ length: 26 }, () => {
    let x = Math.round((20 + r() * (W - 40)) / 20) * 20;
    let y = Math.round((20 + r() * (H - 40)) / 20) * 20;
    let d = `M${x} ${y}`;
    const segs = 2 + Math.floor(r() * 3);
    for (let i = 0; i < segs; i++) {
      const len = (1 + Math.floor(r() * 5)) * 20;
      const dir = Math.floor(r() * 4);
      if (dir === 0) x += len;
      else if (dir === 1) x -= len;
      else if (dir === 2) y += len;
      else y -= len;
      x = Math.min(W - 10, Math.max(10, x));
      y = Math.min(H - 10, Math.max(10, y));
      d += ` L${x} ${y}`;
      if (r() > 0.55) {
        x += 20;
        y += 20;
        d += ` L${x} ${y}`;
      }
    }
    return { d, x, y, big: r() > 0.6 };
  });
  return (
    <>
      {paths.map((p, i) => (
        <g key={i}>
          <path d={p.d} fill="none" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={p.x} cy={p.y} r={p.big ? 6 : 3.4} fill={p.big ? "none" : "currentColor"} stroke="currentColor" strokeWidth={1.3} />
        </g>
      ))}
      <rect x={160} y={210} width={80} height={80} fill="none" stroke="currentColor" strokeWidth={1.6} />
      <rect x={176} y={226} width={48} height={48} fill="currentColor" />
    </>
  );
}

// A processor die: pins, traces and vias around a core.
function Chip({ seed }: { seed: number }) {
  const r = rng(seed);
  const x0 = 120;
  const y0 = 170;
  const size = 160;
  const pins = 12;
  const gap = size / pins;
  const els: React.ReactNode[] = [];
  for (let i = 0; i < pins; i++) {
    const p = gap / 2 + i * gap;
    const reach = 30 + Math.floor(r() * 4) * 12;
    const sides = [
      { x1: x0 + p, y1: y0, x2: x0 + p, y2: y0 - reach },
      { x1: x0 + p, y1: y0 + size, x2: x0 + p, y2: y0 + size + reach },
      { x1: x0, y1: y0 + p, x2: x0 - reach, y2: y0 + p },
      { x1: x0 + size, y1: y0 + p, x2: x0 + size + reach, y2: y0 + p },
    ];
    sides.forEach((s, k) => {
      els.push(<line key={`p${i}-${k}`} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke="currentColor" strokeWidth={1.4} />);
      els.push(<circle key={`v${i}-${k}`} cx={s.x2} cy={s.y2} r={2.6} fill="currentColor" />);
    });
  }
  return (
    <>
      {[0, 1, 2].map((i) => (
        <rect key={i} x={x0 - 40 - i * 30} y={y0 - 40 - i * 30} width={size + 80 + i * 60} height={size + 80 + i * 60} fill="none" stroke="currentColor" strokeOpacity={0.16} strokeWidth={0.8} />
      ))}
      {els}
      <rect x={x0} y={y0} width={size} height={size} fill="none" stroke="currentColor" strokeWidth={2} />
      <rect x={x0 + 14} y={y0 + 14} width={size - 28} height={size - 28} fill="none" stroke="currentColor" strokeWidth={0.9} />
      {Array.from({ length: 6 }, (_, i) =>
        Array.from({ length: 6 }, (_, j) => (
          <rect key={`${i}-${j}`} x={x0 + 26 + j * 18} y={y0 + 26 + i * 18} width={13} height={13} fill="currentColor" fillOpacity={r() > 0.45 ? 0.9 : 0.12} />
        )),
      )}
      <circle cx={x0 + 8} cy={y0 + 8} r={2.4} fill="currentColor" />
      <text x={x0} y={y0 + size + 90} fill="currentColor" fontSize={8} letterSpacing={2} fontFamily={MONO}>
        AI-CORE · 4NM · {1000 + Math.floor(r() * 8000)} TOPS
      </text>
    </>
  );
}

// A wireframe landscape of data, drawn back to front so nearer rows hide farther ones.
function Terrain({ seed }: { seed: number }) {
  const r = rng(seed);
  const a = [r() * 6, r() * 6, r() * 6];
  const rows = 22;
  const cols = 44;
  const horizon = 150;
  return (
    <>
      {Array.from({ length: rows }, (_, k) => {
        const t = k / (rows - 1); // 0 far .. 1 near
        const y = horizon + t * t * 330 + 6;
        const amp = 6 + t * 62;
        const pts = Array.from({ length: cols + 1 }, (_, i) => {
          const u = i / cols;
          const x = 10 + u * (W - 20);
          const edge = Math.sin(u * Math.PI); // calm at the edges, peaks in the middle
          const h = (Math.sin(u * 9 + a[0] + k * 0.45) + Math.sin(u * 17 + a[1] - k * 0.3) * 0.6 + Math.sin(u * 4 + a[2] + k * 0.2) * 0.8) * edge;
          return `${f(x)},${f(y - Math.max(0, h) * amp)}`;
        });
        return (
          <polygon key={k} points={`10,${H} ${pts.join(" ")} ${W - 10},${H}`} fill="var(--plate)" stroke="currentColor" strokeWidth={0.9 + t * 0.5} strokeLinejoin="round" />
        );
      })}
    </>
  );
}

// A dump of code and hex, a few lines highlighted like a selection.
function Code({ seed }: { seed: number }) {
  const r = rng(seed);
  const glyphs = "0123456789ABCDEF";
  const keywords = ["model.fit()", "tokens[0:128]", "softmax(logits)", "return embed(x)", "layer.attn", "0xDEADBEEF", "tensor.shape", "if loss < eps:"];
  const rows = 30;
  return (
    <>
      {Array.from({ length: rows }, (_, i) => {
        const y = 22 + i * 15.6;
        const hit = r() > 0.86;
        const words = r() > 0.6;
        const text = words
          ? `${String(i).padStart(3, "0")}  ${keywords[Math.floor(r() * keywords.length)]}`
          : Array.from({ length: 6 }, () => Array.from({ length: 4 }, () => glyphs[Math.floor(r() * 16)]).join("")).join(" ");
        return (
          <g key={i}>
            {hit && <rect x={14} y={y - 11} width={W - 28} height={15} fill="currentColor" />}
            <text x={20} y={y} fontSize={11} fontFamily={MONO} letterSpacing={0.5} fill={hit ? "var(--plate)" : "currentColor"} fillOpacity={hit ? 1 : 0.35 + r() * 0.6}>
              {text}
            </text>
          </g>
        );
      })}
    </>
  );
}

// An attention heatmap: bright diagonal, scattered links, one highlighted row.
function Tensor({ seed }: { seed: number }) {
  const r = rng(seed);
  const n = 22;
  const cell = 15.5;
  const gap = 2.4;
  const ox = (W - n * (cell + gap)) / 2 + gap / 2;
  const oy = 60;
  const focus = 5 + Math.floor(r() * (n - 10));
  const links = Array.from({ length: 30 }, () => [Math.floor(r() * n), Math.floor(r() * n)]);
  return (
    <>
      {Array.from({ length: n }, (_, i) =>
        Array.from({ length: n }, (_, j) => {
          const diag = Math.exp(-((i - j) ** 2) / 3);
          const link = links.some(([a, b]) => a === i && b === j) ? 0.85 : 0;
          const v = Math.min(1, diag * 0.9 + link + r() * 0.12);
          return <rect key={`${i}-${j}`} x={f(ox + j * (cell + gap))} y={f(oy + i * (cell + gap))} width={cell} height={cell} fill="currentColor" fillOpacity={f(Math.max(0.05, v) * 100) / 100} />;
        }),
      )}
      <rect x={ox - 4} y={oy + focus * (cell + gap) - 4} width={n * (cell + gap) + 4} height={cell + 8} fill="none" stroke="currentColor" strokeWidth={1.6} />
      <text x={ox} y={oy + n * (cell + gap) + 26} fill="currentColor" fontSize={8} letterSpacing={2} fontFamily={MONO}>
        ATTENTION · HEAD {1 + Math.floor(r() * 11)} · LAYER {1 + Math.floor(r() * 31)}
      </text>
    </>
  );
}

export function Plate({
  variant,
  seed = 1,
  caption,
  className = "",
}: {
  variant: Variant;
  seed?: number;
  caption?: string;
  className?: string;
}) {
  return (
    <figure className={className}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label={caption ?? "Abstract technology illustration"}
        className="block h-full w-full rounded-xl"
        style={{ background: "var(--plate)", color: "var(--text)" }}
      >
        {variant === "network" && <Network seed={seed} />}
        {variant === "halftone" && <Halftone seed={seed} />}
        {variant === "orbit" && <Orbit seed={seed} />}
        {variant === "circuit" && <Circuit seed={seed} />}
        {variant === "chip" && <Chip seed={seed} />}
        {variant === "terrain" && <Terrain seed={seed} />}
        {variant === "code" && <Code seed={seed} />}
        {variant === "tensor" && <Tensor seed={seed} />}
      </svg>
      {caption && <figcaption className="mt-2 text-sm text-muted">{caption}</figcaption>}
    </figure>
  );
}
