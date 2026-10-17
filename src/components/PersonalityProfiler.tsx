import React, { useState } from 'react';
import { StudentProfile } from '../types';
import {
  UserCheck,
  Brain,
  Sparkles,
  Zap,
  CheckCircle,
  Activity,
  Layers,
  ArrowRight,
  ShieldAlert,
  Compass,
  Clock,
  BookOpen
} from 'lucide-react';

interface Props {
  profile: StudentProfile;
  onUpdateProfile: (profile: StudentProfile) => void;
  onAnalyze: (data: { answers: Record<string, string>; selfDescription?: string }) => Promise<void>;
  isLoading: boolean;
  onApplyToCurriculum: () => void;
}

const QUESTIONS = [
  {
    id: 'q1_motivation',
    title: '1. What primarily drives your academic inquiry?',
    options: [
      { label: 'Uncovering the fundamental first principles of reality', val: 'first_principles' },
      { label: 'Building tangible systems and seeing immediate real-world results', val: 'empirical_building' },
      { label: 'Connecting multidisciplinary ideas and broad conceptual frameworks', val: 'holistic_synthesis' },
      { label: 'Mastering rigorous exam benchmarks and competitive excellence', val: 'mastery_excellence' }
    ]
  },
  {
    id: 'q2_friction',
    title: '2. When stuck on an exceptionally difficult concept, what is your initial inner voice?',
    options: [
      { label: '"Let me step back and break this down into elementary components." (Adult)', val: 'adult_rational' },
      { label: '"Why do I not know this already? I should be faster." (Critical Parent)', val: 'critical_parent' },
      { label: '"What if I fail this exam and everyone finds out?" (Adapted Child)', val: 'adapted_child' },
      { label: '"Wait, this contradicts what I thought—how fascinating!" (Natural Child)', val: 'natural_curiosity' }
    ]
  },
  {
    id: 'q3_processing',
    title: '3. How does your brain best represent complex knowledge?',
    options: [
      { label: 'Deductive mathematical proofs and strict logical hierarchies', val: 'deductive_proofs' },
      { label: 'Visual spatial diagrams, flowcharts, and system dynamics', val: 'visual_spatial' },
      { label: 'Hands-on experimentation, code prototyping, or problem sets', val: 'concrete_practice' },
      { label: 'Metaphorical narratives, philosophical implications, and analogies', val: 'analogical_synthesis' }
    ]
  },
  {
    id: 'q4_pacing',
    title: '4. What study rhythm gives you the deepest Flow State?',
    options: [
      { label: '50-minute intense deep focus blocks with 10-minute metacognitive debriefs', val: 'spaced_sprints' },
      { label: 'Long uninterrupted 2-3 hour deep dives on a single chapter', val: 'extended_deep_work' },
      { label: 'Fast 25-minute Pomodoro bursts with active flashcard retrieval', val: 'active_recall_bursts' },
      { label: 'Collaborative debate and peer explanation sessions', val: 'dialogue_socratic' }
    ]
  },
  {
    id: 'q5_evaluation',
    title: '5. How do you view academic exams and syllabus deadlines?',
    options: [
      { label: 'An objective diagnostic instrument measuring current retrieval automaticity', val: 'objective_feedback' },
      { label: 'A high-stress external judgment of personal intelligence', val: 'judgment_pressure' },
      { label: 'A game of strategy to be optimized and dismantled', val: 'strategic_optimization' },
      { label: 'An artificial constraint that distracts from genuine deep curiosity', val: 'curiosity_conflict' }
    ]
  }
];

