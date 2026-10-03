export function SectionHeading({ index, title, id }: { index: string; title: string; id: string }) {
  return (
    <h2 id={id} className="scroll-mt-24 flex items-baseline gap-3 font-pixel text-base font-medium">
      <span className="font-mono text-xs text-mute">{index}</span>
      {title}
    </h2>
  );
}
