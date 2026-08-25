"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Hand-built line diagrams — one per project — instead of stock screenshots.
 * Each shows the actual mechanism of the system it describes, drawn in the
 * cabinet's own inks: cyan for signal, magenta for faults, green for healthy.
 */

const ACCENT = "#22e8ff";
const FRAME = "0 0 480 300";

const dim = (o: number) => `rgba(234,234,255,${o})`;

function Plate({ label }: { label: string }) {
  return (
    <>
      <line x1="0" y1="30" x2="480" y2="30" stroke={dim(0.12)} />
      <text
        x="16"
        y="19"
        fontSize="9"
        letterSpacing="2.2"
        fill={ACCENT}
        fontFamily="var(--font-display)"
      >
        {label.toUpperCase()}
      </text>
      <rect x="0.5" y="0.5" width="479" height="299" fill="none" stroke={dim(0.12)} />
    </>
  );
}

/* ------------------------- 1. Shelf detection ------------------------- */

function ShelfVision({ still }: { still: boolean }) {
  const shelves = [58, 128, 198];
  const slots = [40, 106, 172, 238, 304, 370];
  const empty = new Set(["1-2", "2-4", "0-5"]);

  return (
    <svg viewBox={FRAME} className="h-full w-full">
      <Plate label="Shelf · detection pass" />

      {shelves.map((y, si) => (
        <g key={y}>
          <line x1="30" y1={y + 52} x2="450" y2={y + 52} stroke={dim(0.14)} />
          {slots.map((x, i) => {
            const key = `${si}-${i}`;
            const isEmpty = empty.has(key);
            return (
              <g key={key}>
                <rect
                  x={x}
                  y={y}
                  width="52"
                  height="50"
                  fill={isEmpty ? "none" : dim(0.06)}
                  stroke={isEmpty ? "rgba(255,61,154,0.85)" : dim(0.14)}
                  strokeDasharray={isEmpty ? "3 3" : undefined}
                />
                {!isEmpty && (
                  <motion.rect
                    x={x - 3}
                    y={y - 3}
                    width="58"
                    height="56"
                    fill="none"
                    stroke={ACCENT}
                    strokeWidth="1"
                    initial={{ opacity: 0 }}
                    animate={still ? { opacity: 0.4 } : { opacity: [0, 0.7, 0.3] }}
                    transition={{
                      duration: 2.8,
                      repeat: still ? 0 : Infinity,
                      delay: (si * 6 + i) * 0.08,
                      repeatType: "reverse",
                    }}
                  />
                )}
                {isEmpty && (
                  <text
                    x={x + 26}
                    y={y + 30}
                    textAnchor="middle"
                    fontSize="8"
                    letterSpacing="1"
                    fill="rgba(255,61,154,1)"
                    fontFamily="var(--font-display)"
                  >
                    OOS
                  </text>
                )}
              </g>
            );
          })}
        </g>
      ))}

      {!still && (
        <motion.rect
          y="31"
          width="60"
          height="268"
          fill={ACCENT}
          fillOpacity="0.06"
          initial={{ x: 0 }}
          animate={{ x: [0, 420, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      <g fontFamily="var(--font-display)" fontSize="9" letterSpacing="1.4">
        <text x="30" y="278" fill="rgba(255,61,154,1)">
          3 STOCKOUTS · PRIORITY 1
        </text>
        <text x="450" y="278" textAnchor="end" fill={dim(0.5)}>
          PLANOGRAM 94%
        </text>
      </g>
    </svg>
  );
}

/* --------------------------- 2. Retrieval --------------------------- */

function RagGraph({ still }: { still: boolean }) {
  const chunks = [70, 104, 138, 172, 206];
  const vectors: [number, number][] = [
    [240, 82],
    [276, 116],
    [232, 150],
    [284, 188],
    [246, 220],
  ];

  return (
    <svg viewBox={FRAME} className="h-full w-full">
      <Plate label="Retrieval · grounded answer" />

      <rect x="28" y="58" width="76" height="184" fill="none" stroke={dim(0.14)} />
      <text
        x="66"
        y="52"
        textAnchor="middle"
        fontSize="8"
        letterSpacing="1.4"
        fill={dim(0.45)}
        fontFamily="var(--font-display)"
      >
        CORPUS
      </text>
      {chunks.map((y, i) => {
        const hot = i === 1 || i === 3;
        return (
          <rect
            key={y}
            x="38"
            y={y}
            width="56"
            height="20"
            fill={hot ? ACCENT : dim(0.1)}
            fillOpacity={hot ? 0.35 : 1}
            stroke={hot ? ACCENT : "none"}
            strokeOpacity={0.6}
          />
        );
      })}

      {chunks.map((y, i) => (
        <motion.path
          key={`link-${y}`}
          d={`M104 ${y + 10} C 160 ${y + 10}, 180 ${vectors[i][1]}, ${vectors[i][0] - 10} ${vectors[i][1]}`}
          fill="none"
          stroke={dim(0.3)}
          strokeWidth="1"
          strokeDasharray="3 4"
          initial={{ pathLength: still ? 1 : 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 1.2,
            delay: i * 0.12,
            repeat: still ? 0 : Infinity,
            repeatDelay: 3.4,
          }}
        />
      ))}

      <circle cx="258" cy="150" r="80" fill="none" stroke={dim(0.1)} strokeDasharray="2 5" />
      <text
        x="258"
        y="52"
        textAnchor="middle"
        fontSize="8"
        letterSpacing="1.4"
        fill={dim(0.45)}
        fontFamily="var(--font-display)"
      >
        VECTOR INDEX
      </text>

      {vectors.map(([cx, cy], i) => {
        const hot = i === 1 || i === 3;
        return (
          <g key={`${cx}-${cy}`}>
            {hot && !still ? (
              <motion.circle
                cx={cx}
                cy={cy}
                r={6}
                fill={ACCENT}
                initial={{ scale: 1, opacity: 0.4 }}
                animate={{ scale: [1, 2.1, 1], opacity: [0.4, 0, 0.4] }}
                transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.3 }}
                style={{ transformOrigin: `${cx}px ${cy}px` }}
              />
            ) : null}
            <circle cx={cx} cy={cy} r={hot ? 5.5 : 3.5} fill={hot ? ACCENT : dim(0.35)} />
          </g>
        );
      })}

      <rect x="352" y="112" width="100" height="76" fill="none" stroke={ACCENT} strokeOpacity="0.55" />
      <text
        x="402"
        y="134"
        textAnchor="middle"
        fontSize="8"
        letterSpacing="1.4"
        fill={ACCENT}
        fontFamily="var(--font-display)"
      >
        ANSWER
      </text>
      <rect x="366" y="144" width="72" height="3" fill={dim(0.25)} />
      <rect x="366" y="153" width="58" height="3" fill={dim(0.18)} />
      <rect x="366" y="162" width="66" height="3" fill={dim(0.18)} />
      <g fontFamily="var(--font-display)" fontSize="7" fill={ACCENT}>
        <text x="366" y="180">
          [1]
        </text>
        <text x="386" y="180">
          [2]
        </text>
      </g>

      {[1, 3].map((i, k) => (
        <motion.path
          key={`out-${i}`}
          d={`M${vectors[i][0] + 8} ${vectors[i][1]} C 320 ${vectors[i][1]}, 330 150, 352 ${140 + k * 14}`}
          fill="none"
          stroke={ACCENT}
          strokeOpacity="0.6"
          strokeWidth="1.2"
          initial={{ pathLength: still ? 1 : 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 1,
            delay: 1.4 + k * 0.2,
            repeat: still ? 0 : Infinity,
            repeatDelay: 3.6,
          }}
        />
      ))}
    </svg>
  );
}

/* -------------------------- 3. Delivery route -------------------------- */

function RouteMap({ still }: { still: boolean }) {
  const stops = [
    { x: 60, y: 200, label: "BOOKED" },
    { x: 175, y: 120, label: "PICKED UP" },
    { x: 300, y: 190, label: "IN TRANSIT" },
    { x: 420, y: 100, label: "DELIVERED" },
  ];
  const path =
    "M60 200 C 110 200, 130 120, 175 120 S 255 190, 300 190 S 375 100, 420 100";

  return (
    <svg viewBox={FRAME} className="h-full w-full">
      <Plate label="Consignment · lifecycle" />

      {Array.from({ length: 9 }).map((_, i) => (
        <line
          key={`v${i}`}
          x1={i * 55 + 26}
          y1="34"
          x2={i * 55 + 26}
          y2="300"
          stroke={dim(0.045)}
        />
      ))}
      {Array.from({ length: 5 }).map((_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 54 + 50} x2="480" y2={i * 54 + 50} stroke={dim(0.045)} />
      ))}

      <path d={path} fill="none" stroke={dim(0.15)} strokeWidth="1.5" strokeLinecap="round" />
      <motion.path
        d={path}
        fill="none"
        stroke={ACCENT}
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: still ? 1 : 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          duration: 3.4,
          repeat: still ? 0 : Infinity,
          repeatDelay: 1.2,
          ease: "easeInOut",
        }}
      />

      {stops.map((s, i) => (
        <g key={s.label}>
          <circle cx={s.x} cy={s.y} r="11" fill="#05030f" stroke={ACCENT} strokeOpacity="0.55" />
          <circle cx={s.x} cy={s.y} r="3.5" fill={ACCENT} />
          <text
            x={s.x}
            y={s.y - 21}
            textAnchor="middle"
            fontSize="8"
            letterSpacing="1.2"
            fill={dim(0.55)}
            fontFamily="var(--font-display)"
          >
            {s.label}
          </text>
          <text
            x={s.x}
            y={s.y + 28}
            textAnchor="middle"
            fontSize="8"
            fill={dim(0.3)}
            fontFamily="var(--font-display)"
          >
            0{i + 1}
          </text>
        </g>
      ))}

      <g fontFamily="var(--font-display)" fontSize="9" letterSpacing="1.4" fill={dim(0.5)}>
        <text x="30" y="278">
          MYSQL · LEDGER
        </text>
        <text x="450" y="278" textAnchor="end">
          ADMIN CONSOLE
        </text>
      </g>
    </svg>
  );
}

