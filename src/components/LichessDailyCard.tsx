"use client";

import { Chess, type Move } from "chess.js";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { Chessboard } from "react-chessboard";
import { profile } from "@/data/resumeData";
import { useLanguage } from "@/context/LanguageContext";

interface DailyPuzzle {
  puzzle: {
    id: string;
    rating: number;
    solution: string[];
    themes: string[];
    fen: string;
  };
}

type Phase = "loading" | "play" | "wrong" | "solved" | "preview" | "error";

function promotionOf(uci: string): "n" | "b" | "r" | "q" | undefined {
  const piece = uci[4];
  if (piece === "n" || piece === "b" || piece === "r" || piece === "q") {
    return piece;
  }
  return undefined;
}

function playUci(game: Chess, uci: string): Move | null {
  const from = uci.slice(0, 2);
  const to = uci.slice(2, 4);
  const promotion = promotionOf(uci);

  try {
    return game.move({
      from,
      to,
      ...(promotion ? { promotion } : {}),
    });
  } catch {
    return null;
  }
}

function playerOrientation(fen: string): "white" | "black" {
  return fen.split(" ")[1] === "b" ? "black" : "white";
}

export function LichessDailyCard() {
  const { t } = useLanguage();
  const gameRef = useRef(new Chess());
  const stepRef = useRef(0);
  const solutionRef = useRef<string[]>([]);
  const timersRef = useRef<number[]>([]);
  const lockedRef = useRef(false);
  const selectedRef = useRef<string | null>(null);

  const [puzzle, setPuzzle] = useState<DailyPuzzle | null>(null);
  const [fen, setFen] = useState<string | null>(null);
  const [orientation, setOrientation] = useState<"white" | "black">("white");
  const [phase, setPhase] = useState<Phase>("loading");
  const [selected, setSelected] = useState<string | null>(null);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  }, []);

  const syncFen = useCallback(() => {
    setFen(gameRef.current.fen());
  }, []);

  const playOpponentMoves = useCallback(() => {
    const solution = solutionRef.current;

    while (stepRef.current < solution.length && stepRef.current % 2 === 1) {
      const uci = solution[stepRef.current];
      if (!uci || !playUci(gameRef.current, uci)) {
        setPhase("error");
        return;
      }
      stepRef.current += 1;
    }

    syncFen();
    if (stepRef.current >= solution.length) {
      setPhase("solved");
      lockedRef.current = true;
      return;
    }

    setPhase("play");
    lockedRef.current = false;
  }, [syncFen]);

  const armPuzzle = useCallback(
    (next: DailyPuzzle) => {
      clearTimers();
      const game = new Chess(next.puzzle.fen);
      gameRef.current = game;
      solutionRef.current = next.puzzle.solution;
      stepRef.current = 0;
      selectedRef.current = null;
      setSelected(null);
      setPuzzle(next);
      setOrientation(playerOrientation(next.puzzle.fen));
      setFen(game.fen());
      lockedRef.current = false;
      setPhase("play");
    },
    [clearTimers],
  );

  useEffect(() => {
    let cancelled = false;

    fetch("https://lichess.org/api/puzzle/daily", {
      headers: { Accept: "application/json" },
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("unavailable");
        }
        return (await response.json()) as DailyPuzzle;
      })
      .then((data) => {
        if (cancelled) {
          return;
        }
        armPuzzle(data);
      })
      .catch(() => {
        if (!cancelled) {
          setPhase("error");
        }
      });

    return () => {
      cancelled = true;
      clearTimers();
    };
  }, [armPuzzle, clearTimers]);

  const attempt = useCallback(
    (sourceSquare: string, targetSquare: string): boolean => {
      if (lockedRef.current || phase === "preview" || phase === "solved") {
        return false;
      }

      const expected = solutionRef.current[stepRef.current];
      if (!expected || stepRef.current % 2 === 1) {
        return false;
      }

      if (`${sourceSquare}${targetSquare}` !== expected.slice(0, 4)) {
        setPhase("wrong");
        return false;
      }

      const promotion = promotionOf(expected);
      try {
        gameRef.current.move({
          from: sourceSquare,
          to: targetSquare,
          ...(promotion ? { promotion } : {}),
        });
      } catch {
        setPhase("wrong");
        return false;
      }

      stepRef.current += 1;
      selectedRef.current = null;
      setSelected(null);
      syncFen();

      if (stepRef.current >= solutionRef.current.length) {
        setPhase("solved");
        lockedRef.current = true;
        return true;
      }

      lockedRef.current = true;
      const timer = window.setTimeout(() => {
        playOpponentMoves();
      }, 320);
      timersRef.current.push(timer);
      return true;
    },
    [phase, playOpponentMoves, syncFen],
  );

  function previewLine() {
    if (!puzzle) {
      return;
    }

    clearTimers();
    const game = new Chess(puzzle.puzzle.fen);
    gameRef.current = game;
    stepRef.current = 0;
    selectedRef.current = null;
    setSelected(null);
    setFen(game.fen());
    lockedRef.current = true;
    setPhase("preview");

    let index = 0;
    const playNext = () => {
      const uci = puzzle.puzzle.solution[index];
      if (!uci) {
        setPhase("solved");
        return;
      }
      if (!playUci(game, uci)) {
        setPhase("error");
        return;
      }
      index += 1;
      stepRef.current = index;
      syncFen();
      if (index >= puzzle.puzzle.solution.length) {
        setPhase("solved");
        return;
      }
      const timer = window.setTimeout(playNext, 650);
      timersRef.current.push(timer);
    };

    const timer = window.setTimeout(playNext, 250);
    timersRef.current.push(timer);
  }

  const squareStyles: Record<string, CSSProperties> = {};
  if (selected) {
    squareStyles[selected] = { boxShadow: "inset 0 0 0 1px #161616" };
  }

  const turn = fen?.split(" ")[1];
  const status =
    phase === "wrong"
      ? t.puzzle.wrong
      : phase === "solved"
        ? t.puzzle.solved
        : phase === "preview"
          ? t.puzzle.previewing
          : turn === "b"
            ? t.puzzle.black
            : t.puzzle.white;

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
      <div className="w-full max-w-[420px] overflow-hidden rounded-xl">
        {fen ? (
          <Chessboard
            options={{
              id: "lichess-daily",
              position: fen,
              boardOrientation: orientation,
              allowDragging: phase === "play" || phase === "wrong",
              showAnimations: true,
              animationDurationInMs: 160,
              boardStyle: { borderRadius: "12px" },
              lightSquareStyle: { backgroundColor: "#f3f2ee" },
              darkSquareStyle: { backgroundColor: "#8d8a82" },
              lightSquareNotationStyle: { color: "#161616" },
              darkSquareNotationStyle: { color: "#f7f7f5" },
              squareStyles,
              canDragPiece: ({ piece }) =>
                !lockedRef.current && piece.pieceType.startsWith(gameRef.current.turn()),
              onPieceClick: ({ square, piece }) => {
                if (!square || lockedRef.current) {
                  return;
                }
                const own = piece.pieceType.startsWith(gameRef.current.turn());
                if (selectedRef.current && selectedRef.current !== square) {
                  const from = selectedRef.current;
                  const moved = attempt(from, square);
                  if (!moved && own) {
                    selectedRef.current = square;
                    setSelected(square);
                  }
                  return;
                }
                if (own) {
                  selectedRef.current = square;
                  setSelected(square);
                }
              },
              onSquareClick: ({ square }) => {
                if (!selectedRef.current || selectedRef.current === square) {
                  return;
                }
                attempt(selectedRef.current, square);
              },
              onPieceDrop: ({ sourceSquare, targetSquare }) => {
                if (!targetSquare) {
                  return false;
                }
                return attempt(sourceSquare, targetSquare);
              },
            }}
          />
        ) : (
          <p className="font-mono text-xs text-mute">{phase === "error" ? t.puzzle.error : t.puzzle.loading}</p>
        )}
      </div>

      <div>
        <p className="mt-3">
          <a className="underline decoration-rule underline-offset-4 hover:decoration-ink" href={profile.fide}>
            {t.puzzle.fide}
          </a>
        </p>
        {puzzle ? (
          <>
            <p className="font-mono text-xs text-mute">{t.puzzle.kicker}</p>
            <p className="mt-4 font-mono text-xs leading-relaxed text-mute">
              {t.puzzle.rating} {puzzle.puzzle.rating}
            </p>
            <p className="mt-4 font-mono text-sm" aria-live="polite">
              {status}
            </p>
            <div className="no-print mt-4 flex flex-wrap gap-3 text-sm">
              <button type="button" className="rounded-lg border border-emerald-400/50 px-2 py-1 font-pixel text-sm text-emerald-300" onClick={previewLine}>
                {t.puzzle.showLine}
              </button>
              <button
                type="button"
                className="rounded-lg border border-rule px-2 py-1 font-pixel text-sm"
                onClick={() => armPuzzle(puzzle)}
              >
                {t.puzzle.retry}
              </button>
              <a
                className="self-center font-mono text-xs underline decoration-rule underline-offset-4"
                href={`https://lichess.org/training/${puzzle.puzzle.id}`}
              >
                {t.puzzle.open}
              </a>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
