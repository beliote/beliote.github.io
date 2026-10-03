import { mkdirSync, writeFileSync, readFileSync } from "node:fs";

const cache = new URL("../tmp-geo/", import.meta.url);
mkdirSync(cache, { recursive: true });

async function cached(name, url) {
  const file = new URL(name, cache);
  try {
    return readFileSync(file, "utf8");
  } catch {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`${url} ${response.status}`);
    const text = await response.text();
    writeFileSync(file, text);
    return text;
  }
}

const topology = JSON.parse(
  await cached("countries-50m.json", "https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-50m.json"),
);
const isoCsv = await cached(
  "iso.csv",
  "https://raw.githubusercontent.com/lukes/ISO-3166-Countries-with-Regional-Codes/master/all/all.csv",
);

function parseCsvLine(line) {
  const cells = [];
  let current = "";
  let quoted = false;
  for (const char of line) {
    if (char === '"') {
      quoted = !quoted;
      continue;
    }
    if (char === "," && !quoted) {
      cells.push(current);
      current = "";
      continue;
    }
    current += char;
  }
  cells.push(current);
  return cells;
}

const numericToAlpha = new Map();
for (const line of isoCsv.split(/\r?\n/).slice(1)) {
  if (!line) continue;
  const [, alpha2, , numeric] = parseCsvLine(line);
  if (!alpha2 || !numeric) continue;
  numericToAlpha.set(String(Number(numeric)), alpha2.toLowerCase());
}

const { scale, translate } = topology.transform;
const arcs = topology.arcs.map((arc) => {
  let x = 0;
  let y = 0;
  return arc.map(([dx, dy]) => {
    x += dx;
    y += dy;
    return [x * scale[0] + translate[0], y * scale[1] + translate[1]];
  });
});

function ringFrom(indexes) {
  const ring = [];
  for (const index of indexes) {
    const arc = index < 0 ? arcs[~index].slice().reverse() : arcs[index];
    ring.push(...arc);
  }
  return ring;
}

function ringsOf(geometry) {
  if (geometry.type === "Polygon") {
    return [geometry.arcs.map(ringFrom)];
  }
  return geometry.arcs.map((polygon) => polygon.map(ringFrom));
}

function bboxOf(rings) {
  let minLon = Infinity;
  let maxLon = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;
  for (const ring of rings) {
    for (const [lon, lat] of ring) {
      minLon = Math.min(minLon, lon);
      maxLon = Math.max(maxLon, lon);
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
    }
  }
  return { minLon, maxLon, minLat, maxLat };
}

function areaOf(ring) {
  let sum = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    sum += ring[j][0] * ring[i][1] - ring[i][0] * ring[j][1];
  }
  return Math.abs(sum / 2);
}

function hits(ring, lon, lat) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (Math.abs(xi - xj) > 180) continue;
    const crosses = yi > lat !== yj > lat;
    if (crosses && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function contains(rings, lon, lat) {
  let count = 0;
  for (const ring of rings) {
    if (hits(ring, lon, lat)) count += 1;
  }
  return count % 2 === 1;
}

const countries = [];
for (const geometry of topology.objects.countries.geometries) {
  const code = numericToAlpha.get(String(Number(geometry.id)));
  if (!code) continue;
  const polygons = ringsOf(geometry).map((rings) => ({
    rings,
    bbox: bboxOf(rings),
    area: rings.reduce((sum, ring) => sum + areaOf(ring), 0),
  }));
  countries.push({ code, polygons, area: polygons.reduce((sum, polygon) => sum + polygon.area, 0) });
}

countries.sort((a, b) => a.area - b.area);

const COLS = 240;
const ROWS = 120;
const grid = new Uint8Array(COLS * ROWS);
const codes = [""];
const indexOf = new Map();

function codeIndex(code) {
  let index = indexOf.get(code);
  if (index) return index;
  index = codes.length;
  codes.push(code);
  indexOf.set(code, index);
  return index;
}

function cellOf(lon, lat) {
  const x = Math.max(0, Math.min(COLS - 1, Math.floor(((lon + 180) / 360) * COLS)));
  const y = Math.max(0, Math.min(ROWS - 1, Math.floor(((90 - lat) / 180) * ROWS)));
  return y * COLS + x;
}

for (let y = 0; y < ROWS; y += 1) {
  for (let x = 0; x < COLS; x += 1) {
    const lon = ((x + 0.5) / COLS) * 360 - 180;
    const lat = 90 - ((y + 0.5) / ROWS) * 180;
    for (const country of countries) {
      let found = false;
      for (const polygon of country.polygons) {
        const box = polygon.bbox;
        if (lon < box.minLon || lon > box.maxLon || lat < box.minLat || lat > box.maxLat) continue;
        if (contains(polygon.rings, lon, lat)) {
          grid[y * COLS + x] = codeIndex(country.code);
          found = true;
          break;
        }
      }
      if (found) break;
    }
  }
}

const counts = new Map();
for (const value of grid) {
  if (!value) continue;
  const code = codes[value];
  counts.set(code, (counts.get(code) ?? 0) + 1);
}

for (const country of countries) {
  if ((counts.get(country.code) ?? 0) > 0) continue;
  const polygon = country.polygons[0];
  if (!polygon) continue;
  const ring = polygon.rings[0];
  const lon = ring.reduce((sum, point) => sum + point[0], 0) / ring.length;
  const lat = ring.reduce((sum, point) => sum + point[1], 0) / ring.length;
  const index = cellOf(lon, lat);
  grid[index] = codeIndex(country.code);
  counts.set(country.code, 1);
}

const visited = ["fr", "es", "pt", "it", "gb", "be", "nl", "ad", "de", "at", "dk", "hr", "is", "fo", "cz", "me", "gr", "tr", "se", "fi", "ee", "ru", "ma", "ca", "us", "jp"];
for (const code of visited) {
  console.log(code, counts.get(code) ?? 0);
}

let preview = "";
for (let y = 10; y < 42; y += 1) {
  let line = "";
  for (let x = 100; x < 155; x += 1) {
    const code = codes[grid[y * COLS + x]] ?? "";
    line += visited.includes(code) ? "#" : code ? "." : " ";
  }
  preview += `${line}\n`;
}
console.log(preview);

const bytes = Buffer.from(grid).toString("base64");
const file = `/* Generated by scripts/rasterize-world.mjs from Natural Earth 50m. Do not edit by hand. */
export const MAP_COLS = ${COLS};
export const MAP_ROWS = ${ROWS};
export const COUNTRY_CODES = ${JSON.stringify(codes)} as const;
export const WORLD_GRID = "${bytes}";
`;

writeFileSync(new URL("../src/data/worldPixels.ts", import.meta.url), file);
console.log("codes", codes.length, "bytes", grid.length);
