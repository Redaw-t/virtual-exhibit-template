import { useState, useRef, useCallback } from 'react';
import './TimelineExplorer.css';

/* ============================================================
   Era + chip data
   Source: Section 2.2 (era table) + representative flagship
   chips named in the proposal. Specs are illustrative,
   approximate figures for teaching purposes.
   ============================================================ */

const ERAS = [
  {
    id: 'birth',
    name: 'Birth of Mobile CPUs',
    period: 'Mid-1990s – Early 2000s',
    tagline: 'Power efficiency becomes the whole design brief.',
    chips: [
      {
        name: 'ARM7TDMI',
        transistors: '~74,000',
        cores: '1 core (RISC)',
        clock: '20 – 133 MHz',
        features: 'No cache, Thumb 16-bit instruction mode for code density, sub-1W power draw',
      },
      {
        name: 'Intel StrongARM SA-110',
        transistors: '~2.5 million',
        cores: '1 core (RISC)',
        clock: '100 – 233 MHz',
        features: '16KB instruction + 16KB data cache, early PDA and handheld staple',
      },
    ],
  },
  {
    id: 'arm-revolution',
    name: 'The ARM Revolution',
    period: '2007 – 2012',
    tagline: 'The smartphone forces the chip to become a system.',
    chips: [
      {
        name: 'ARM Cortex-A8',
        transistors: '~43 million (core)',
        cores: '1 core, superscalar',
        clock: '600 MHz – 1 GHz',
        features: 'NEON SIMD unit, licensed across the industry as the reference design',
      },
      {
        name: 'Apple A4',
        transistors: '~137 million',
        cores: '1 core (Cortex-A8 based)',
        clock: '~1 GHz',
        features: 'Paired CPU with dedicated GPU for the original iPad and iPhone 4',
      },
    ],
  },
  {
    id: 'multicore',
    name: 'The Multicore Era',
    period: '2011 – 2014',
    tagline: 'Going wide instead of fast to beat the power wall.',
    chips: [
      {
        name: 'NVIDIA Tegra 2',
        transistors: '~260 million',
        cores: '2 cores (Cortex-A9)',
        clock: '1 GHz',
        features: 'First dual-core design shipped at real volume in phones and tablets',
      },
      {
        name: 'Qualcomm Snapdragon 600',
        transistors: '~n/a (28nm HPm)',
        cores: '4 cores (Krait 300)',
        clock: 'up to 1.9 GHz',
        features: 'Asynchronous per-core clocking, tuned for sustained multitasking',
      },
    ],
  },
  {
    id: 'soc',
    name: 'The System-on-Chip Era',
    period: '2015 – 2020',
    tagline: 'CPU, GPU, modem, and memory fuse onto one die.',
    chips: [
      {
        name: 'Apple A9',
        transistors: '~2 billion',
        cores: '2 cores (Twister)',
        clock: '~1.85 GHz',
        features: '14/16nm process, tightly integrated GPU and memory controller',
      },
      {
        name: 'Qualcomm Snapdragon 820',
        transistors: '~n/a (14nm FinFET)',
        cores: '4 cores (Kryo, big.LITTLE)',
        clock: 'up to 2.15 GHz',
        features: 'Integrated modem on-die, heterogeneous big.LITTLE task scheduling',
      },
    ],
  },
  {
    id: 'ai-efficiency',
    name: 'The AI & Efficiency Era',
    period: '2021 – Present',
    tagline: 'A dedicated brain-within-a-brain for on-device AI.',
    chips: [
      {
        name: 'Apple A17 Pro',
        transistors: '~19 billion',
        cores: '6 cores + 16-core Neural Engine',
        clock: 'up to 3.78 GHz',
        features: 'TSMC 3nm process, on-device AI inference without a cloud round trip',
      },
      {
        name: 'Qualcomm Snapdragon 8 Gen 3',
        transistors: '~n/a (4nm)',
        cores: '8 cores + dedicated NPU',
        clock: 'up to 3.3 GHz',
        features: 'Hexagon NPU tuned for generative AI workloads run locally',
      },
    ],
  },
];

