

import { useMemo, useState } from "react";
import { eras } from "./eraData.js";
import { questionBank } from "./questionBank.js";

const SESSION_SIZE = 15;
const MIN_PER_ERA = 3;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Build one quiz session: guarantee MIN_PER_ERA per era, then fill the rest
// randomly from whatever's left, and shuffle each question's answer options.
function buildSession() {
  const byEra = Object.fromEntries(eras.map((e) => [e.id, shuffle(questionBank.filter((q) => q.eraId === e.id))]));

  const guaranteed = eras.flatMap((e) => byEra[e.id].slice(0, MIN_PER_ERA));
  const remainingPool = shuffle(eras.flatMap((e) => byEra[e.id].slice(MIN_PER_ERA)));
  const fillCount = Math.max(0, SESSION_SIZE - guaranteed.length);
  const session = shuffle([...guaranteed, ...remainingPool.slice(0, fillCount)]);

  return session.map((q) => ({ ...q, options: shuffle(q.options) }));
}

export default function TriviaQuiz() {
  const [session, setSession] = useState(() => buildSession());
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState(null);
  const [answers, setAnswers] = useState([]); // { q, pickedId, correct }
  const done = index >= session.length;

  const eraName = (id) => eras.find((e) => e.id === id)?.name ?? id;

  const scoreByEra = useMemo(() => {
    const tally = Object.fromEntries(eras.map((e) => [e.id, { correct: 0, total: 0 }]));
    answers.forEach((a) => {
      tally[a.q.eraId].total += 1;
      if (a.correct) tally[a.q.eraId].correct += 1;
    });
    return tally;
  }, [answers]);

  function choose(optionId) {
    if (picked) return; // lock in after first pick
    setPicked(optionId);
  }

  function next() {
    const q = session[index];
    setAnswers((prev) => [...prev, { q, pickedId: picked, correct: picked === q.correct }]);
    setPicked(null);
    setIndex((i) => i + 1);
  }

  function restart() {
    setSession(buildSession());
    setIndex(0);
    setPicked(null);
    setAnswers([]);
  }

  const totalCorrect = answers.filter((a) => a.correct).length + (picked === session[index]?.correct ? 0 : 0);

  return (
    <div className="silicon-exhibit not-prose">
      {!done && session[index] && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="se-mono text-xs text-[var(--se-muted)]">
              Question {index + 1} of {session.length}
            </span>
            <span
              className="se-pill px-2 py-1 border border-[var(--se-border)] text-[var(--se-primary)]"
            >
              {eraName(session[index].eraId)}
            </span>
          </div>

          <h4 className="text-lg font-bold mb-4">{session[index].text}</h4>

          <div className="grid gap-2 sm:grid-cols-2 mb-4">
            {session[index].options.map((opt) => {
              const isPicked = picked === opt.id;
              const isCorrectOpt = opt.id === session[index].correct;
              const showState = picked !== null;
              let borderColor = "var(--se-border)";
              if (showState && isCorrectOpt) borderColor = "var(--se-success)";
              else if (showState && isPicked && !isCorrectOpt) borderColor = "var(--se-danger)";
              else if (isPicked) borderColor = "var(--se-primary)";

              return (
                <button
                  key={opt.id}
                  onClick={() => choose(opt.id)}
                  disabled={picked !== null}
                  className="se-card se-focusable text-left p-3 rounded-[var(--se-radius-md)] text-sm disabled:cursor-default"
                  style={{ borderColor }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          {picked && picked !== session[index].correct && (
            <p className="text-sm text-[var(--se-muted)] mb-4 border-l-2 pl-3" style={{ borderColor: "var(--se-danger)" }}>
              {session[index].explain}
            </p>
          )}
          {picked && picked === session[index].correct && (
            <p className="text-sm mb-4 border-l-2 pl-3" style={{ borderColor: "var(--se-success)", color: "var(--se-success)" }}>
              Correct!
            </p>
          )}

          <button
            onClick={next}
            disabled={!picked}
            className="se-focusable rounded-[var(--se-radius-md)] border border-[var(--se-primary)] text-[var(--se-primary)] px-4 py-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {index === session.length - 1 ? "See results →" : "Next →"}
          </button>
        </div>
      )}

      {done && (
        <div>
          <h4 className="text-lg font-bold mb-1">
            You scored {answers.filter((a) => a.correct).length} / {session.length}
          </h4>
          <p className="text-sm text-[var(--se-muted)] mb-4">Here's your breakdown by era:</p>

          <div className="grid gap-2 mb-5">
            {eras.map((era) => {
              const s = scoreByEra[era.id];
              if (!s.total) return null;
              const pct = Math.round((s.correct / s.total) * 100);
              return (
                <div key={era.id} className="se-card rounded-[var(--se-radius-md)] p-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{era.name}</span>
                    <span className="se-mono text-[var(--se-primary)]">
                      {s.correct}/{s.total}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[var(--se-bg)] border border-[var(--se-border)] overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, background: era.accent }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={restart}
            className="se-focusable rounded-[var(--se-radius-md)] border border-[var(--se-primary)] text-[var(--se-primary)] px-4 py-2 text-sm"
          >
            ↺ Retake quiz
          </button>
        </div>
      )}
    </div>
  );
}