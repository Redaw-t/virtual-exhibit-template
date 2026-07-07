// src/components/TriviaQuiz.jsx
// Interactive Trivia Quiz — Mobile Microprocessor Evolution
//
// Usage in an .mdx page:
//   import TriviaQuiz from '../components/TriviaQuiz.jsx';
//   <TriviaQuiz client:load />
//
import { useMemo, useState } from "react";
import { QUESTIONS, ERAS } from "../../data/quizQuestions.js";

const QUESTIONS_PER_SESSION = 15;
const MIN_PER_ERA = 3;

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildSession() {
  const byEra = ERAS.map((era) => shuffle(QUESTIONS.filter((q) => q.era === era)));

  const guaranteed = byEra.flatMap((qs) => qs.slice(0, MIN_PER_ERA));
  const remainingPool = shuffle(byEra.flatMap((qs) => qs.slice(MIN_PER_ERA)));
  const fillCount = QUESTIONS_PER_SESSION - guaranteed.length;
  const session = shuffle([...guaranteed, ...remainingPool.slice(0, fillCount)]);

  return session.map((q) => {
    const order = shuffle(q.choices.map((text, idx) => ({ text, idx })));
    return {
      ...q,
      options: order.map((o) => o.text),
      correctOption: order.findIndex((o) => o.idx === q.correct),
    };
  });
}

