import React, { useState } from 'react';
import { ArgumentStep, MistakeAnalysis, QuizQuestion } from '../types';
import {
  Target,
  Sparkles,
  CheckCircle,
  XCircle,
  HelpCircle,
  ArrowRight,
  Brain,
  AlertCircle,
  RotateCcw,
  BookOpen,
  Zap,
  Layers,
  ChevronRight,
  ShieldCheck,
  Check
} from 'lucide-react';

interface Props {
  initialTopic?: string;
  onGenerateTest: (topic: string, difficulty: string) => Promise<QuizQuestion[]>;
  onAnalyzeMistake: (data: {
    question: string;
    chosenAnswer: string;
    correctAnswer: string;
    studentReasoning: string;
    topic?: string;
  }) => Promise<MistakeAnalysis>;
  isGeneratingTest: boolean;
  isAnalyzingMistake: boolean;
}

export const TestMistakeView: React.FC<Props> = ({
  initialTopic,
  onGenerateTest,
  onAnalyzeMistake,
  isGeneratingTest,
  isAnalyzingMistake,
}) => {
  const [activeTab, setActiveTab] = useState<'take-test' | 'logic-debugger'>('take-test');

  // Test Generator State
  const [testTopic, setTestTopic] = useState(initialTopic || 'Algorithmic Invariants & Complexity');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    {
      id: 'q-demo-1',
      question: 'Consider a binary search on a sorted array of N elements. If the target element is absent, what is the exact maximum number of comparisons performed?',
      options: [
        'log2(N) rounded down',
        'floor(log2(N)) + 1',
        'N / 2',
        '2 * log2(N)'
      ],
      correctIndex: 1,
      conceptTested: 'Binary decision tree height and worst-case comparison bounds',
      commonFlawTrap: 'Forgetting that leaf nodes at the deepest level require one final boundary comparison when absent.',
      explanation: 'Binary search repeatedly halves the search territory. When the target is absent, the search terminates only after the pointers cross, requiring floor(log2(N)) + 1 comparisons.'
    },
    {
      id: 'q-demo-2',
      question: 'In thermodynamics, when an ideal gas expands adiabatically against an external constant pressure in an insulated cylinder, what happens to the internal energy and temperature?',
      options: [
        'Internal energy remains constant; temperature decreases',
        'Internal energy decreases; temperature decreases',
        'Internal energy decreases; temperature remains constant',
        'Internal energy increases due to entropy production'
      ],
      correctIndex: 1,
      conceptTested: 'First Law of Thermodynamics (delta U = Q - W) under adiabatic constraints',
      commonFlawTrap: 'Confusing isothermal expansion with adiabatic expansion, assuming temperature stays fixed because no heat enters.',
      explanation: 'Because the cylinder is insulated, heat transfer Q = 0. As the gas expands against external pressure, work W > 0 is done by the system. By delta U = Q - W, delta U = -W < 0. For an ideal gas, U is proportional to temperature, hence temperature decreases.'
    }
  ]);

  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [testSubmitted, setTestSubmitted] = useState(false);

  // Logic Debugger State
  const [debugQuestion, setDebugQuestion] = useState('');
  const [debugChosenAnswer, setDebugChosenAnswer] = useState('');
  const [debugCorrectAnswer, setDebugCorrectAnswer] = useState('');
  const [studentReasoning, setStudentReasoning] = useState('');
  const [mistakeAnalysis, setMistakeAnalysis] = useState<MistakeAnalysis | null>(null);
  const [microAnswerVerified, setMicroAnswerVerified] = useState(false);

  const handleRunTestGeneration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testTopic.trim()) return;
    const newQuestions = await onGenerateTest(testTopic.trim(), difficulty);
    if (newQuestions && newQuestions.length > 0) {
      setQuestions(newQuestions);
      setSelectedAnswers({});
      setTestSubmitted(false);
    }
  };

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    if (testSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleSubmitQuiz = () => {
    setTestSubmitted(true);
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setTestSubmitted(false);
  };

  // Launch Logic Debugger from a specific quiz question
  const handleLaunchDebuggerFromQuiz = (q: QuizQuestion, qIdx: number) => {
    const chosenIdx = selectedAnswers[qIdx] ?? 0;
    setDebugQuestion(q.question);
    setDebugChosenAnswer(q.options[chosenIdx] || 'Option ' + chosenIdx);
    setDebugCorrectAnswer(q.options[q.correctIndex]);
    setStudentReasoning('');
    setMistakeAnalysis(null);
    setMicroAnswerVerified(false);
    setActiveTab('logic-debugger');
  };

  const handleAnalyzeMistakeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!debugQuestion.trim() || !studentReasoning.trim()) return;

    const analysis = await onAnalyzeMistake({
      question: debugQuestion.trim(),
      chosenAnswer: debugChosenAnswer.trim(),
      correctAnswer: debugCorrectAnswer.trim(),
      studentReasoning: studentReasoning.trim(),
      topic: testTopic,
    });
    setMistakeAnalysis(analysis);
  };

  // Calculate score
  const score = questions.reduce((acc, q, idx) => {
    return selectedAnswers[idx] === q.correctIndex ? acc + 1 : acc;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Top Header & Tab Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl bg-stone-900 border border-stone-800 p-5 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/20 text-teal-400 border border-teal-500/30">
              <Target className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-bold text-stone-100">
              Diagnostic Assessment &amp; Logic Flaw Rectifier
            </h2>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Test syllabus understanding, then inspect and re-order flawed reasoning into sound deductive logic
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-stone-950 p-1 border border-stone-800">
          <button
            onClick={() => setActiveTab('take-test')}
            className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition ${
              activeTab === 'take-test'
                ? 'bg-teal-600 text-white shadow'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            1. Diagnostic Test
          </button>
          <button
            onClick={() => setActiveTab('logic-debugger')}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-semibold transition ${
              activeTab === 'logic-debugger'
                ? 'bg-amber-600 text-white shadow'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Brain className="h-3.5 w-3.5" />
            <span>2. Improve the Mistake</span>
          </button>
        </div>
      </div>

      {activeTab === 'take-test' ? (
        /* TAB 1: TAKE DIAGNOSTIC TEST */
        <div className="space-y-6">
          {/* Test Generation Config Card */}
          <div className="rounded-2xl border border-stone-800 bg-stone-900/90 p-5 shadow-md">
            <form onSubmit={handleRunTestGeneration} className="flex flex-col md:flex-row gap-3 items-end">
              <div className="flex-1">
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  Test Subject / Syllabus Topic:
                </label>
                <input
                  type="text"
                  required
                  value={testTopic}
                  onChange={(e) => setTestTopic(e.target.value)}
                  placeholder="e.g. Asymptotic Complexity, Chemical Bonding, Linear Algebra..."
                  className="w-full rounded-xl bg-stone-950 border border-stone-700 px-3.5 py-2 text-xs text-stone-100 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="w-full md:w-44">
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  Difficulty:
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  aria-label="Test Difficulty Level"
                  className="w-full rounded-xl bg-stone-950 border border-stone-700 px-3 py-2 text-xs text-stone-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
                >
                  <option value="Foundational">Foundational Concept</option>
                  <option value="Intermediate">Intermediate (University)</option>
                  <option value="Advanced">Advanced (Tricky Boundary Cases)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isGeneratingTest || !testTopic.trim()}
                className="w-full md:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-5 py-2 text-xs font-semibold text-white shadow-md hover:from-teal-500 hover:to-emerald-500 disabled:opacity-50 transition shrink-0"
              >
                <Sparkles className={`h-4 w-4 ${isGeneratingTest ? 'animate-spin' : ''}`} />
                <span>{isGeneratingTest ? 'Drafting Test...' : 'Generate New Test'}</span>
              </button>
            </form>
          </div>

          {/* Test Questions Container */}
          <div className="space-y-5">
            {questions.map((q, qIdx) => {
              const studentChoice = selectedAnswers[qIdx];
              const isAnswered = studentChoice !== undefined;
              const isCorrect = testSubmitted && studentChoice === q.correctIndex;
              const isWrong = testSubmitted && isAnswered && studentChoice !== q.correctIndex;

              return (
                <div
                  key={q.id || qIdx}
                  className={`rounded-2xl border transition-all p-5 shadow-md ${
                    testSubmitted
                      ? isCorrect
                        ? 'border-emerald-500/40 bg-emerald-950/10'
                        : isWrong
                        ? 'border-red-500/40 bg-red-950/10'
                        : 'border-stone-800 bg-stone-900/90'
                      : 'border-stone-800 bg-stone-900/90'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-stone-800 text-stone-300 text-xs font-bold border border-stone-700">
                      {qIdx + 1}
                    </span>
                    <span className="text-[11px] text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20">
                      {q.conceptTested}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-stone-100 leading-relaxed mb-4">
                    {q.question}
                  </h3>

                  {/* Options */}
                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = studentChoice === optIdx;
                      let optionStyle =
                        'border-stone-800 bg-stone-950/50 hover:bg-stone-800/60 text-stone-200';

                      if (isSelected) {
                        optionStyle = 'border-teal-500 bg-teal-950/30 text-white font-medium';
                      }

                      if (testSubmitted) {
                        if (optIdx === q.correctIndex) {
                          optionStyle =
                            'border-emerald-500 bg-emerald-950/40 text-emerald-200 font-semibold';
                        } else if (isSelected && optIdx !== q.correctIndex) {
                          optionStyle =
                            'border-red-500 bg-red-950/40 text-red-200 font-semibold line-through';
                        }
                      }

                      return (
                        <div
                          key={optIdx}
                          onClick={() => handleSelectOption(qIdx, optIdx)}
                          className={`flex items-center justify-between rounded-xl border p-3 cursor-pointer text-xs transition ${optionStyle}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-stone-800 text-[11px] font-bold text-stone-300 border border-stone-700 shrink-0">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span>{opt}</span>
                          </div>

                          {testSubmitted && optIdx === q.correctIndex && (
                            <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                          )}
                          {testSubmitted && isSelected && optIdx !== q.correctIndex && (
                            <XCircle className="h-4 w-4 text-red-400 shrink-0" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Post-Submit Review & Callout */}
                  {testSubmitted && (
                    <div className="mt-4 pt-4 border-t border-stone-800/80 space-y-3">
                      <div className="rounded-xl bg-stone-950/70 p-3.5 border border-stone-800 text-xs">
                        <span className="font-semibold text-teal-400 uppercase tracking-wide text-[10px] block mb-1">
                          Conceptual Walkthrough
                        </span>
                        <p className="text-stone-300 leading-relaxed">{q.explanation}</p>
                        {q.commonFlawTrap && (
                          <p className="text-amber-300/90 mt-2 text-[11px] italic">
                            ⚠️ Common Trap: {q.commonFlawTrap}
                          </p>
                        )}
                      </div>

                      {/* Prominent Action to Improve Mistake */}
                      <div className="flex flex-wrap items-center justify-between gap-3 bg-stone-950 p-3 rounded-xl border border-stone-800">
                        <div className="text-xs text-stone-400">
                          {isCorrect ? (
                            <span className="text-emerald-400 font-semibold">
                              ✓ Correct! Want to inspect your deductive step anyway?
                            </span>
                          ) : (
                            <span className="text-amber-400 font-semibold">
                              Flaw detected in reasoning. Debug why your brain picked this option!
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => handleLaunchDebuggerFromQuiz(q, qIdx)}
                          className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow hover:from-amber-500 hover:to-orange-500 transition"
                        >
                          <Brain className="h-3.5 w-3.5" />
                          <span>Debug My Logic &amp; Improve Mistake</span>
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quiz Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-stone-900 border border-stone-800 p-5 shadow-md">
            <div>
              {testSubmitted ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-stone-100">
                    Result: {score} / {questions.length} Correct
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      score === questions.length
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {Math.round((score / questions.length) * 100)}% Logic Accuracy
                  </span>
                </div>
              ) : (
                <span className="text-xs text-stone-400">
                  Select your choices and submit to grade your deductive precision.
                </span>
              )}
            </div>

            <div className="flex items-center gap-2.5">
              {testSubmitted ? (
                <button
                  onClick={handleResetQuiz}
                  className="flex items-center gap-1.5 rounded-xl border border-stone-700 bg-stone-800 px-4 py-2 text-xs font-semibold text-stone-200 hover:bg-stone-700 transition"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Retake Test</span>
                </button>
              ) : (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(selectedAnswers).length === 0}
                  className="flex items-center gap-1.5 rounded-xl bg-teal-600 px-5 py-2 text-xs font-semibold text-white shadow-lg hover:bg-teal-500 disabled:opacity-50 transition"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Submit Test &amp; Evaluate Logic</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* TAB 2: IMPROVE THE MISTAKE & LOGIC DEBUGGER */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Input Student's Logic (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl border border-stone-800 bg-stone-900/90 p-5 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Brain className="h-4 w-4" />
                  <span>Student Logic &amp; Flaw Dissector</span>
                </span>
                <span className="text-[10px] text-stone-500">Cognitive Reconstruction</span>
              </div>

              <form onSubmit={handleAnalyzeMistakeSubmit} className="space-y-3.5">
                <div>
                  <label className="text-xs font-semibold text-stone-300 block mb-1">
                    The Problem / Question:
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={debugQuestion}
                    onChange={(e) => setDebugQuestion(e.target.value)}
                    placeholder="Enter the problem statement or question you made a mistake on..."
                    className="w-full rounded-xl bg-stone-950 border border-stone-700 p-2.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] font-semibold text-red-300 block mb-1">
                      Your Chosen Answer:
                    </label>
                    <input
                      type="text"
                      required
                      value={debugChosenAnswer}
                      onChange={(e) => setDebugChosenAnswer(e.target.value)}
                      placeholder="e.g. floor(log2(N))"
                      className="w-full rounded-xl bg-stone-950 border border-stone-700 px-3 py-1.5 text-xs text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-emerald-300 block mb-1">
                      Correct Answer:
                    </label>
                    <input
                      type="text"
                      required
                      value={debugCorrectAnswer}
                      onChange={(e) => setDebugCorrectAnswer(e.target.value)}
                      placeholder="e.g. floor(log2(N)) + 1"
                      className="w-full rounded-xl bg-stone-950 border border-stone-700 px-3 py-1.5 text-xs text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>

                {/* THE CORE QUESTION PROMPT */}
                <div className="rounded-xl bg-amber-950/20 border border-amber-500/30 p-3 space-y-1.5">
                  <label className="text-xs font-bold text-amber-300 block">
                    What Logic or Reasoning Did You Use?
                  </label>
                  <p className="text-[11px] text-stone-400">
                    Be honest: What assumption did you make? What rule did you think applied? (e.g. &ldquo;I thought the tree search finishes at the leaf, so I forgot about the empty child step...&rdquo;)
                  </p>
                  <textarea
                    required
                    rows={4}
                    value={studentReasoning}
                    onChange={(e) => setStudentReasoning(e.target.value)}
                    placeholder="Explain your step-by-step thinking when you picked that answer..."
                    className="w-full rounded-lg bg-stone-950 border border-stone-700 p-2.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isAnalyzingMistake || !debugQuestion.trim() || !studentReasoning.trim()}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:from-amber-500 hover:to-orange-500 disabled:opacity-50 transition"
                >
                  <Sparkles className={`h-4 w-4 ${isAnalyzingMistake ? 'animate-spin' : ''}`} />
                  <span>{isAnalyzingMistake ? 'Deconstructing Flaws & Ordering Logic...' : 'Find Flaws & Re-Order Logically'}</span>
                </button>
              </form>
            </div>
          </div>

          {/* Right: Output Dissection & Reconstructed Logic Chain (7 cols) */}
          <div className="lg:col-span-7">
            {mistakeAnalysis ? (
              <div className="rounded-2xl border border-stone-800 bg-stone-900/95 p-6 shadow-xl space-y-5 animate-in fade-in duration-300">
                {/* 1. Identified Flaw Header */}
                <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertCircle className="h-4 w-4" />
                      <span>Identified Cognitive / Logical Flaw</span>
                    </span>
                    <span className="rounded bg-red-900/40 px-2 py-0.5 text-[10px] font-semibold text-red-200 border border-red-700/50">
                      Fallacy Analysis
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-red-200">
                    {mistakeAnalysis.identifiedFlaw.name}
                  </h4>
                  <p className="text-xs text-stone-200 leading-relaxed">
                    {mistakeAnalysis.identifiedFlaw.description}
                  </p>
                  <div className="rounded-lg bg-stone-950/60 p-2 text-xs text-amber-200 border border-stone-800">
                    <span className="font-semibold text-amber-400">Why your brain took this trap: </span>
                    {mistakeAnalysis.identifiedFlaw.intuitiveTrap}
                  </div>
                </div>

                {/* 2. Structured Logic Chain Reconstruction */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-200 uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="h-4 w-4 text-teal-400" />
                      <span>Re-Arranged Logical Argument Sequence</span>
                    </span>
                    <span className="text-[10px] text-stone-500">Formal Deductive Flow</span>
                  </div>

                  <div className="space-y-2">
                    {mistakeAnalysis.argumentReconstruction.map((step) => {
                      const isDivergence = step.type.toLowerCase().includes('divergence') || step.type.toLowerCase().includes('leap');
                      const isConclusion = step.type.toLowerCase().includes('conclusion');
                      const isDeduction = step.type.toLowerCase().includes('deduction');

                      return (
                        <div
                          key={step.step}
                          className={`rounded-xl border p-3.5 space-y-1 transition ${
                            isDivergence
                              ? 'border-amber-500/40 bg-amber-950/20'
                              : isConclusion
                              ? 'border-emerald-500/40 bg-emerald-950/20'
                              : isDeduction
                              ? 'border-teal-500/30 bg-teal-950/20'
                              : 'border-stone-800 bg-stone-950/50'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-stone-400">Step {step.step}:</span>
                            <span
                              className={`rounded px-2 py-0.5 text-[10px] font-semibold ${
                                isDivergence
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : isConclusion
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : 'bg-stone-800 text-stone-300'
                              }`}
                            >
                              {step.type}
                            </span>
                          </div>
                          <p className="text-xs text-stone-100 leading-relaxed font-medium">
                            {step.text}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Deep Clear Explanation */}
                <div className="rounded-xl border border-stone-800 bg-stone-950/60 p-4 space-y-1.5">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
                    Clear Physical &amp; Conceptual Reality
                  </span>
                  <p className="text-xs text-stone-200 leading-relaxed whitespace-pre-line">
                    {mistakeAnalysis.clearExplanation}
                  </p>
                </div>

                {/* 4. Anchoring Mental Model / Rule of Thumb */}
                {mistakeAnalysis.anchoringMentalModel && (
                  <div className="rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-950/30 to-stone-950 p-4 space-y-2">
                    <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                      <Zap className="h-4 w-4" />
                      <span>Permanent Exam Heuristic: {mistakeAnalysis.anchoringMentalModel.name}</span>
                    </div>
                    <blockquote className="rounded-lg bg-stone-950/80 p-2.5 text-xs font-semibold text-stone-100 border border-stone-800 italic">
                      &ldquo;{mistakeAnalysis.anchoringMentalModel.rule}&rdquo;
                    </blockquote>
                    <p className="text-xs text-stone-400">
                      <span className="text-stone-300 font-semibold">How to deploy: </span>
                      {mistakeAnalysis.anchoringMentalModel.applicationGuide}
                    </p>
                  </div>
                )}

                {/* 5. Micro-Verification Question */}
                {mistakeAnalysis.microVerificationQuestion && (
                  <div className="rounded-xl border border-teal-500/30 bg-teal-950/20 p-4 space-y-2.5">
                    <span className="text-xs font-bold text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4" />
                      <span>Immediate Logic Check</span>
                    </span>
                    <p className="text-xs text-stone-200 font-medium">
                      {mistakeAnalysis.microVerificationQuestion.question}
                    </p>

                    {microAnswerVerified ? (
                      <div className="rounded-lg bg-emerald-950/40 p-2.5 border border-emerald-500/30 text-xs text-emerald-200 flex items-center gap-2">
                        <Check className="h-4 w-4 text-emerald-400" />
                        <span>Insight verified! Hint was: {mistakeAnalysis.microVerificationQuestion.hint}</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => setMicroAnswerVerified(true)}
                        className="rounded-lg bg-teal-600/80 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-500 transition"
                      >
                        Reveal Logic Solution
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-2xl border border-stone-800 bg-stone-900/50 p-12 text-center">
                <Brain className="h-10 w-10 text-stone-600 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-stone-200">Logic Debugger Ready</h3>
                <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
                  Fill in the problem and explain the logic you used on the left, or click &ldquo;Debug My Logic&rdquo; directly from the Diagnostic Test tab.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