/* ------------------------- 4. Marketplace grid ------------------------- */

function MarketGrid({ still }: { still: boolean }) {
  const columns = [
    { x: 30, title: "PRODUCTS", n: 4 },
    { x: 180, title: "SERVICES", n: 3 },
    { x: 330, title: "SPACES", n: 4 },
  ];

  return (
    <svg viewBox={FRAME} className="h-full w-full">
      <Plate label="Marketplace · one model" />

      {columns.map((col, ci) => (
        <g key={col.title}>
          <text
            x={col.x + 60}
            y="54"
            textAnchor="middle"
            fontSize="8"
            letterSpacing="1.6"
            fill={ACCENT}
            fontFamily="var(--font-display)"
          >
            {col.title}
          </text>
          <line x1={col.x} y1="62" x2={col.x + 120} y2="62" stroke={ACCENT} strokeOpacity="0.3" />

          {Array.from({ length: col.n }).map((_, i) => (
            <motion.g
              key={i}
              initial={{ opacity: still ? 1 : 0, y: still ? 0 : 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.08 * (ci * 4 + i) }}
            >
              <rect
                x={col.x}
                y={76 + i * 48}
                width="120"
                height="40"
                fill={dim(0.04)}
                stroke={dim(0.12)}
              />
              <rect x={col.x + 8} y={84 + i * 48} width="24" height="24" fill={ACCENT} fillOpacity="0.25" />
              <rect x={col.x + 40} y={88 + i * 48} width="56" height="3" fill={dim(0.26)} />
              <rect x={col.x + 40} y={97 + i * 48} width="36" height="3" fill={dim(0.16)} />
              <circle cx={col.x + 110} cy={96 + i * 48} r="2.5" fill="#3ef29a" />
            </motion.g>
          ))}
        </g>
      ))}

      <g fontFamily="var(--font-display)" fontSize="9" letterSpacing="1.4">
        <text x="30" y="278" fill="#3ef29a">
          AUTH · SESSION OK
        </text>
        <text x="450" y="278" textAnchor="end" fill={dim(0.5)}>
          CRUD · REALTIME
        </text>
      </g>

      {!still && (
        <motion.rect
          x="0"
          y="31"
          width="480"
          height="1"
          fill={ACCENT}
          fillOpacity="0.3"
          animate={{ y: [31, 288, 31] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </svg>
  );
}

/* ---------------------------- 5. Agent loop ---------------------------- */

function AgentLoop({ still }: { still: boolean }) {
  const cx = 240;
  const cy = 168;
  const r = 80;
  const nodes = [
    { a: -90, label: "PLAN" },
    { a: 0, label: "TOOL" },
    { a: 90, label: "OBSERVE" },
    { a: 180, label: "DECIDE" },
  ];

  const pos = (a: number) => ({
    x: cx + r * Math.cos((a * Math.PI) / 180),
    y: cy + r * Math.sin((a * Math.PI) / 180),
  });

  return (
    <svg viewBox={FRAME} className="h-full w-full">
      <Plate label="Agent · bounded loop" />

      <circle cx={cx} cy={cy} r={r} fill="none" stroke={dim(0.12)} strokeWidth="1.5" />
      <motion.circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={ACCENT}
        strokeWidth="1.5"
        strokeDasharray="58 445"
        animate={still ? {} : { rotate: 360 }}
        transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />

      {nodes.map((n, i) => {
        const p = pos(n.a);
        return (
          <g key={n.label}>
            <circle cx={p.x} cy={p.y} r="21" fill="#05030f" stroke={ACCENT} strokeOpacity="0.5" />
            <motion.circle
              cx={p.x}
              cy={p.y}
              r="21"
              fill={ACCENT}
              fillOpacity="0.08"
              animate={still ? {} : { opacity: [0.15, 0.55, 0.15] }}
              transition={{ duration: 7, repeat: Infinity, delay: i * 1.75 }}
            />
            <text
              x={p.x}
              y={p.y + 3}
              textAnchor="middle"
              fontSize="8"
              letterSpacing="0.8"
              fill={dim(0.85)}
              fontFamily="var(--font-display)"
            >
              {n.label}
            </text>
          </g>
        );
      })}

      <rect x={cx - 42} y={cy - 17} width="84" height="34" fill="none" stroke={dim(0.14)} />
      <text
        x={cx}
        y={cy - 3}
        textAnchor="middle"
        fontSize="8"
        letterSpacing="1.2"
        fill={dim(0.45)}
        fontFamily="var(--font-display)"
      >
        CONTEXT
      </text>
      <text
        x={cx}
        y={cy + 9}
        textAnchor="middle"
        fontSize="8"
        letterSpacing="1.2"
        fill={ACCENT}
        fontFamily="var(--font-display)"
      >
        PERSISTENT
      </text>

      <g fontFamily="var(--font-display)" fontSize="8" letterSpacing="1.2" fill={dim(0.5)}>
        {["SEARCH", "FILES", "SHELL", "VOICE"].map((t, i) => (
          <g key={t}>
            <line x1={30 + i * 106} y1="266" x2={30 + i * 106 + 94} y2="266" stroke={dim(0.12)} />
            <text x={77 + i * 106} y="280" textAnchor="middle">
              {t}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}

/* ------------------------------ dispatcher ------------------------------ */

const VISUALS: Record<string, typeof ShelfVision> = {
  "retail-intelligence": ShelfVision,
  "conversational-rag": RagGraph,
  gopackage: RouteMap,
  rentit: MarketGrid,
  "ai-assistant": AgentLoop,
};

export function ProjectVisual({ id, title }: { id: string; title: string }) {
  const reduced = useReducedMotion();
  const Visual = VISUALS[id] ?? ShelfVision;

  return (
    <figure
      className="relative aspect-[16/10] w-full overflow-hidden border border-violet/30 bg-deep"
      role="img"
      aria-label={`Architecture diagram for ${title}`}
    >
      <Visual still={Boolean(reduced)} />
    </figure>
  );
}
