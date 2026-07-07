
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { eras } from "./eraData.js";

const WORKLOAD_UNITS = 100; // arbitrary "amount of work" every era must complete
const BASE_MS = 3500; // wall-clock time the fastest possible run could take

// Pick the flagship (highest perfIndex) chip to represent an era in the race.
function flagship(era) {
  return era.chips.reduce((best, c) => (c.perfIndex > best.perfIndex ? c : best), era.chips[0]);
}

export default function EvolutionSimulator() {
  const [chosen, setChosen] = useState([eras[0].id, eras[4].id]); // sensible default: oldest vs newest
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState({}); // eraId -> 0..100
  const [finishedAt, setFinishedAt] = useState({}); // eraId -> ms elapsed
  const [expanded, setExpanded] = useState({ highlights: true, metrics: true });
  const startRef = useRef(null);
  const frameRef = useRef(null);

  const selectedEras = eras.filter((e) => chosen.includes(e.id));
  const maxPerf = Math.max(...eras.flatMap((e) => e.chips.map((c) => c.perfIndex)));

  function toggleEra(id) {
    if (running) return; // don't let selection change mid-run
    setChosen((prev) => {
      if (prev.includes(id)) return prev.filter((e) => e !== id);
      if (prev.length >= 4) return prev; // cap comparisons at 4 for legibility
      return [...prev, id];
    });
  }

  function startSimulation() {
    if (selectedEras.length < 2) return;
    setProgress(Object.fromEntries(selectedEras.map((e) => [e.id, 0])));
    setFinishedAt({});
    setRunning(true);
    startRef.current = performance.now();
    tick();
  }

  function tick() {
    frameRef.current = requestAnimationFrame((now) => {
      const elapsed = now - startRef.current;
      let allDone = true;
      const next = {};
      const doneStamps = {};

      selectedEras.forEach((era) => {
        const chip = flagship(era);
        // Faster chips (higher perfIndex) finish sooner: duration scales inversely.
        const duration = BASE_MS * (maxPerf / chip.perfIndex) ** 0.4;
        const pct = Math.min(100, (elapsed / duration) * 100);
        next[era.id] = pct;
        if (pct < 100) allDone = false;
        else if (finishedAt[era.id] === undefined) doneStamps[era.id] = duration;
      });

      setProgress((prev) => ({ ...prev, ...next }));
      if (Object.keys(doneStamps).length) {
        setFinishedAt((prev) => ({ ...prev, ...doneStamps }));
      }

      if (!allDone) {
        tick();
      } else {
        setRunning(false);
      }
    });
  }

  useEffect(() => () => frameRef.current && cancelAnimationFrame(frameRef.current), []);

  function resetSimulation() {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    setRunning(false);
    setProgress({});
    setFinishedAt({});
  }

  return (
    <div className="silicon-exhibit not-prose">
      {/* Era selection */}
      <div className="mb-4">
        <p className="se-mono text-xs text-[var(--se-muted)] mb-2">
          Select 2–4 eras to compare ({selectedEras.length} selected)
        </p>
        <div className="flex flex-wrap gap-2">
          {eras.map((era) => {
            const isOn = chosen.includes(era.id);
            return (
              <button
                key={era.id}
                onClick={() => toggleEra(era.id)}
                disabled={running}
                className={`se-pill se-focusable px-3 py-1.5 border transition-colors duration-150 disabled:opacity-40 ${
                  isOn
                    ? "border-[var(--se-primary)] text-[var(--se-primary)]"
                    : "border-[var(--se-border)] text-[var(--se-muted)] hover:text-[var(--se-text)]"
                }`}
              >
                {era.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <button
          onClick={startSimulation}
          disabled={running || selectedEras.length < 2}
          className="se-focusable rounded-[var(--se-radius-md)] border border-[var(--se-primary)] text-[var(--se-primary)] px-4 py-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--se-glow)] transition-colors"
        >
          {running ? "Running…" : "Run identical workload"}
        </button>
        <button
          onClick={resetSimulation}
          className="se-focusable rounded-[var(--se-radius-md)] border border-[var(--se-border)] text-[var(--se-muted)] px-4 py-2 text-sm hover:text-[var(--se-text)]"
        >
          ↺ Reset
        </button>
      </div>

      {/* Simulation panels: side by side on desktop, stacked on mobile */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 lg:auto-cols-fr lg:grid-flow-col">
        {selectedEras.map((era) => {
          const chip = flagship(era);
          const pct = progress[era.id] ?? 0;
          const done = pct >= 100;
          return (
            <div key={era.id} className="se-card rounded-[var(--se-radius-md)] p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: era.accent }} />
                <span className="font-bold text-sm">{era.name}</span>
              </div>
              <div className="se-mono text-xs text-[var(--se-muted)] mb-2">{chip.name}</div>

              <div className="h-3 rounded-full bg-[var(--se-bg)] border border-[var(--se-border)] overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: era.accent }}
                  animate={{ width: `${pct}%` }}
                  transition={{ ease: "linear", duration: 0.05 }}
                />
              </div>
              <div className="se-mono text-xs mt-2 flex justify-between">
                <span className="text-[var(--se-muted)]">
                  {done ? "Task complete" : `${Math.round(pct)}%`}
                </span>
                {done && finishedAt[era.id] && (
                  <span className="text-[var(--se-primary)]">
                    {(finishedAt[era.id] / 1000).toFixed(2)}s
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Era Highlights (collapsible on mobile) */}
      <div className="mt-6">
        <button
          className="se-focusable sm:pointer-events-none flex w-full items-center justify-between text-left sm:cursor-default"
          onClick={() => setExpanded((s) => ({ ...s, highlights: !s.highlights }))}
        >
          <h4 className="font-bold text-[var(--se-primary)]">Era Highlights</h4>
          <span className="se-mono text-xs text-[var(--se-muted)] sm:hidden">
            {expanded.highlights ? "▲" : "▼"}
          </span>
        </button>
        <AnimatePresence initial={false}>
          {(expanded.highlights || true) && (
            <motion.div
              className="grid gap-3 sm:grid-cols-2 mt-3 overflow-hidden sm:!h-auto sm:!opacity-100"
              initial={false}
              animate={{ height: expanded.highlights ? "auto" : 0, opacity: expanded.highlights ? 1 : 0 }}
            >
              {selectedEras.map((era) => {
                const chip = flagship(era);
                return (
                  <div key={era.id} className="se-card rounded-[var(--se-radius-md)] p-3 text-sm">
                    <div className="font-bold mb-1">{chip.name}</div>
                    <div className="se-mono text-xs text-[var(--se-muted)]">
                      {chip.cores} cores · {chip.clockGHz} GHz · {chip.process}
                    </div>
                    <p className="text-xs text-[var(--se-muted)] mt-1">{chip.notable}</p>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Performance Metrics + feedback (collapsible on mobile) */}
      <div className="mt-6">
        <button
          className="se-focusable sm:pointer-events-none flex w-full items-center justify-between text-left sm:cursor-default"
          onClick={() => setExpanded((s) => ({ ...s, metrics: !s.metrics }))}
        >
          <h4 className="font-bold text-[var(--se-primary)]">Performance Metrics</h4>
          <span className="se-mono text-xs text-[var(--se-muted)] sm:hidden">
            {expanded.metrics ? "▲" : "▼"}
          </span>
        </button>
        {expanded.metrics && (
          <div className="overflow-x-auto mt-3">
            <table className="se-mono w-full text-xs border-collapse">
              <thead>
                <tr className="text-[var(--se-muted)] text-left border-b border-[var(--se-border)]">
                  <th className="py-2 pr-3">Era</th>
                  <th className="py-2 pr-3">Time to complete</th>
                  <th className="py-2 pr-3">Relative speed</th>
                </tr>
              </thead>
              <tbody>
                {selectedEras.map((era) => {
                  const chip = flagship(era);
                  const time = finishedAt[era.id];
                  return (
                    <tr key={era.id} className="border-b border-[var(--se-border)]">
                      <td className="py-2 pr-3">{era.name}</td>
                      <td className="py-2 pr-3 text-[var(--se-primary)]">
                        {time ? `${(time / 1000).toFixed(2)}s` : "—"}
                      </td>
                      <td className="py-2 pr-3">{chip.perfIndex}×</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {Object.keys(finishedAt).length === selectedEras.length && selectedEras.length > 0 && (
              <p className="text-xs text-[var(--se-muted)] mt-3">
                On this workload, the newest selected era finished roughly{" "}
                <span className="text-[var(--se-primary)]">
                  {(
                    Math.max(...selectedEras.map((e) => flagship(e).perfIndex)) /
                    Math.min(...selectedEras.map((e) => flagship(e).perfIndex))
                  ).toFixed(1)}
                  ×
                </span>{" "}
                faster than the oldest — a stand-in for decades of architectural improvement, not a
                literal benchmark score.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}