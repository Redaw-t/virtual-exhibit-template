
import { useState, useMemo } from "react";
import { eras } from "./eraData.js";

const allChips = eras.flatMap((era) =>
  era.chips.map((chip) => ({ ...chip, eraId: era.id, eraName: era.name, eraAccent: era.accent }))
);

function SpecCard({ chip, onClose }) {
  return (
    <div className="se-card se-focusable relative w-full rounded-[var(--se-radius-md)] p-4 sm:p-5 animate-[se-enter_500ms_var(--se-ease)]">
      <button
        onClick={onClose}
        aria-label={`Close ${chip.name} spec card`}
        className="se-focusable absolute right-3 top-3 text-[var(--se-muted)] hover:text-[var(--se-primary)]"
      >
        ✕
      </button>
      <div className="flex items-center gap-2 mb-1">
        <span
          className="inline-block h-2.5 w-2.5 rounded-full"
          style={{ background: chip.eraAccent }}
        />
        <span className="se-mono text-xs text-[var(--se-muted)]">{chip.eraName}</span>
      </div>
      <h4 className="text-lg font-bold text-[var(--se-text)] mb-1">{chip.name}</h4>
      <p className="text-sm text-[var(--se-muted)] mb-3">{chip.notable}</p>
      <dl className="se-mono grid grid-cols-2 gap-y-2 gap-x-3 text-xs">
        <dt className="text-[var(--se-muted)]">Year</dt>
        <dd className="text-right text-[var(--se-primary)]">{chip.year}</dd>
        <dt className="text-[var(--se-muted)]">Cores</dt>
        <dd className="text-right text-[var(--se-primary)]">{chip.cores}</dd>
        <dt className="text-[var(--se-muted)]">Clock</dt>
        <dd className="text-right text-[var(--se-primary)]">{chip.clockGHz} GHz</dd>
        <dt className="text-[var(--se-muted)]">Process</dt>
        <dd className="text-right text-[var(--se-primary)]">{chip.process}</dd>
        <dt className="text-[var(--se-muted)] col-span-2 border-t border-[var(--se-border)] pt-2 mt-1">
          Transistors
        </dt>
        <dd className="text-right text-[var(--se-primary)] col-span-2">{chip.transistors}</dd>
      </dl>
    </div>
  );
}

export default function TimelineExplorer() {
  const [activeEra, setActiveEra] = useState("all");
  const [selected, setSelected] = useState([]); // up to 2 chip ids for comparison

  const visibleChips = useMemo(
    () => (activeEra === "all" ? allChips : allChips.filter((c) => c.eraId === activeEra)),
    [activeEra]
  );

  function toggleChip(chipId) {
    setSelected((prev) => {
      if (prev.includes(chipId)) return prev.filter((id) => id !== chipId);
      if (prev.length >= 2) return [prev[1], chipId]; // slide the window
      return [...prev, chipId];
    });
  }

  const selectedChips = selected.map((id) => allChips.find((c) => c.id === id)).filter(Boolean);

  return (
    <div className="silicon-exhibit not-prose">
      <style>{`@keyframes se-enter { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }`}</style>

      {/* Era filter pills */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4 -mx-1 px-1">
        <button
          onClick={() => setActiveEra("all")}
          className={`se-pill se-focusable shrink-0 px-3 py-1.5 border transition-colors duration-150 ${
            activeEra === "all"
              ? "border-[var(--se-primary)] text-[var(--se-primary)]"
              : "border-[var(--se-border)] text-[var(--se-muted)] hover:text-[var(--se-text)]"
          }`}
        >
          All eras
        </button>
        {eras.map((era) => (
          <button
            key={era.id}
            onClick={() => setActiveEra(era.id)}
            className={`se-pill se-focusable shrink-0 px-3 py-1.5 border transition-colors duration-150 ${
              activeEra === era.id
                ? "border-[var(--se-primary)] text-[var(--se-primary)]"
                : "border-[var(--se-border)] text-[var(--se-muted)] hover:text-[var(--se-text)]"
            }`}
          >
            {era.name}
          </button>
        ))}
      </div>

      {/* Timeline track: horizontal scroll on desktop, stacked on mobile */}
      <div className="flex gap-4 overflow-x-auto pb-4 md:pb-6 snap-x snap-mandatory sm:flex-row flex-col sm:overflow-x-auto overflow-visible">
        {visibleChips.map((chip) => {
          const isSelected = selected.includes(chip.id);
          return (
            <button
              key={chip.id}
              onClick={() => toggleChip(chip.id)}
              className={`se-card se-focusable se-card--interactive snap-start shrink-0 w-full sm:w-52 text-left p-4 rounded-[var(--se-radius-md)] ${
                isSelected ? "border-[var(--se-primary)]" : ""
              }`}
              style={{ borderColor: isSelected ? "var(--se-primary)" : undefined }}
              aria-pressed={isSelected}
            >
              <span
                className="inline-block h-2 w-2 rounded-full mb-2"
                style={{ background: chip.eraAccent }}
              />
              <div className="se-mono text-xs text-[var(--se-muted)] mb-1">{chip.year}</div>
              <div className="font-bold text-[var(--se-text)] leading-tight">{chip.name}</div>
              <div className="text-xs text-[var(--se-muted)] mt-1">{chip.eraName}</div>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-[var(--se-muted)] mb-4">
        Tap up to two chips to compare their specs side by side.
      </p>

      {/* Spec card(s) */}
      {selectedChips.length > 0 && (
        <div
          className={`grid gap-4 ${selectedChips.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-1"}`}
        >
          {selectedChips.map((chip) => (
            <SpecCard key={chip.id} chip={chip} onClose={() => toggleChip(chip.id)} />
          ))}
        </div>
      )}
    </div>
  );
}
