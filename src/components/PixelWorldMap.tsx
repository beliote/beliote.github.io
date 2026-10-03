import { COUNTRY_CODES, MAP_COLS, MAP_ROWS, WORLD_GRID } from "@/data/worldPixels";
import { VISITED_COUNTRIES } from "@/data/visitedCountries";

const visited = new Set<string>(VISITED_COUNTRIES);

function decodeGrid() {
  const binary = atob(WORLD_GRID);
  const grid = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    grid[index] = binary.charCodeAt(index);
  }
  return grid;
}

const GRID = decodeGrid();

type Shape = { x: number; y: number; w: number; h: number; fill: string };

function buildShapes(): Shape[] {
  const shapes: Shape[] = [];

  for (let y = 0; y < MAP_ROWS; y += 1) {
    let x = 0;
    while (x < MAP_COLS) {
      const codeIndex = GRID[y * MAP_COLS + x] ?? 0;
      const code = COUNTRY_CODES[codeIndex] ?? "";
      if (!code) {
        x += 1;
        continue;
      }

      const isVisited = visited.has(code);
      if (isVisited) {
        const spark = (x * 5 + y * 3) % 6 === 0;
        shapes.push({ x, y, w: 1.08, h: 1.08, fill: spark ? "#b7ffe4" : "#34d399" });
        x += 1;
        continue;
      }

      let width = 1;
      while (x + width < MAP_COLS) {
        const next = GRID[y * MAP_COLS + x + width] ?? 0;
        const nextCode = COUNTRY_CODES[next] ?? "";
        if (!nextCode || visited.has(nextCode)) break;
        width += 1;
      }
      shapes.push({
        x,
        y,
        w: width + 0.08,
        h: 1.08,
        fill: (x + y) % 4 === 0 ? "#1b5644" : "#12362e",
      });
      x += width;
    }
  }

  return shapes;
}

const SHAPES = buildShapes();
const PIN_X = ((-73.57 + 180) / 360) * MAP_COLS;
const PIN_Y = ((90 - 45.5) / 180) * MAP_ROWS;
const MARK = MAP_COLS / 32;

export function PixelWorldMap({
  place,
  note,
  legend,
}: {
  place: string;
  note: string;
  legend: string;
}) {
  const left = (PIN_X / MAP_COLS) * 100;
  const top = (PIN_Y / MAP_ROWS) * 100;

  return (
    <figure className="pixel-card map-stage p-3">
      <div className="map-glitch relative">
        <svg
          viewBox={`0 0 ${MAP_COLS} ${MAP_ROWS}`}
          className="block h-auto w-full"
          role="img"
          aria-label={`${place}. ${note}`}
          shapeRendering="crispEdges"
        >
          <rect width={MAP_COLS} height={MAP_ROWS} fill="#070b12" />
          {SHAPES.map((shape) => (
            <rect key={`${shape.x}-${shape.y}-${shape.w}`} x={shape.x} y={shape.y} width={shape.w} height={shape.h} fill={shape.fill} />
          ))}
          <rect
            x={PIN_X - MARK}
            y={PIN_Y - MARK}
            width={MARK * 2}
            height={MARK * 2}
            fill="#090d14"
            stroke="#ff3b30"
            strokeWidth={MARK / 3.2}
          />
          <rect className="map-pin" x={PIN_X - MARK / 2.2} y={PIN_Y - MARK / 2.2} width={MARK / 1.1} height={MARK / 1.1} fill="#ff3b30" />
        </svg>
        <span
          className="pointer-events-none absolute -translate-y-1/2 rounded-md bg-[#090d14]/95 px-1.5 py-0.5 font-pixel text-sm text-[#ff3b30]"
          style={{ left: `min(${left + 3.6}%, 72%)`, top: `${top}%` }}
        >
          {place}
        </span>
        <span className="map-scan" aria-hidden="true" />
      </div>
      <figcaption className="mt-3 px-1">
        <p className="flex items-center gap-2 font-pixel text-xs text-emerald-300">
          <span className="inline-block h-2 w-2 bg-emerald-400" aria-hidden="true" />
          {legend}
        </p>
        <p className="mt-1 text-sm leading-relaxed">{note}</p>
      </figcaption>
    </figure>
  );
}
