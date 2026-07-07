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

// Build a 15-question session: at least 3 per era, rest filled randomly,
// and randomize the order of answer choices for each question.
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
    if (selected !== null) return; // lock after first answer
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

  if (finished) {
    return (
      <div
        role="region"
        aria-label="Trivia quiz results"
        className="mx-auto w-full max-w-2xl rounded-2xl border border-white/10 bg-[#141420] p-6 sm:p-8 font-[Inter]"
      >
        <h3 className="font-[Space_Grotesk] text-2xl font-bold text-[#F0F0F5]">
          Session Complete
        </h3>
        <p className="mt-1 font-mono text-sm text-[#8888A0]">
          You scored {totalCorrect} / {session.length}
        </p>

        <div className="mt-6 space-y-3">
          {ERAS.map((era) => {
            const s = scoreByEra[era];
            const pct = s.total ? Math.round((s.correct / s.total) * 100) : 0;
            return (
              <div key={era} className="rounded-lg border border-white/10 bg-[#0A0A0F] p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#F0F0F5]">{era}</span>
                  <span className="font-mono text-xs text-[#00E5FF]">
                    {s.correct}/{s.total}
                  </span>
                </div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-white/10">
                  <div
                    className="h-1.5 rounded-full bg-[#00E5FF] transition-[width] duration-300 motion-reduce:transition-none"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleRestart}
          className="mt-6 w-full rounded-md border border-[#00E5FF]/40 bg-transparent px-4 py-3 font-medium text-[#00E5FF] transition-transform duration-150 hover:scale-[1.02] hover:shadow-[0_0_0_1px_rgba(0,229,255,0.4)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00E5FF] motion-reduce:transition-none motion-reduce:hover:scale-100"
        >
          Retake Quiz
        </button>
      </div>
    );
  }

  return (
    <div
      role="region"
      aria-label={`Trivia question ${current + 1} of ${session.length}, era: ${question.era}`}
      className="mx-auto w-full max-w-2xl rounded-2xl border border-white/10 bg-[#141420] p-6 sm:p-8 font-[Inter]"
    >
      {/* Progress + era tag */}
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-sm border border-[#7B61FF]/40 bg-[#7B61FF]/10 px-2 py-1 font-mono text-xs tracking-wide text-[#7B61FF]">
          {question.era}
        </span>
        <span className="font-mono text-xs text-[#8888A0]">
          {current + 1} / {session.length}
        </span>
      </div>
      <div className="mb-6 h-1.5 w-full rounded-full bg-white/10">
        <div
          className="h-1.5 rounded-full bg-[#00E5FF] transition-[width] duration-300 motion-reduce:transition-none"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Question */}
      <h3 className="font-[Space_Grotesk] text-lg font-medium leading-snug text-[#F0F0F5]">
        {question.question}
      </h3>

      {/* Options */}
      <div className="mt-5 flex flex-col gap-3">
        {question.options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrectOpt = i === question.correctOption;
          const showState = selected !== null;

          let stateClasses = "border-white/10 hover:border-[#00E5FF]/60";
          if (showState && isCorrectOpt) {
            stateClasses = "border-[#00E5FF] shadow-[0_0_0_1px_rgba(0,229,255,0.4)]";
          } else if (showState && isSelected && !isCorrectOpt) {
            stateClasses = "border-red-400 shadow-[0_0_0_1px_rgba(248,113,113,0.4)]";
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={showState}
              aria-pressed={isSelected}
              className={`min-h-[48px] rounded-md border bg-[#0A0A0F] px-4 py-3 text-left text-sm text-[#F0F0F5] transition-transform duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00E5FF] motion-reduce:transition-none ${stateClasses} ${
                !showState ? "hover:scale-[1.02]" : ""
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {/* Explanation on wrong answer */}
      {selected !== null && selected !== question.correctOption && (
        <p className="mt-4 rounded-md border border-red-400/30 bg-red-400/5 p-3 font-mono text-xs leading-relaxed text-[#F0F0F5]">
          {question.explanation}
        </p>
      )}

      {/* Next button */}
      {selected !== null && (
        <button
          onClick={handleNext}
          className="mt-6 w-full rounded-md bg-[#00E5FF] px-4 py-3 font-medium text-[#0A0A0F] transition-transform duration-150 hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00E5FF] motion-reduce:transition-none motion-reduce:hover:scale-100"
        >
          {current + 1 >= session.length ? "See Results" : "Next Question"}
        </button>
      )}
    </div>
  );
}