export default function TriviaQuiz() {
  const [session, setSession] = useState(() => buildSession());
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]); // { era, correct }
  const [finished, setFinished] = useState(false);

  const question = session[current];
  const progressPct = Math.round((current / session.length) * 100);

  function handleSelect(optionIndex) {
    if (selected !== null) return;
    const isCorrect = optionIndex === question.correctOption;
    setSelected(optionIndex);
    setAnswers((prev) => [...prev, { era: question.era, correct: isCorrect }]);
  }

  function handleNext() {
    if (current + 1 >= session.length) {
      setFinished(true);
      return;
    }
    setCurrent((c) => c + 1);
    setSelected(null);
  }

  function handleRestart() {
    setSession(buildSession());
    setCurrent(0);
    setSelected(null);
    setAnswers([]);
    setFinished(false);
  }

  const scoreByEra = useMemo(() => {
    const map = Object.fromEntries(ERAS.map((era) => [era, { correct: 0, total: 0 }]));
    answers.forEach(({ era, correct }) => {
      map[era].total += 1;
      if (correct) map[era].correct += 1;
    });
    return map;
  }, [answers]);

  const totalCorrect = answers.filter((a) => a.correct).length;

  // --- RESULTS VIEW ---
  if (finished) {
    return (
      <div
        role="region"
        aria-label="Trivia quiz results"
        className="mx-auto w-full max-w-2xl rounded-[var(--radius-lg)] border border-[var(--border-color)] bg-[var(--color-surface)] p-6 sm:p-8 font-[var(--font-body)] shadow-[var(--shadow-card)]"
      >
        <h3 className="font-[var(--font-heading)] text-2xl font-bold text-[var(--color-text-primary)] tracking-tight">
          Session Complete
        </h3>
        <p className="mt-2 font-[var(--font-mono)] text-sm text-[var(--color-text-secondary)]">
          Final Score: <span className="text-[var(--color-primary)] font-bold">{totalCorrect}</span> / {session.length}
        </p>

        <div className="mt-6 space-y-3">
          {ERAS.map((era) => {
            const s = scoreByEra[era];
            const pct = s.total ? Math.round((s.correct / s.total) * 100) : 0;
            return (
              <div key={era} className="rounded-[var(--radius-md)] border border-[var(--border-color)] bg-[var(--color-background)] p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[var(--color-text-primary)]">{era}</span>
                  <span className="font-[var(--font-mono)] text-xs text-[var(--color-primary)]">
                    {s.correct} / {s.total} ({pct}%)
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[var(--color-primary)] transition-[width] duration-[var(--duration-standard)] ease-[var(--ease-snappy)] motion-reduce:transition-none"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleRestart}
          className="mt-6 w-full rounded-[var(--radius-md)] border border-[var(--color-primary)]/30 bg-transparent px-4 py-3 font-medium text-[var(--color-primary)] transition-all duration-[var(--duration-fast)] hover:bg-[var(--color-primary)]/5 hover:border-[var(--color-primary)] focus-visible:outline-2 focus-visible:outline-[var(--color-primary)]"
        >
          Retake Quiz
        </button>
      </div>
    );
  }

  // --- QUIZ GAMEPLAY VIEW ---
  return (
    <div
      role="region"
      aria-label={`Trivia question ${current + 1} of ${session.length}, era: ${question.era}`}
      className="mx-auto w-full max-w-2xl rounded-[var(--radius-lg)] border border-[var(--border-color)] bg-[var(--color-surface)] p-6 sm:p-8 font-[var(--font-body)] shadow-[var(--shadow-card)]"
    >
      {/* Progress + Era Tag Header */}
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-[var(--radius-sm)] border border-[var(--color-secondary)]/30 bg-[var(--color-secondary)]/10 px-2.5 py-1 font-[var(--font-mono)] text-xs font-medium tracking-wide text-[var(--color-secondary)]">
          {question.era}
        </span>
        <span className="font-[var(--font-mono)] text-xs text-[var(--color-text-secondary)]">
          Question {current + 1} of {session.length}
        </span>
      </div>
      
      {/* Quiz Progress Bar */}
      <div className="mb-6 h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full bg-[var(--color-primary)] transition-[width] duration-[var(--duration-standard)] ease-[var(--ease-snappy)] motion-reduce:transition-none"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Question Text */}
      <h3 className="font-[var(--font-heading)] text-xl font-bold leading-snug text-[var(--color-text-primary)]">
        {question.question}
      </h3>

      {/* Answer Options List */}
      <div className="mt-6 flex flex-col gap-3">
        {question.options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrectOpt = i === question.correctOption;
          const showState = selected !== null;

          // Default state configuration
          let stateClasses = "border-[var(--border-color)] bg-[var(--color-background)] hover:border-[var(--color-primary)]/50 hover:bg-white/[0.02]";
          
          if (showState) {
            if (isCorrectOpt) {
              // Green/Success outline highlighting for the actual correct answer
              stateClasses = "border-[var(--color-success)] bg-[var(--color-success)]/5 text-[var(--color-text-primary)] shadow-[0_0_12px_rgba(0,230,118,0.15)]";
            } else if (isSelected && !isCorrectOpt) {
              // Red/Error highlighting if user selected an incorrect option
              stateClasses = "border-[var(--color-error)] bg-[var(--color-error)]/5 text-[var(--color-text-primary)] opacity-90";
            } else {
              // Dim down non-selected alternative wrong choices
              stateClasses = "border-[var(--border-color)] opacity-40 cross-events-none";
            }
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={showState}
              aria-pressed={isSelected}
              className={`min-h-[52px] rounded-[var(--radius-md)] border px-4 py-3 text-left text-sm font-medium transition-all duration-[var(--duration-fast)] ease-[var(--ease-snappy)] focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] motion-reduce:transition-none ${stateClasses}`}
            >
              <div className="flex items-center justify-between">
                <span>{opt}</span>
                {showState && isCorrectOpt && (
                  <span className="text-[var(--color-success)] text-xs font-mono font-bold ml-2">✓ Correct</span>
                )}
                {showState && isSelected && !isCorrectOpt && (
                  <span className="text-[var(--color-error)] text-xs font-mono font-bold ml-2">✗ Incorrect</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Feedback & Detailed Explanation Box */}
      {selected !== null && selected !== question.correctOption && (
        <div className="mt-4 rounded-[var(--radius-md)] border border-[var(--color-error)]/20 bg-[var(--color-error)]/5 p-4 font-[var(--font-body)] text-xs leading-relaxed text-[var(--color-text-primary)]">
          <p className="font-[var(--font-mono)] font-bold text-[var(--color-error)] mb-1">Context Breakdown:</p>
          <p className="text-[var(--color-text-secondary)]">{question.explanation}</p>
        </div>
      )}

      {/* Primary Action Call-to-action Button */}
      {selected !== null && (
        <button
          onClick={handleNext}
          className="mt-6 w-full rounded-[var(--radius-md)] bg-[var(--color-primary)] px-4 py-3.5 text-sm font-bold text-[var(--color-background)] transition-all duration-[var(--duration-fast)] hover:brightness-110 focus-visible:outline-2 focus-visible:outline-[var(--color-primary)] shadow-[0_4px_20px_rgba(0,229,255,0.2)]"
        >
          {current + 1 >= session.length ? "See Final Results" : "Next Question"}
        </button>
      )}
    </div>
  );
}