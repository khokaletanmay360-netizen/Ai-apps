import React, { useEffect, useState } from 'react';
import {
  Curriculum,
  DoubtInquiry,
  MistakeAnalysis,
  QuizQuestion,
  StudentProfile,
  WorldQuote,
} from './types';
import {
  DEFAULT_PROFILE,
  DEFAULT_QUOTE,
  INITIAL_CURRICULA,
  INITIAL_DOUBTS,
} from './data/defaultData';
import { api } from './services/api';
import { Navbar, NavTab } from './components/Navbar';
import { QuoteBanner } from './components/QuoteBanner';
import { CurriculumView } from './components/CurriculumView';
import { DoubtInquiryView } from './components/DoubtInquiryView';
import { TestMistakeView } from './components/TestMistakeView';
import { PersonalityProfiler } from './components/PersonalityProfiler';

const STORAGE_KEYS = {
  CURRICULA: 'noesis_curricula_v1',
  ACTIVE_CURR: 'noesis_active_curr_v1',
  DOUBTS: 'noesis_doubts_v1',
  PROFILE: 'noesis_profile_v1',
  QUOTE: 'noesis_quote_v1',
};

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('curriculum');

  // 1. Quote State
  const [quote, setQuote] = useState<WorldQuote>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.QUOTE);
      return saved ? JSON.parse(saved) : DEFAULT_QUOTE;
    } catch {
      return DEFAULT_QUOTE;
    }
  });
  const [isQuoteLoading, setIsQuoteLoading] = useState(false);

  // 2. Curricula State
  const [curricula, setCurricula] = useState<Curriculum[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRICULA);
      return saved ? JSON.parse(saved) : INITIAL_CURRICULA;
    } catch {
      return INITIAL_CURRICULA;
    }
  });

  const [activeCurriculumId, setActiveCurriculumId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_CURR);
      return saved || curricula[0]?.id || 'curr-1';
    } catch {
      return curricula[0]?.id || 'curr-1';
    }
  });

  const [isGeneratingCurriculum, setIsGeneratingCurriculum] = useState(false);

  // 3. Doubts State
  const [doubts, setDoubts] = useState<DoubtInquiry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DOUBTS);
      return saved ? JSON.parse(saved) : INITIAL_DOUBTS;
    } catch {
      return INITIAL_DOUBTS;
    }
  });
  const [isAnalyzingDoubt, setIsAnalyzingDoubt] = useState(false);

  // 4. Student Profile State
  const [profile, setProfile] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });
  const [isAnalyzingProfile, setIsAnalyzingProfile] = useState(false);

  // 5. Active test target topic (when navigating from curriculum to test)
  const [testTopicTarget, setTestTopicTarget] = useState<string>(
    'Algorithmic Invariants & Complexity'
  );
  const [isGeneratingTest, setIsGeneratingTest] = useState(false);
  const [isAnalyzingMistake, setIsAnalyzingMistake] = useState(false);

  // Persistence Effects
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRICULA, JSON.stringify(curricula));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [curricula]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_CURR, activeCurriculumId);
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [activeCurriculumId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DOUBTS, JSON.stringify(doubts));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [doubts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.QUOTE, JSON.stringify(quote));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [quote]);

  // Handler: Refresh Today's Quote
  const handleRefreshQuote = async () => {
    setIsQuoteLoading(true);
    try {
      const newQuote = await api.getQuote();
      setQuote(newQuote);
    } catch (err) {
      console.error('Failed to refresh quote:', err);
    } finally {
      setIsQuoteLoading(false);
    }
  };

  // Handler: Generate New Curriculum
  const handleGenerateCurriculum = async (data: {
    subject: string;
    targetGoal: string;
    university: string;
  }) => {
    setIsGeneratingCurriculum(true);
    try {
      const newCurr = await api.generateCurriculum({
        ...data,
        studentProfile: profile,
      });
      setCurricula((prev) => [newCurr, ...prev]);
      setActiveCurriculumId(newCurr.id);
    } catch (err) {
      console.error('Curriculum generation failed:', err);
    } finally {
      setIsGeneratingCurriculum(false);
    }
  };

  // Handler: Import Student's Own Syllabus
  const handleImportOwnSyllabus = async (data: {
    rawText: string;
    subject: string;
    university: string;
  }) => {
    setIsGeneratingCurriculum(true);
    try {
      const newCurr = await api.parseRawSyllabus({
        ...data,
        studentProfile: profile,
      });
      setCurricula((prev) => [newCurr, ...prev]);
      setActiveCurriculumId(newCurr.id);
    } catch (err) {
      console.error('Failed to parse own syllabus:', err);
    } finally {
      setIsGeneratingCurriculum(false);
    }
  };

  const handleCreateManualCurriculum = (newCurr: Curriculum) => {
    setCurricula((prev) => [newCurr, ...prev]);
    setActiveCurriculumId(newCurr.id);
  };

  const handleUpdateCurriculum = (updated: Curriculum) => {
    setCurricula((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const handleDeleteCurriculum = (id: string) => {
    setCurricula((prev) => {
      const remaining = prev.filter((c) => c.id !== id);
      if (activeCurriculumId === id && remaining.length > 0) {
        setActiveCurriculumId(remaining[0].id);
      }
      return remaining;
    });
  };

  // Handler: Analyze Doubt with PAC Theory
  const handleAnalyzeDoubt = async (data: { question: string; context?: string }) => {
    setIsAnalyzingDoubt(true);
    try {
      const analysis = await api.analyzeDoubt({
        question: data.question,
        context: data.context,
        studentBackground: `${profile.archetype} learner`,
      });
      setDoubts((prev) => [analysis, ...prev]);
    } catch (err) {
      console.error('Doubt analysis failed:', err);
    } finally {
      setIsAnalyzingDoubt(false);
    }
  };

  // Handler: Start test from curriculum topic
  const handleStartTestForTopic = (topic: string) => {
    setTestTopicTarget(topic);
    setActiveTab('test-mistakes');
  };

  // Handler: Generate Diagnostic Test Questions
  const handleGenerateTest = async (
    topic: string,
    difficulty: string
  ): Promise<QuizQuestion[]> => {
    setIsGeneratingTest(true);
    try {
      const res = await api.generateTest({ topic, difficulty, questionCount: 3 });
      return res.questions;
    } catch (err) {
      console.error('Test generation failed:', err);
      return [];
    } finally {
      setIsGeneratingTest(false);
    }
  };

  // Handler: Analyze Mistake & Logic Debugging
  const handleAnalyzeMistake = async (data: {
    question: string;
    chosenAnswer: string;
    correctAnswer: string;
    studentReasoning: string;
    topic?: string;
  }): Promise<MistakeAnalysis> => {
    setIsAnalyzingMistake(true);
    try {
      const res = await api.analyzeMistake(data);
      return res;
    } catch (err) {
      console.error('Mistake analysis failed:', err);
      throw err;
    } finally {
      setIsAnalyzingMistake(false);
    }
  };

  // Handler: Analyze Personality Profile
  const handleAnalyzePersonality = async (data: {
    answers: Record<string, string>;
    selfDescription?: string;
  }) => {
    setIsAnalyzingProfile(true);
    try {
      const newProfile = await api.analyzePersonality(data);
      setProfile(newProfile);
    } catch (err) {
      console.error('Personality profiling failed:', err);
    } finally {
      setIsAnalyzingProfile(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        profile={profile}
        syllabusCount={curricula.length}
      />

      {/* Main Content Body */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 space-y-6">
        {/* Prominent Today's World Quote & Metacognitive Catalyst Banner */}
        <QuoteBanner
          quote={quote}
          onRefresh={handleRefreshQuote}
          isLoading={isQuoteLoading}
        />

        {/* Dynamic Tab Views */}
        {activeTab === 'curriculum' && (
          <CurriculumView
            curricula={curricula}
            activeCurriculumId={activeCurriculumId}
            onSelectCurriculum={setActiveCurriculumId}
            onUpdateCurriculum={handleUpdateCurriculum}
            onDeleteCurriculum={handleDeleteCurriculum}
            studentProfile={profile}
            onGenerateNew={handleGenerateCurriculum}
            onImportOwnSyllabus={handleImportOwnSyllabus}
            onCreateManualCurriculum={handleCreateManualCurriculum}
            isGenerating={isGeneratingCurriculum}
            onStartTestForTopic={handleStartTestForTopic}
          />
        )}

        {activeTab === 'doubts' && (
          <DoubtInquiryView
            inquiries={doubts}
            onAnalyzeDoubt={handleAnalyzeDoubt}
            isLoading={isAnalyzingDoubt}
          />
        )}

        {activeTab === 'test-mistakes' && (
          <TestMistakeView
            initialTopic={testTopicTarget}
            onGenerateTest={handleGenerateTest}
            onAnalyzeMistake={handleAnalyzeMistake}
            isGeneratingTest={isGeneratingTest}
            isAnalyzingMistake={isAnalyzingMistake}
          />
        )}

        {activeTab === 'personality' && (
          <PersonalityProfiler
            profile={profile}
            onUpdateProfile={setProfile}
            onAnalyze={handleAnalyzePersonality}
            isLoading={isAnalyzingProfile}
            onApplyToCurriculum={() => setActiveTab('curriculum')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-800 bg-stone-950 py-6 text-center text-xs text-stone-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Noesis Academic &amp; Metacognitive Studio &bull; University Benchmark Aligned
          </span>
          <span className="text-stone-400">
            Synthesizing Material Physical Action with Subjective Psychological Clarity
          </span>
        </div>
      </footer>
    </div>
  );
}
