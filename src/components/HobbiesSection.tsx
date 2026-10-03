"use client";

import { PixelWorldMap } from "@/components/PixelWorldMap";
import { LichessDailyCard } from "@/components/LichessDailyCard";
import { SectionHeading } from "@/components/Timeline";
import { useLanguage } from "@/context/LanguageContext";

const MARKS = ["0010000100011100010001110", "0010000100111000010000100", "0111010001100011000101110", "1110011100111001110011100"];

function PixelMark({ seed }: { seed: number }) {
  const bits = MARKS[seed % MARKS.length];
  return (
    <svg viewBox="0 0 5 5" className="h-5 w-5 shrink-0" aria-hidden="true" shapeRendering="crispEdges">
      {bits.split("").map((bit, index) =>
        bit === "1" ? (
          <rect key={index} x={index % 5} y={Math.floor(index / 5)} width="1" height="1" fill="#34d399" />
        ) : null,
      )}
    </svg>
  );
}

export function HobbiesSection() {
  const { t } = useLanguage();
  const sports = t.hobbies.sports.split(", ").filter(Boolean);
  const montreal = t.hobbies.travel.find((stop) => /montr[eé]al/i.test(stop.place));

  return (
    <section className="border-t border-rule py-10" aria-labelledby="tactique">
      <SectionHeading id="tactique" index={t.hobbies.index} title={t.hobbies.title} />
      <div className="mt-6">
        <LichessDailyCard />
      </div>

      <div className="mt-10 grid items-start gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.15fr)]">
        <div className="grid gap-4">
          <div>
            <h3 className="font-pixel text-sm text-emerald-300">{t.hobbies.sportsTitle}</h3>
            <ul className="mt-3 grid grid-cols-2 gap-3">
              {sports.map((sport, index) => (
                <li key={sport} className="pixel-card flex items-center gap-2 px-3 py-3 text-sm">
                  <PixelMark seed={index} />
                  {sport}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-pixel text-sm text-emerald-300">{t.hobbies.rolesTitle}</h3>
            <ul className="mt-3 grid gap-3">
              {t.hobbies.roles.map((role) => (
                <li key={role} className="pixel-card relative px-4 py-3 text-sm leading-relaxed">
                  <span className="absolute top-1/2 -left-1.5 h-3 w-3 -translate-y-1/2 rounded-full bg-paper" aria-hidden="true" />
                  <span className="absolute top-1/2 -right-1.5 h-3 w-3 -translate-y-1/2 rounded-full bg-paper" aria-hidden="true" />
                  {role}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <h3 className="font-pixel text-sm text-emerald-300">{t.hobbies.travelTitle}</h3>
          <div className="mt-3">
            {montreal ? (
              <PixelWorldMap
                place={montreal.place}
                note={montreal.note}
                legend={t.hobbies.visited}
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
