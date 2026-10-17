import React, { useState } from 'react';
import { DoubtInquiry } from '../types';
import {
  HelpCircle,
  Brain,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Flame,
  Activity,
  History,
  CheckCircle2,
  Globe2,
  Compass,
  Lightbulb,
  Search
} from 'lucide-react';

interface Props {
  inquiries: DoubtInquiry[];
  onAnalyzeDoubt: (data: { question: string; context?: string }) => Promise<void>;
  isLoading: boolean;
}

const PRESET_DOUBTS = [
  {
    q: "Why do I understand concepts easily when reading, but completely freeze during exams?",
    ctx: "High exam anxiety, feeling like an intellectual imposter before midterms."
  },
  {
    q: "Is abstract mathematics a real feature of the physical cosmos or just an internal human mental construct?",
    ctx: "Struggling to find meaning and motivation in purely theoretical proofs."
  },
  {
    q: "Why do I feel intense guilt and restlessness whenever I take an evening off from studying?",
    ctx: "Perfectionism, internal pressure from family and competitive university peers."
  },
  {
    q: "How do I balance studying for immediate exam marks versus taking time to deeply understand foundational principles?",
    ctx: "Time pressure vs epistemic curiosity conflict."
  }
];

export const DoubtInquiryView: React.FC<Props> = ({
  inquiries,
  onAnalyzeDoubt,
  isLoading,
}) => {
  const [questionInput, setQuestionInput] = useState('');
  const [contextInput, setContextInput] = useState('');
  const [selectedInquiryId, setSelectedInquiryId] = useState<string | null>(
    inquiries[0]?.id || null
  );

  const activeInquiry =
    inquiries.find((inq) => inq.id === selectedInquiryId) || inquiries[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionInput.trim()) return;
    await onAnalyzeDoubt({
      question: questionInput.trim(),
      context: contextInput.trim() || undefined,
    });
    setQuestionInput('');
    setContextInput('');
  };

  const handleSelectPreset = (p: { q: string; ctx: string }) => {
    setQuestionInput(p.q);
    setContextInput(p.ctx);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-stone-900 border border-stone-800 p-5 shadow-lg">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Brain className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-xl font-bold text-stone-100">
              Metacognitive Doubt &amp; Philosophical Inquiry Studio
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">
              Powered by Transactional Analysis (Parent-Adult-Child Ego States) &amp; Non-Dual World-Mind Synthesis
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form & History (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Inquiry Submission Box */}
          <div className="rounded-2xl border border-stone-800 bg-stone-900/90 p-5 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <span className="text-xs font-semibold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="h-4 w-4 text-indigo-400" />
                <span>Submit Student Doubt or Dilemma</span>
              </span>
              <span className="text-[11px] text-stone-500">PAC Ego-State Diagnostic</span>
            </div>

            {/* Quick Presets */}
            <div>
              <span className="text-[11px] font-medium text-stone-400 block mb-1.5">
                Common Metacognitive Dilemmas:
              </span>
              <div className="space-y-1.5">
                {PRESET_DOUBTS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPreset(p)}
                    className="w-full text-left rounded-lg bg-stone-950/60 p-2 text-[11px] text-stone-300 hover:bg-stone-800 hover:text-white border border-stone-800/80 transition truncate block"
                  >
                    &bull; {p.q}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 pt-1">
              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  Your Academic Doubt or Philosophical Question:
                </label>
                <textarea
                  required
                  rows={3}
                  value={questionInput}
                  onChange={(e) => setQuestionInput(e.target.value)}
                  placeholder="e.g. Why do I understand thermodynamics formulas but feel disconnected from why entropy actually matters in life? Or why does exam anxiety paralyze my logic?"
                  className="w-full rounded-xl bg-stone-950 border border-stone-700 p-3 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-stone-400 block mb-1">
                  Context / Emotional State (Optional):
                </label>
                <input
                  type="text"
                  value={contextInput}
                  onChange={(e) => setContextInput(e.target.value)}
                  placeholder="e.g. Pre-exam tension, imposter feelings, or curiosity about nature"
                  className="w-full rounded-xl bg-stone-950 border border-stone-700 px-3 py-2 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !questionInput.trim()}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 transition"
              >
                <Sparkles className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>{isLoading ? 'Deconstructing Ego States & Logic...' : 'Analyze with PAC & Metacognition'}</span>
              </button>
            </form>
          </div>

          {/* Past Inquiries Log */}
          {inquiries.length > 0 && (
            <div className="rounded-2xl border border-stone-800 bg-stone-900/90 p-5 shadow-md space-y-3">
              <div className="flex items-center justify-between border-b border-stone-800 pb-2.5">
                <span className="text-xs font-semibold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                  <History className="h-4 w-4 text-stone-400" />
                  <span>Thinking Pattern Archive ({inquiries.length})</span>
                </span>
                <span className="text-[10px] text-stone-500">Longitudinal Metacognition</span>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {inquiries.map((inq) => {
                  const isSelected = activeInquiry?.id === inq.id;
                  return (
                    <div
                      key={inq.id}
                      onClick={() => setSelectedInquiryId(inq.id)}
                      className={`rounded-xl p-3 border transition cursor-pointer ${
                        isSelected
                          ? 'border-indigo-500/50 bg-indigo-950/20'
                          : 'border-stone-800 bg-stone-950/40 hover:bg-stone-800/40'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] text-stone-500 mb-1">
                        <span>{inq.timestamp}</span>
                        <span className="rounded bg-stone-800 px-1.5 py-0.5 text-stone-300">
                          {inq.pacAnalysis?.dominantEgoState?.split(' ')[0] || 'PAC'}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-stone-200 line-clamp-2">
                        {inq.question}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Detailed Metacognitive Analysis (7 cols) */}
        <div className="lg:col-span-7">
          {activeInquiry ? (
            <div className="rounded-2xl border border-stone-800 bg-stone-900/95 p-6 shadow-xl space-y-5">
              {/* Question Banner */}
              <div className="pb-4 border-b border-stone-800">
                <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                  Inquiry Analysis
                </span>
                <h3 className="text-base font-bold text-stone-100 leading-snug">
                  &ldquo;{activeInquiry.question}&rdquo;
                </h3>
                {activeInquiry.context && (
                  <p className="text-xs text-stone-400 mt-1 italic">
                    Context: {activeInquiry.context}
                  </p>
                )}
              </div>

              {/* 1. Transactional Analysis (Parent-Adult-Child) Radar / Breakdown */}
              <div className="rounded-xl border border-stone-800 bg-stone-950/60 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-amber-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-200">
                      Parent-Adult-Child (PAC) Ego State Diagnostic
                    </span>
                  </div>
                  <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-400 border border-indigo-500/20">
                    Dominant: {activeInquiry.pacAnalysis.dominantEgoState}
                  </span>
                </div>

                {/* Score Bars */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {/* Parent */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-amber-300 font-medium">
                      <span>Parent</span>
                      <span>{activeInquiry.pacAnalysis.scoreDistribution.parentPercent}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-stone-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400"
                        style={{ width: `${activeInquiry.pacAnalysis.scoreDistribution.parentPercent}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-stone-500 block">Critical vs Nurturing</span>
                  </div>

                  {/* Adult */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-cyan-300 font-medium">
                      <span>Adult</span>
                      <span>{activeInquiry.pacAnalysis.scoreDistribution.adultPercent}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-stone-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-400"
                        style={{ width: `${activeInquiry.pacAnalysis.scoreDistribution.adultPercent}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-stone-500 block">Reality-Testing Logic</span>
                  </div>

                  {/* Child */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-purple-300 font-medium">
                      <span>Child</span>
                      <span>{activeInquiry.pacAnalysis.scoreDistribution.childPercent}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-stone-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-400"
                        style={{ width: `${activeInquiry.pacAnalysis.scoreDistribution.childPercent}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-stone-500 block">Curiosity &amp; Vulnerability</span>
                  </div>
                </div>

                {/* PAC Narrative Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-2 text-[11px]">
                  <div className="p-2.5 rounded-lg bg-stone-900 border border-amber-900/30 text-stone-300">
                    <span className="font-semibold text-amber-400 block mb-0.5">Parent Voice</span>
                    {activeInquiry.pacAnalysis.egoStateBreakdown.parent}
                  </div>
                  <div className="p-2.5 rounded-lg bg-stone-900 border border-cyan-900/30 text-stone-300">
                    <span className="font-semibold text-cyan-400 block mb-0.5">Adult Reality Voice</span>
                    {activeInquiry.pacAnalysis.egoStateBreakdown.adult}
                  </div>
                  <div className="p-2.5 rounded-lg bg-stone-900 border border-purple-900/30 text-stone-300">
                    <span className="font-semibold text-purple-400 block mb-0.5">Child Emotion/Curiosity</span>
                    {activeInquiry.pacAnalysis.egoStateBreakdown.child}
                  </div>
                </div>
              </div>

              {/* 2. Outer Material World & Inner Mind Synthesis */}
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/10 p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <Globe2 className="h-4 w-4" />
                  <span>Non-Dual Synthesis: Material Reality &amp; Inner Consciousness</span>
                </div>
                <p className="text-xs text-stone-200 leading-relaxed">
                  {activeInquiry.philosophicalSynthesis}
                </p>
              </div>

              {/* 3. Extracted Thinking Patterns */}
              {activeInquiry.extractedThinkingPatterns && activeInquiry.extractedThinkingPatterns.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Search className="h-4 w-4 text-purple-400" />
                    <span>Extracted Thinking Patterns &amp; Cognitive Reframing</span>
                  </span>
                  <div className="space-y-2">
                    {activeInquiry.extractedThinkingPatterns.map((tp, idx) => (
                      <div key={idx} className="rounded-xl border border-stone-800 bg-stone-950/50 p-3.5 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-amber-300">{tp.pattern}</span>
                          <span className="text-[10px] text-stone-400 bg-stone-800 px-2 py-0.5 rounded">
                            Pattern #{idx + 1}
                          </span>
                        </div>
                        <p className="text-xs text-stone-400 italic">
                          Signal detected: &ldquo;{tp.evidence}&rdquo;
                        </p>
                        <div className="rounded-lg bg-stone-900 p-2 text-xs text-stone-200 border border-stone-800">
                          <span className="font-semibold text-emerald-400">Adult Reframing: </span>
                          {tp.reframing}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Rigorous Academic / Conceptual Explanation */}
              <div className="rounded-xl border border-stone-800 bg-stone-950/50 p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                  <Lightbulb className="h-4 w-4" />
                  <span>Direct Conceptual Resolution</span>
                </div>
                <p className="text-xs text-stone-200 leading-relaxed whitespace-pre-line">
                  {activeInquiry.conceptualExplanation}
                </p>
              </div>

              {/* 5. Metacognitive Protocol (Thinking About Thinking) */}
              {activeInquiry.metacognitiveProtocol && (
                <div className="rounded-xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/30 to-stone-950 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                    <Compass className="h-4 w-4" />
                    <span>3-Step Metacognitive Realignment Protocol</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-start gap-2.5 rounded-lg bg-stone-900/80 p-2.5 border border-stone-800">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 font-bold text-[10px]">
                        1
                      </span>
                      <div>
                        <span className="font-semibold text-stone-200">Somatic &amp; Mental Observation:</span>
                        <p className="text-stone-400 mt-0.5">
                          {activeInquiry.metacognitiveProtocol.step1Observation}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 rounded-lg bg-stone-900/80 p-2.5 border border-stone-800">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-[10px]">
                        2
                      </span>
                      <div>
                        <span className="font-semibold text-stone-200">Objective Adult Deconstruction:</span>
                        <p className="text-stone-400 mt-0.5">
                          {activeInquiry.metacognitiveProtocol.step2Deconstruction}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 rounded-lg bg-stone-900/80 p-2.5 border border-stone-800">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                        3
                      </span>
                      <div>
                        <span className="font-semibold text-stone-200">Concrete Physical/Academic Action:</span>
                        <p className="text-stone-400 mt-0.5">
                          {activeInquiry.metacognitiveProtocol.step3AdultAction}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-stone-800 bg-stone-900/50 p-12 text-center">
              <Brain className="h-10 w-10 text-stone-600 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-stone-200">No Inquiries Selected</h3>
              <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
                Submit an academic doubt or philosophical question on the left to activate Transactional Analysis and Metacognitive Extraction.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
