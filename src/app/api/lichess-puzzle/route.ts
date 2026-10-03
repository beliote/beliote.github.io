export const revalidate = 3600;

interface DailyPuzzle {
  game: {
    id: string;
    pgn: string;
  };
  puzzle: {
    id: string;
    rating: number;
    plays: number;
    solution: string[];
    themes: string[];
    fen: string;
    initialPly: number;
  };
}

function isDailyPuzzle(value: unknown): value is DailyPuzzle {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const record = value as { puzzle?: unknown };
  if (typeof record.puzzle !== "object" || record.puzzle === null) {
    return false;
  }

  const puzzle = record.puzzle as {
    id?: unknown;
    rating?: unknown;
    solution?: unknown;
    themes?: unknown;
    fen?: unknown;
  };

  return (
    typeof puzzle.id === "string" &&
    typeof puzzle.rating === "number" &&
    typeof puzzle.fen === "string" &&
    Array.isArray(puzzle.solution) &&
    puzzle.solution.every((move) => typeof move === "string") &&
    Array.isArray(puzzle.themes) &&
    puzzle.themes.every((theme) => typeof theme === "string")
  );
}

export async function GET(): Promise<Response> {
  try {
    const response = await fetch("https://lichess.org/api/puzzle/daily", {
      headers: {
        Accept: "application/json",
        "User-Agent": "eliot-burgalat-portfolio (eliot.burgalat@imt-atlantique.net)",
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return Response.json({ error: "unavailable" }, { status: 502 });
    }

    const payload: unknown = await response.json();
    if (!isDailyPuzzle(payload)) {
      return Response.json({ error: "invalid" }, { status: 502 });
    }

    return Response.json(payload, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch {
    return Response.json({ error: "unavailable" }, { status: 502 });
  }
}
