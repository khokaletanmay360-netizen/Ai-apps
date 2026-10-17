import React, { useState } from 'react';
import { WorldQuote } from '../types';
import { Sparkles, RefreshCw, ChevronDown, ChevronUp, Brain, Globe2, Compass, CheckCircle2 } from 'lucide-react';

interface Props {
  quote: WorldQuote;
  onRefresh: () => void;
  isLoading: boolean;
}

export const QuoteBanner: React.FC<Props> = ({ quote, onRefresh, isLoading }) => {
  const [expanded, setExpanded] = useState(false);
  const [practiced, setPracticed] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-stone-900 via-stone-900 to-amber-950/30 p-5 md:p-6 text-stone-100 shadow-xl backdrop-blur-sm transition-all duration-300">
      {/* Decorative subtle ambient glow */}
      <div className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      {/* Top Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-800">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Sparkles className="h-4 w-4" />
          </span>
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-amber-400">
              Today's World Quote &amp; Metacognitive Catalyst
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs text-stone-400">
              • {quote.era}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-1.5 rounded-lg border border-stone-700 bg-stone-800/80 px-2.5 py-1 text-xs font-medium text-stone-300 hover:bg-stone-700 hover:text-white transition disabled:opacity-50"
            title="Generate new reflection"
          >
            <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
            <span>{isLoading ? 'Synthesizing...' : 'New Catalyst'}</span>
          </button>

          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 rounded-lg border border-stone-700 bg-stone-800/80 px-2.5 py-1 text-xs font-medium text-amber-300 hover:bg-stone-700 transition"
          >
            <span>{expanded ? 'Less Insight' : 'Deep Synthesis'}</span>
            {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
        </div>
      </div>

      {/* Main Quote Content */}
      <div className="mt-4">
        <blockquote className="text-lg md:text-xl font-medium tracking-tight text-stone-100 leading-relaxed italic font-serif">
          &ldquo;{quote.quote}&rdquo;
        </blockquote>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-400">
          <span className="font-semibold text-amber-300 not-italic">— {quote.author}</span>
          <span className="rounded-full bg-stone-800 px-2 py-0.5 text-stone-400 border border-stone-700">
            Modern World Context: {quote.context}
          </span>
        </div>
      </div>

      {/* Metacognitive Prompt Callout */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl bg-stone-800/60 p-3.5 border border-stone-700/60">
        <div className="flex items-start gap-2.5">
          <Compass className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-amber-300 uppercase tracking-wide">
              Today's Metacognitive Habit
            </p>
            <p className="text-xs text-stone-200 mt-0.5">
              {quote.metacognitiveAction}
            </p>
          </div>
        </div>

        <button
          onClick={() => setPracticed(!practiced)}
          className={`shrink-0 flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
            practiced
              ? 'bg-emerald-600 text-white border border-emerald-500'
              : 'bg-stone-700 hover:bg-stone-600 text-stone-200'
          }`}
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>{practiced ? 'Reflected & Anchored' : 'Mark as Practiced'}</span>
        </button>
      </div>

      {/* Expandable Deep Synthesis Section */}
      {expanded && (
        <div className="mt-4 space-y-3 pt-4 border-t border-stone-800/80 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Psychological Lens */}
            <div className="rounded-xl bg-stone-950/50 p-3.5 border border-stone-800">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1.5">
                <Brain className="h-4 w-4" />
                <span>Transactional &amp; Cognitive Lens</span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                {quote.psychologicalAngle}
              </p>
            </div>

            {/* Material World & Inner Mind Synthesis */}
            <div className="rounded-xl bg-stone-950/50 p-3.5 border border-stone-800">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1.5">
                <Globe2 className="h-4 w-4" />
                <span>Outer Reality &amp; Inner Consciousness Synthesis</span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                {quote.synthesisMaterialInner}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