export const PersonalityProfiler: React.FC<Props> = ({
  profile,
  onUpdateProfile,
  onAnalyze,
  isLoading,
  onApplyToCurriculum,
}) => {
  const [answers, setAnswers] = useState<Record<string, string>>({
    q1_motivation: 'first_principles',
    q2_friction: 'adult_rational',
    q3_processing: 'deductive_proofs',
    q4_pacing: 'spaced_sprints',
    q5_evaluation: 'objective_feedback'
  });
  const [selfDesc, setSelfDesc] = useState('');
  const [showAssessment, setShowAssessment] = useState(false);

  const handleSelectOption = (qId: string, val: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const handleRunAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAnalyze({ answers, selfDescription: selfDesc });
    setShowAssessment(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl bg-stone-900 border border-stone-800 p-5 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <UserCheck className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-bold text-stone-100">
              Student Personality &amp; Cognitive Profile Analyzer
            </h2>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Diagnoses learning archetypes, PAC ego states, and cognitive friction to make curriculum construction effortless
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowAssessment(!showAssessment)}
            className="flex items-center gap-2 rounded-xl border border-stone-700 bg-stone-800 px-4 py-2 text-xs font-semibold text-stone-200 hover:bg-stone-700 transition"
          >
            <Brain className="h-4 w-4 text-purple-400" />
            <span>{showAssessment ? 'View Current Profile' : 'Retake Diagnostic Test'}</span>
          </button>

          <button
            onClick={onApplyToCurriculum}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md hover:from-purple-500 hover:to-indigo-500 transition"
          >
            <Sparkles className="h-4 w-4" />
            <span>Apply to Curriculum</span>
          </button>
        </div>
      </div>

      {showAssessment ? (
        /* ASSESSMENT FORM */
        <div className="rounded-2xl border border-stone-800 bg-stone-900/95 p-6 shadow-xl space-y-6">
          <div className="border-b border-stone-800 pb-3">
            <h3 className="text-base font-bold text-stone-100">
              Cognitive &amp; Psychological Diagnostic Questionnaire
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Answer honestly based on your typical behavior when studying difficult university material.
            </p>
          </div>

          <form onSubmit={handleRunAssessment} className="space-y-5">
            {QUESTIONS.map((q) => (
              <div key={q.id} className="space-y-2 rounded-xl bg-stone-950/40 p-4 border border-stone-800">
                <h4 className="text-xs font-semibold text-stone-200">{q.title}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                  {q.options.map((opt) => {
                    const isSelected = answers[q.id] === opt.val;
                    return (
                      <div
                        key={opt.val}
                        onClick={() => handleSelectOption(q.id, opt.val)}
                        className={`flex items-center gap-2.5 rounded-lg border p-2.5 cursor-pointer text-xs transition ${
                          isSelected
                            ? 'border-purple-500 bg-purple-950/30 text-white font-medium'
                            : 'border-stone-800 bg-stone-900/80 hover:bg-stone-800 text-stone-300'
                        }`}
                      >
                        <span
                          className={`flex h-4 w-4 items-center justify-center rounded-full border text-[10px] ${
                            isSelected
                              ? 'border-purple-400 bg-purple-500 text-white'
                              : 'border-stone-600 bg-stone-800'
                          }`}
                        >
                          {isSelected && '✓'}
                        </span>
                        <span>{opt.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            <div>
              <label className="text-xs font-semibold text-stone-300 block mb-1">
                Optional: Describe your current academic hurdles or ideal learning state:
              </label>
              <textarea
                rows={2}
                value={selfDesc}
                onChange={(e) => setSelfDesc(e.target.value)}
                placeholder="e.g. I am an engineering student preparing for competitive gate exams; I tend to procrastinate when formulas feel abstract."
                className="w-full rounded-xl bg-stone-950 border border-stone-700 p-2.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAssessment(false)}
                className="rounded-xl px-4 py-2 text-xs font-medium text-stone-400 hover:text-stone-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-2.5 text-xs font-semibold text-white shadow-lg hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 transition"
              >
                <Sparkles className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>{isLoading ? 'Synthesizing Cognitive Profile...' : 'Run Cognitive Profiler'}</span>
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* PROFILE DISPLAY VIEW */
        <div className="space-y-6">
          {/* Main Hero Card: Archetype & Tagline */}
          <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-stone-900 via-stone-900 to-purple-950/30 p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-800">
              <div>
                <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider block mb-1">
                  Active Cognitive Archetype
                </span>
                <h3 className="text-2xl font-black text-stone-100 tracking-tight">
                  {profile.archetype}
                </h3>
                <p className="text-xs text-stone-300 mt-1 italic max-w-xl">
                  &ldquo;{profile.tagline}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onApplyToCurriculum}
                  className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-purple-500 transition"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Build Curriculum With This Profile</span>
                </button>
              </div>
            </div>

            {/* Ego State Balance Radar / Bar */}
            <div className="mt-5 rounded-xl bg-stone-950/60 p-4 border border-stone-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-amber-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-200">
                    Transactional Analysis (PAC) Baseline
                  </span>
                </div>
                <span className="text-xs text-stone-400">
                  Healthy Adult: {profile.egoStateBalance.adult}%
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-amber-400 font-semibold">
                    <span>Parent (Rules &amp; Standards)</span>
                    <span>{profile.egoStateBalance.parent}%</span>
                  </div>
                  <div className="h-2 w-full bg-stone-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400" style={{ width: `${profile.egoStateBalance.parent}%` }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-cyan-400 font-semibold">
                    <span>Adult (Logic &amp; Reality Testing)</span>
                    <span>{profile.egoStateBalance.adult}%</span>
                  </div>
                  <div className="h-2 w-full bg-stone-800 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-400" style={{ width: `${profile.egoStateBalance.adult}%` }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-purple-400 font-semibold">
                    <span>Child (Curiosity &amp; Drive)</span>
                    <span>{profile.egoStateBalance.child}%</span>
                  </div>
                  <div className="h-2 w-full bg-stone-800 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-400" style={{ width: `${profile.egoStateBalance.child}%` }} />
                  </div>
                </div>
              </div>

              <p className="text-xs text-stone-300 pt-1 leading-relaxed">
                {profile.egoStateBalance.analysis}
              </p>
            </div>
          </div>

          {/* 4 Cognitive Dimensions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl border border-stone-800 bg-stone-900/90 p-4 space-y-1">
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                Epistemic Curiosity
              </span>
              <p className="text-xs font-semibold text-teal-400">
                {profile.cognitiveDimensions.epistemicCuriosity}
              </p>
              <p className="text-[11px] text-stone-400 mt-1">
                Deep mechanism seeker; questions axioms.
              </p>
            </div>

            <div className="rounded-xl border border-stone-800 bg-stone-900/90 p-4 space-y-1">
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                Cognitive Processing Style
              </span>
              <p className="text-xs font-semibold text-purple-400">
                {profile.cognitiveDimensions.processingStyle}
              </p>
              <p className="text-[11px] text-stone-400 mt-1">
                Hierarchical, causal mental models.
              </p>
            </div>

            <div className="rounded-xl border border-stone-800 bg-stone-900/90 p-4 space-y-1">
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                Under Stress Response
              </span>
              <p className="text-xs font-semibold text-amber-400">
                {profile.cognitiveDimensions.stressResponse}
              </p>
              <p className="text-[11px] text-stone-400 mt-1">
                Deconstructs before acting.
              </p>
            </div>

            <div className="rounded-xl border border-stone-800 bg-stone-900/90 p-4 space-y-1">
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                Optimal Cadence
              </span>
              <p className="text-xs font-semibold text-emerald-400">
                {profile.cognitiveDimensions.optimalStudyCadence}
              </p>
              <p className="text-[11px] text-stone-400 mt-1">
                Prevents cognitive fatigue spikes.
              </p>
            </div>
          </div>

          {/* Strengths & Blind Spots */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Strengths */}
            <div className="rounded-2xl border border-emerald-500/30 bg-stone-900/90 p-5 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <CheckCircle className="h-4 w-4" />
                <span>Cognitive Strengths</span>
              </div>
              <ul className="space-y-2 text-xs text-stone-200">
                {profile.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Blind Spots & Remedies */}
            <div className="rounded-2xl border border-amber-500/30 bg-stone-900/90 p-5 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <ShieldAlert className="h-4 w-4" />
                <span>Cognitive Blind Spots &amp; Psychological Remedies</span>
              </div>
              <ul className="space-y-2 text-xs text-stone-200">
                {profile.blindSpots.map((b, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Tailored Curriculum Strategy Card */}
          <div className="rounded-2xl border border-stone-800 bg-stone-900/90 p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2.5">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                <Layers className="h-4 w-4" />
                <span>Tailored Curricular Construction Strategy</span>
              </div>
              <span className="text-[11px] text-stone-500">Auto-Applied to Syllabus Generator</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800">
                <span className="font-semibold text-stone-400 text-[10px] uppercase block mb-1">
                  Pacing Strategy
                </span>
                <p className="text-stone-200">
                  {profile.tailoredCurriculumStrategy.pacing}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800">
                <span className="font-semibold text-stone-400 text-[10px] uppercase block mb-1">
                  Checkpoint Frequency
                </span>
                <p className="text-stone-200">
                  {profile.tailoredCurriculumStrategy.checkpointFrequency}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-stone-950/60 border border-stone-800">
                <span className="font-semibold text-stone-400 text-[10px] uppercase block mb-1">
                  University Pedagogy Alignment
                </span>
                <p className="text-stone-200">
                  {profile.tailoredCurriculumStrategy.universityAlignment}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