export default function TimelineExplorer() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selected, setSelected] = useState([]); // up to 2 era ids
  const liveRegionRef = useRef(null);

  const visibleEras = activeFilter === 'all'
    ? ERAS
    : ERAS.filter((e) => e.id === activeFilter);

  const toggleNode = useCallback((eraId) => {
    setSelected((prev) => {
      if (prev.includes(eraId)) {
        return prev.filter((id) => id !== eraId);
      }
      if (prev.length >= 2) {
        return [prev[1], eraId];
      }
      return [...prev, eraId];
    });
  }, []);

  const selectedEras = ERAS.filter((e) => selected.includes(e.id));

  const summaryText = selectedEras.length === 0
    ? 'No era selected.'
    : selectedEras.length === 1
      ? `Showing specifications for ${selectedEras[0].name}, ${selectedEras[0].period}.`
      : `Comparing ${selectedEras[0].name} and ${selectedEras[1].name}.`;

  return (
    <div className="timeline-explorer">
      <div className="timeline-explorer__header">
        <h3 className="timeline-explorer__title">Microprocessor Timeline Explorer</h3>
        <p className="timeline-explorer__hint">
          Select an era to view its specifications. Select a second era to compare them side by side.
        </p>
      </div>

      {/* Era filter buttons */}
      <div className="timeline-explorer__filters" role="group" aria-label="Filter timeline by era">
        <button
          type="button"
          className={`timeline-explorer__filter-pill${activeFilter === 'all' ? ' is-active' : ''}`}
          onClick={() => setActiveFilter('all')}
          aria-pressed={activeFilter === 'all'}
        >
          All Eras
        </button>
        {ERAS.map((era) => (
          <button
            key={era.id}
            type="button"
            className={`timeline-explorer__filter-pill${activeFilter === era.id ? ' is-active' : ''}`}
            onClick={() => setActiveFilter(era.id)}
            aria-pressed={activeFilter === era.id}
          >
            {era.name}
          </button>
        ))}
      </div>

      {/* Timeline track */}
      <div className="timeline-explorer__track" role="list">
        {visibleEras.map((era) => {
          const isSelected = selected.includes(era.id);
          const isDimmed = selected.length > 0 && !isSelected;
          return (
            <button
              key={era.id}
              type="button"
              role="listitem"
              className={`timeline-explorer__node${isSelected ? ' is-selected' : ''}${isDimmed ? ' is-dimmed' : ''}`}
              onClick={() => toggleNode(era.id)}
              aria-pressed={isSelected}
              aria-label={`${era.name}, ${era.period}. ${isSelected ? 'Selected' : 'Not selected'}.`}
            >
              <span className="timeline-explorer__node-dot" />
              <span className="timeline-explorer__node-period">{era.period}</span>
              <span className="timeline-explorer__node-name">{era.name}</span>
            </button>
          );
        })}
      </div>

      {/* Live region for screen readers */}
      <p className="timeline-explorer__sr-only" role="region" aria-live="polite" ref={liveRegionRef}>
        {summaryText}
      </p>

      {/* Spec cards: single or comparative */}
      {selectedEras.length > 0 && (
        <div
          className={`timeline-explorer__spec-panel${selectedEras.length === 2 ? ' is-comparative' : ''}`}
        >
          {selectedEras.map((era) => (
            <div key={era.id} className="timeline-explorer__spec-card">
              <div className="timeline-explorer__spec-card-header">
                <span className="timeline-explorer__spec-card-period">{era.period}</span>
                <h4 className="timeline-explorer__spec-card-title">{era.name}</h4>
                <p className="timeline-explorer__spec-card-tagline">{era.tagline}</p>
              </div>
              <div className="timeline-explorer__spec-chips">
                {era.chips.map((chip) => (
                  <div key={chip.name} className="timeline-explorer__chip-spec">
                    <h5 className="timeline-explorer__chip-name">{chip.name}</h5>
                    <dl className="timeline-explorer__chip-dl">
                      <div>
                        <dt>Transistors</dt>
                        <dd>{chip.transistors}</dd>
                      </div>
                      <div>
                        <dt>Cores</dt>
                        <dd>{chip.cores}</dd>
                      </div>
                      <div>
                        <dt>Clock</dt>
                        <dd>{chip.clock}</dd>
                      </div>
                    </dl>
                    <p className="timeline-explorer__chip-features">{chip.features}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}