import React, { useState } from 'react';
import { Curriculum, StudentProfile, SyllabusModule, SyllabusTopic } from '../types';
import {
  BookOpen,
  CheckCircle,
  Circle,
  Plus,
  Sparkles,
  GraduationCap,
  Brain,
  Layers,
  ChevronDown,
  ChevronUp,
  FileText,
  Target,
  ExternalLink,
  Zap,
  Clock,
  Trash2,
  Check,
  Upload,
  ClipboardList,
  Edit3,
  HelpCircle,
  ListPlus
} from 'lucide-react';

interface Props {
  curricula: Curriculum[];
  activeCurriculumId: string;
  onSelectCurriculum: (id: string) => void;
  onUpdateCurriculum: (curriculum: Curriculum) => void;
  onDeleteCurriculum: (id: string) => void;
  studentProfile: StudentProfile;
  onGenerateNew: (data: { subject: string; targetGoal: string; university: string }) => Promise<void>;
  onImportOwnSyllabus?: (data: { rawText: string; subject: string; university: string }) => Promise<void>;
  onCreateManualCurriculum?: (curriculum: Curriculum) => void;
  isGenerating: boolean;
  onStartTestForTopic: (topic: string) => void;
}

const UNIVERSITY_OPTIONS = [
  'MIT (Massachusetts Institute of Technology)',
  'Stanford University',
  'University of Oxford',
  'University of Cambridge',
  'IIT Bombay / Delhi (Indian Institute of Technology)',
  'ETH Zurich',
  'Harvard University',
  'UC Berkeley',
  'My Home University / College'
];

const PRESET_SUBJECTS = [
  'Algorithmic Reasoning & Data Structures',
  'Thermodynamics & Statistical Mechanics',
  'Cognitive Neuroscience & Mind Models',
  'Discrete Mathematics & Formal Proofs',
  'Microeconomics & Game Theory',
  'Linear Algebra & High-Dimensional Geometry',
  'Organic Chemistry & Reaction Mechanisms'
];

const SAMPLE_PASTE_SYLLABUS = `Module 1: Foundations of Microeconomics
- Scarcity, Choice, and Opportunity Cost
- Production Possibility Frontiers and Comparative Advantage
- Market Demand and Supply Equilibria

Module 2: Consumer Theory & Axioms of Preference
- Utility Maximization under Budget Constraints
- Indifference Curves and Marginal Rate of Substitution
- Income and Substitution Effects (Slutsky Decomposition)

Module 3: Producer Theory & Cost Minimization
- Production Functions (Cobb-Douglas, CES)
- Short-Run vs Long-Run Cost Curves
- Isoquants and Isocost optimization

Module 4: Market Structures & Equilibrium
- Perfect Competition and Long-Run Free Entry
- Monopoly Pricing, Deadweight Loss, and Price Discrimination
- Oligopoly Models (Cournot, Bertrand, and Stackelberg)`;

export const CurriculumView: React.FC<Props> = ({
  curricula,
  activeCurriculumId,
  onSelectCurriculum,
  onUpdateCurriculum,
  onDeleteCurriculum,
  studentProfile,
  onGenerateNew,
  onImportOwnSyllabus,
  onCreateManualCurriculum,
  isGenerating,
  onStartTestForTopic,
}) => {
  // Modal states
  const [showOwnSyllabusModal, setShowOwnSyllabusModal] = useState(false);
  const [showArchitectModal, setShowArchitectModal] = useState(false);
  const [ownSyllabusTab, setOwnSyllabusTab] = useState<'paste' | 'manual'>('paste');

  // Paste / Import State
  const [customSubject, setCustomSubject] = useState('');
  const [customUniversity, setCustomUniversity] = useState('');
  const [rawSyllabusText, setRawSyllabusText] = useState('');

  // Manual Build State
  const [manualSubject, setManualSubject] = useState('');
  const [manualUniversity, setManualUniversity] = useState('');
  const [manualModulesList, setManualModulesList] = useState<
    Array<{ title: string; topicsText: string }>
  >([
    { title: 'Unit 1: Foundations', topicsText: 'Topic A\nTopic B' },
    { title: 'Unit 2: Core Concepts', topicsText: 'Topic C\nTopic D' }
  ]);

  // AI Architect State
  const [architectSubject, setArchitectSubject] = useState('');
  const [architectGoal, setArchitectGoal] = useState('Deep Conceptual Mastery & University Exam Prep');
  const [architectUniversity, setArchitectUniversity] = useState(UNIVERSITY_OPTIONS[0]);

  // View & Edit states
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({ 'mod-1': true });
  const [editingNotesTopicId, setEditingNotesTopicId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState('');

  // Add topic to existing module
  const [addingTopicModuleId, setAddingTopicModuleId] = useState<string | null>(null);
  const [newTopicName, setNewTopicName] = useState('');
  const [newTopicDesc, setNewTopicDesc] = useState('');

  // Add new module to current syllabus
  const [showAddModuleModal, setShowAddModuleModal] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [newModuleBloom, setNewModuleBloom] = useState('Understand & Apply');
  const [newModulePacing, setNewModulePacing] = useState('Deep Conceptual Flow');
  const [newModuleInitialTopic, setNewModuleInitialTopic] = useState('');

  const currentCurriculum = curricula.find((c) => c.id === activeCurriculumId) || curricula[0];

  // Statistics
  const totalTopics = currentCurriculum?.modules.reduce((acc, m) => acc + m.topics.length, 0) || 0;
  const completedTopics = currentCurriculum?.modules.reduce(
    (acc, m) => acc + m.topics.filter((t) => t.completed).length,
    0
  ) || 0;
  const progressPercent = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  const toggleModule = (modId: string) => {
    setExpandedModules((prev) => ({ ...prev, [modId]: !prev[modId] }));
  };

  const toggleTopicCompletion = (modId: string, topicId: string) => {
    if (!currentCurriculum) return;
    const updatedModules = currentCurriculum.modules.map((mod) => {
      if (mod.id !== modId) return mod;
      return {
        ...mod,
        topics: mod.topics.map((t) => (t.id === topicId ? { ...t, completed: !t.completed } : t)),
      };
    });
    onUpdateCurriculum({ ...currentCurriculum, modules: updatedModules });
  };

  const saveTopicNotes = (modId: string, topicId: string) => {
    if (!currentCurriculum) return;
    const updatedModules = currentCurriculum.modules.map((mod) => {
      if (mod.id !== modId) return mod;
      return {
        ...mod,
        topics: mod.topics.map((t) => (t.id === topicId ? { ...t, notes: tempNotes } : t)),
      };
    });
    onUpdateCurriculum({ ...currentCurriculum, modules: updatedModules });
    setEditingNotesTopicId(null);
  };

  const handleAddTopic = (modId: string) => {
    if (!newTopicName.trim() || !currentCurriculum) return;
    const newTopic: SyllabusTopic = {
      id: `top-custom-${Date.now()}`,
      name: newTopicName.trim(),
      description: newTopicDesc.trim() || 'Custom student-defined syllabus objective',
      recommendedResources: ['Class Notes & Problem Sets'],
      completed: false,
    };
    const updatedModules = currentCurriculum.modules.map((mod) => {
      if (mod.id !== modId) return mod;
      return { ...mod, topics: [...mod.topics, newTopic] };
    });
    onUpdateCurriculum({ ...currentCurriculum, modules: updatedModules });
    setNewTopicName('');
    setNewTopicDesc('');
    setAddingTopicModuleId(null);
  };

  // Add brand new module to current syllabus
  const handleAddNewModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModuleTitle.trim() || !currentCurriculum) return;

    const newModuleId = `mod-${Date.now()}`;
    const newModule: SyllabusModule = {
      id: newModuleId,
      week: currentCurriculum.modules.length + 1,
      title: newModuleTitle.trim(),
      universityEquivalent: `Module ${currentCurriculum.modules.length + 1}`,
      bloomLevel: newModuleBloom,
      cognitivePacing: newModulePacing,
      topics: newModuleInitialTopic.trim()
        ? [
            {
              id: `top-${Date.now()}-1`,
              name: newModuleInitialTopic.trim(),
              description: 'Primary core objective for this module',
              recommendedResources: ['Course Materials'],
              completed: false,
            },
          ]
        : [
            {
              id: `top-${Date.now()}-1`,
              name: 'Core Concepts & Mechanisms',
              description: 'Primary study topics',
              recommendedResources: ['Course Materials'],
              completed: false,
            },
          ],
      metacognitiveCheckpoint: `Can you explain ${newModuleTitle.trim()} from first principles without looking at notes?`,
      practicalAnchor: 'Applying this theory to a concrete real-world problem or calculation.',
    };

    const updated = {
      ...currentCurriculum,
      modules: [...currentCurriculum.modules, newModule],
      totalEstimatedWeeks: Math.max(currentCurriculum.totalEstimatedWeeks, currentCurriculum.modules.length + 1),
    };

    onUpdateCurriculum(updated);
    setExpandedModules((prev) => ({ ...prev, [newModuleId]: true }));
    setShowAddModuleModal(false);
    setNewModuleTitle('');
    setNewModuleInitialTopic('');
  };

  // Handle Import / Paste Syllabus submission
  const handleImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawSyllabusText.trim() || !onImportOwnSyllabus) return;

    await onImportOwnSyllabus({
      rawText: rawSyllabusText.trim(),
      subject: customSubject.trim() || 'My Course Syllabus',
      university: customUniversity.trim() || 'My University / Course',
    });

    setShowOwnSyllabusModal(false);
    setRawSyllabusText('');
    setCustomSubject('');
    setCustomUniversity('');
  };

  // Handle Manual Custom Syllabus creation
  const handleManualCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualSubject.trim() || !onCreateManualCurriculum) return;

    const newModules: SyllabusModule[] = manualModulesList
      .filter((m) => m.title.trim().length > 0)
      .map((m, idx) => {
        const topics = m.topicsText
          .split('\n')
          .map((t) => t.trim().replace(/^[-*•0-9.)\s]+/, ''))
          .filter((t) => t.length > 0)
          .map((tName, tIdx) => ({
            id: `top-manual-${Date.now()}-${idx}-${tIdx}`,
            name: tName,
            description: `Study and practice of ${tName}`,
            recommendedResources: ['Class Notes & References'],
            completed: false,
          }));

        return {
          id: `mod-manual-${Date.now()}-${idx}`,
          week: idx + 1,
          title: m.title.trim(),
          universityEquivalent: `Unit ${idx + 1}`,
          bloomLevel: idx === 0 ? 'Understand & Apply' : 'Analyze & Evaluate',
          cognitivePacing: 'Personalized Study Pace',
          topics:
            topics.length > 0
              ? topics
              : [
                  {
                    id: `top-manual-${Date.now()}-${idx}-default`,
                    name: m.title.trim(),
                    description: 'Primary topics',
                    recommendedResources: ['Class Notes'],
                    completed: false,
                  },
                ],
          metacognitiveCheckpoint: `Can you state the core definitions of ${m.title} without notes?`,
          practicalAnchor: 'Applying concepts to practical exercises.',
        };
      });

    const newCurriculum: Curriculum = {
      id: `curr-manual-${Date.now()}`,
      subject: manualSubject.trim(),
      universityBenchmark: manualUniversity.trim() || 'My Academic Syllabus',
      psychologicalFramework: 'Self-Directed Cognitive Scaffolding & Active Recall',
      totalEstimatedWeeks: newModules.length || 4,
      overview: `Custom student curriculum for ${manualSubject.trim()}, structured with dedicated cognitive milestones.`,
      createdAt: new Date().toISOString().split('T')[0],
      modules: newModules,
      psychologicalTips: [
        'Review each module with self-testing before proceeding to the next.',
        'Record notes on tricky edge cases directly under each topic.'
      ],
    };

    onCreateManualCurriculum(newCurriculum);
    setShowOwnSyllabusModal(false);
    setManualSubject('');
    setManualUniversity('');
  };

  // Handle AI Architect submission
  const handleArchitectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!architectSubject.trim()) return;
    await onGenerateNew({
      subject: architectSubject.trim(),
      targetGoal: architectGoal.trim(),
      university: architectUniversity,
    });
    setShowArchitectModal(false);
    setArchitectSubject('');
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl bg-stone-900 border border-stone-800 p-5 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <GraduationCap className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-bold text-stone-100">
              Academic Curriculum &amp; Syllabus Record
            </h2>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Keep track of your course syllabi, add custom chapters, or construct AI university curricula
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Active Syllabus Switcher */}
          {curricula.length > 1 && (
            <select
              value={activeCurriculumId}
              onChange={(e) => onSelectCurriculum(e.target.value)}
              aria-label="Select Active Academic Curriculum"
              className="rounded-xl border border-stone-700 bg-stone-800 px-3 py-2 text-xs font-medium text-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {curricula.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.subject} ({c.universityBenchmark.split(' ')[0]})
                </option>
              ))}
            </select>
          )}

          {/* PRIMARY BUTTON: Add My Own Syllabus */}
          <button
            onClick={() => setShowOwnSyllabusModal(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg hover:from-emerald-500 hover:to-teal-500 transition ring-2 ring-emerald-500/30"
          >
            <Upload className="h-4 w-4" />
            <span>+ Add My Own Syllabus</span>
          </button>

          {/* SECONDARY BUTTON: AI Curriculum Architect */}
          <button
            onClick={() => setShowArchitectModal(true)}
            className="flex items-center gap-2 rounded-xl border border-stone-700 bg-stone-800 px-3.5 py-2.5 text-xs font-semibold text-stone-200 hover:bg-stone-700 transition"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>AI University Architect</span>
          </button>
        </div>
      </div>

      {/* Quick Help Guide Callout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl bg-stone-900/60 border border-stone-800/80 p-3.5 text-xs text-stone-300">
        <div className="flex items-center gap-2.5">
          <ClipboardList className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>
            <strong className="text-stone-100">Managing your syllabus:</strong> Use{' '}
            <span className="text-emerald-400 font-semibold">&ldquo;+ Add My Own Syllabus&rdquo;</span> to paste your professor&apos;s outline, or click{' '}
            <span className="text-teal-400 font-semibold">&ldquo;+ Add New Module&rdquo;</span> below to customize this course.
          </span>
        </div>
        <div className="shrink-0 flex items-center gap-2 text-stone-400 text-[11px]">
          <span>{curricula.length} Syllabi on Record</span>
        </div>
      </div>

      {currentCurriculum ? (
        <div className="space-y-6">
          {/* Active Syllabus Header Banner */}
          <div className="rounded-2xl border border-stone-800 bg-stone-900/90 p-5 shadow-md">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-stone-800">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-bold text-stone-100">
                    {currentCurriculum.subject}
                  </h3>
                  <span className="rounded-md bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400 border border-emerald-500/20">
                    {currentCurriculum.universityBenchmark}
                  </span>
                  <span className="rounded-md bg-stone-800 px-2.5 py-0.5 text-xs text-stone-400 border border-stone-700">
                    {currentCurriculum.totalEstimatedWeeks} Weeks Total
                  </span>
                </div>
                <p className="text-xs text-stone-400 mt-1.5 leading-relaxed">
                  {currentCurriculum.overview}
                </p>
              </div>

              {/* Progress Metric & Actions */}
              <div className="flex items-center gap-4 shrink-0 bg-stone-950/60 rounded-xl p-3 border border-stone-800">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-stone-400 gap-4">
                    <span>Syllabus Mastery</span>
                    <span className="font-semibold text-emerald-400">{progressPercent}%</span>
                  </div>
                  <div className="h-2 w-32 rounded-full bg-stone-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-stone-500">
                    {completedTopics} of {totalTopics} topics mastered
                  </p>
                </div>

                {curricula.length > 1 && (
                  <button
                    onClick={() => onDeleteCurriculum(currentCurriculum.id)}
                    className="p-1.5 text-stone-500 hover:text-red-400 hover:bg-stone-800 rounded-lg transition"
                    title="Delete this curriculum"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Psychological Framework & Tips */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="flex items-start gap-2.5 rounded-xl bg-stone-950/40 p-3 border border-stone-800/80">
                <Brain className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                    Cognitive Framework
                  </span>
                  <p className="text-xs text-stone-300 mt-0.5">
                    {currentCurriculum.psychologicalFramework}
                  </p>
                </div>
              </div>

              {currentCurriculum.psychologicalTips && currentCurriculum.psychologicalTips.length > 0 && (
                <div className="flex items-start gap-2.5 rounded-xl bg-stone-950/40 p-3 border border-stone-800/80">
                  <Zap className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
                      Tailored Study Psychology
                    </span>
                    <p className="text-xs text-stone-300 mt-0.5">
                      {currentCurriculum.psychologicalTips[0]}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Module Timeline Cards */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 flex items-center gap-2">
                <Layers className="h-4 w-4 text-emerald-400" />
                <span>Modules &amp; Cognitive Milestones ({currentCurriculum.modules.length})</span>
              </h4>

              {/* Add New Module Button */}
              <button
                onClick={() => setShowAddModuleModal(true)}
                className="flex items-center gap-1.5 rounded-lg border border-teal-500/30 bg-teal-950/30 px-3 py-1.5 text-xs font-medium text-teal-300 hover:bg-teal-900/40 transition"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>+ Add New Module to this Course</span>
              </button>
            </div>

            {currentCurriculum.modules.map((mod, index) => {
              const isExpanded = expandedModules[mod.id] !== false;
              const modCompleted = mod.topics.length > 0 && mod.topics.every((t) => t.completed);

              return (
                <div
                  key={mod.id}
                  className={`rounded-2xl border transition-all ${
                    modCompleted
                      ? 'border-emerald-500/30 bg-stone-900/60'
                      : 'border-stone-800 bg-stone-900/90'
                  } shadow-md overflow-hidden`}
                >
                  {/* Module Header */}
                  <div
                    onClick={() => toggleModule(mod.id)}
                    className="flex flex-wrap items-center justify-between gap-3 p-4 cursor-pointer hover:bg-stone-800/40 transition select-none"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-stone-800 text-stone-300 text-xs font-bold border border-stone-700">
                        W{mod.week || index + 1}
                      </span>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-sm font-semibold text-stone-100">
                            {mod.title}
                          </h4>
                          <span className="rounded bg-stone-800 px-2 py-0.5 text-[11px] text-stone-400 border border-stone-700">
                            {mod.universityEquivalent}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-stone-400 mt-0.5">
                          <span className="text-teal-400">Bloom's: {mod.bloomLevel}</span>
                          <span>•</span>
                          <span className="text-amber-400/90">{mod.cognitivePacing}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onStartTestForTopic(mod.title);
                        }}
                        className="flex items-center gap-1.5 rounded-lg border border-stone-700 bg-stone-800 px-2.5 py-1 text-xs font-medium text-stone-300 hover:bg-stone-700 hover:text-white transition"
                        title="Generate a diagnostic test for this module"
                      >
                        <Target className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Test Module</span>
                      </button>

                      <span className="text-stone-400 text-xs">
                        {mod.topics.filter((t) => t.completed).length}/{mod.topics.length}
                      </span>

                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-stone-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-stone-400" />
                      )}
                    </div>
                  </div>

                  {/* Module Content */}
                  {isExpanded && (
                    <div className="p-4 pt-0 space-y-4 border-t border-stone-800/70">
                      {/* Topics List */}
                      <div className="space-y-2 mt-3">
                        {mod.topics.map((topic) => {
                          const isEditingNotes = editingNotesTopicId === topic.id;

                          return (
                            <div
                              key={topic.id}
                              className={`rounded-xl border p-3.5 transition ${
                                topic.completed
                                  ? 'border-emerald-500/20 bg-emerald-950/10'
                                  : 'border-stone-800 bg-stone-950/40'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-3">
                                  <button
                                    onClick={() => toggleTopicCompletion(mod.id, topic.id)}
                                    className="mt-0.5 text-stone-400 hover:text-emerald-400 transition"
                                  >
                                    {topic.completed ? (
                                      <CheckCircle className="h-5 w-5 text-emerald-400 fill-emerald-500/20" />
                                    ) : (
                                      <Circle className="h-5 w-5 text-stone-600 hover:text-stone-400" />
                                    )}
                                  </button>

                                  <div>
                                    <h5
                                      className={`text-xs font-semibold ${
                                        topic.completed
                                          ? 'text-stone-300 line-through decoration-stone-600'
                                          : 'text-stone-100'
                                      }`}
                                    >
                                      {topic.name}
                                    </h5>
                                    <p className="text-xs text-stone-400 mt-0.5 leading-relaxed">
                                      {topic.description}
                                    </p>

                                    {/* Topic Resources */}
                                    {topic.recommendedResources && topic.recommendedResources.length > 0 && (
                                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                        <span className="text-[10px] text-stone-500">Resources:</span>
                                        {topic.recommendedResources.map((res, rIdx) => (
                                          <span
                                            key={rIdx}
                                            className="rounded bg-stone-800/80 px-2 py-0.5 text-[10px] text-stone-300 border border-stone-700/60"
                                          >
                                            {res}
                                          </span>
                                        ))}
                                      </div>
                                    )}

                                    {/* Topic Notes */}
                                    {topic.notes && !isEditingNotes && (
                                      <div className="mt-2.5 rounded-lg bg-stone-900/80 p-2.5 border border-stone-800 text-xs text-amber-200/90">
                                        <span className="font-semibold text-stone-400 text-[10px] uppercase block mb-0.5">
                                          Metacognitive Notes
                                        </span>
                                        {topic.notes}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-1 shrink-0">
                                  <button
                                    onClick={() => {
                                      if (isEditingNotes) {
                                        setEditingNotesTopicId(null);
                                      } else {
                                        setEditingNotesTopicId(topic.id);
                                        setTempNotes(topic.notes || '');
                                      }
                                    }}
                                    className="p-1 text-stone-500 hover:text-stone-300 rounded transition"
                                    title="Add or edit personal study notes"
                                  >
                                    <FileText className="h-3.5 w-3.5" />
                                  </button>

                                  <button
                                    onClick={() => onStartTestForTopic(topic.name)}
                                    className="p-1 text-stone-500 hover:text-emerald-400 rounded transition"
                                    title="Test logic on this topic"
                                  >
                                    <Target className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>

                              {/* Inline Notes Editor */}
                              {isEditingNotes && (
                                <div className="mt-3 pt-3 border-t border-stone-800 space-y-2">
                                  <textarea
                                    value={tempNotes}
                                    onChange={(e) => setTempNotes(e.target.value)}
                                    placeholder="Write your mental models, insights, or tricky exam edge cases..."
                                    rows={2}
                                    className="w-full rounded-lg bg-stone-900 border border-stone-700 p-2 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                  />
                                  <div className="flex justify-end gap-2">
                                    <button
                                      onClick={() => setEditingNotesTopicId(null)}
                                      className="rounded px-2.5 py-1 text-xs text-stone-400 hover:text-white"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      onClick={() => saveTopicNotes(mod.id, topic.id)}
                                      className="flex items-center gap-1 rounded bg-emerald-600 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-500"
                                    >
                                      <Check className="h-3 w-3" />
                                      <span>Save Note</span>
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Add Custom Topic Inline */}
                      {addingTopicModuleId === mod.id ? (
                        <div className="rounded-xl bg-stone-950 p-3.5 border border-stone-700 space-y-2.5">
                          <h6 className="text-xs font-semibold text-stone-300">
                            Add Custom Syllabus Objective to Week {mod.week}
                          </h6>
                          <input
                            type="text"
                            value={newTopicName}
                            onChange={(e) => setNewTopicName(e.target.value)}
                            placeholder="Topic title (e.g. Master Theorem Case 3 Edge Cases)"
                            className="w-full rounded-lg bg-stone-900 border border-stone-700 px-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                          <input
                            type="text"
                            value={newTopicDesc}
                            onChange={(e) => setNewTopicDesc(e.target.value)}
                            placeholder="Brief description or learning objective"
                            className="w-full rounded-lg bg-stone-900 border border-stone-700 px-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setAddingTopicModuleId(null)}
                              className="rounded px-2.5 py-1 text-xs text-stone-400 hover:text-white"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleAddTopic(mod.id)}
                              className="rounded bg-emerald-600 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-500"
                            >
                              Add Topic
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setAddingTopicModuleId(mod.id)}
                          className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-emerald-400 transition pt-1"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>+ Add custom topic to this module</span>
                        </button>
                      )}

                      {/* Module Metacognitive & Practical Footers */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                        <div className="rounded-xl bg-stone-950/60 p-3 border border-stone-800">
                          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                            Metacognitive Self-Check
                          </span>
                          <p className="text-xs text-stone-300 italic">
                            &ldquo;{mod.metacognitiveCheckpoint}&rdquo;
                          </p>
                        </div>

                        <div className="rounded-xl bg-stone-950/60 p-3 border border-stone-800">
                          <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider block mb-1">
                            Physical World Anchor
                          </span>
                          <p className="text-xs text-stone-300">
                            {mod.practicalAnchor}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Bottom Add Module Callout */}
            <div className="rounded-2xl border border-dashed border-stone-800 p-4 text-center">
              <button
                onClick={() => setShowAddModuleModal(true)}
                className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition"
              >
                <Plus className="h-4 w-4" />
                <span>+ Add Another Module / Week to {currentCurriculum.subject}</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-stone-800 bg-stone-900/50 p-12 text-center">
          <BookOpen className="h-10 w-10 text-stone-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-stone-200">No Syllabus on Record</h3>
          <p className="text-xs text-stone-400 mt-1 max-w-md mx-auto">
            Click &ldquo;+ Add My Own Syllabus&rdquo; to paste your course outline, or use the AI Curriculum Architect.
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => setShowOwnSyllabusModal(true)}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 transition"
            >
              + Add My Own Syllabus
            </button>
            <button
              onClick={() => setShowArchitectModal(true)}
              className="rounded-xl border border-stone-700 bg-stone-800 px-4 py-2 text-xs font-semibold text-stone-200 hover:bg-stone-700 transition"
            >
              AI Architect
            </button>
          </div>
        </div>
      )}

      {/* 1. MODAL: ADD MY OWN SYLLABUS (Paste or Manual) */}
      {showOwnSyllabusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xl rounded-2xl border border-stone-700 bg-stone-900 p-6 text-stone-100 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-emerald-400" />
                <h3 className="text-base font-bold text-stone-100">
                  Add Your Own Course Syllabus
                </h3>
              </div>
              <button
                onClick={() => setShowOwnSyllabusModal(false)}
                className="text-stone-400 hover:text-stone-200 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            {/* Mode Selector: Paste Text vs Manual */}
            <div className="flex rounded-xl bg-stone-950 p-1 border border-stone-800 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setOwnSyllabusTab('paste')}
                className={`flex-1 py-1.5 rounded-lg transition ${
                  ownSyllabusTab === 'paste'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                📋 Paste Syllabus / Chapters Text
              </button>
              <button
                type="button"
                onClick={() => setOwnSyllabusTab('manual')}
                className={`flex-1 py-1.5 rounded-lg transition ${
                  ownSyllabusTab === 'manual'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                ✍️ Build Modules Manually
              </button>
            </div>

            {ownSyllabusTab === 'paste' ? (
              /* TAB 1: PASTE SYLLABUS TEXT */
              <form onSubmit={handleImportSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-stone-300 block mb-1">
                      Subject / Course Name:
                    </label>
                    <input
                      type="text"
                      required
                      value={customSubject}
                      onChange={(e) => setCustomSubject(e.target.value)}
                      placeholder="e.g. Microeconomics 101, Organic Chemistry..."
                      className="w-full rounded-xl bg-stone-950 border border-stone-700 px-3 py-2 text-xs text-stone-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-stone-300 block mb-1">
                      University / School / Teacher:
                    </label>
                    <input
                      type="text"
                      value={customUniversity}
                      onChange={(e) => setCustomUniversity(e.target.value)}
                      placeholder="e.g. State University, AP Course, Dr. Smith"
                      className="w-full rounded-xl bg-stone-950 border border-stone-700 px-3 py-2 text-xs text-stone-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-stone-300">
                      Paste Syllabus Text, Chapters, or Course Outline:
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setCustomSubject('Microeconomics Principles');
                        setCustomUniversity('College Economics Course');
                        setRawSyllabusText(SAMPLE_PASTE_SYLLABUS);
                      }}
                      className="text-[11px] text-emerald-400 hover:underline"
                    >
                      Insert Example Syllabus
                    </button>
                  </div>
                  <textarea
                    required
                    rows={8}
                    value={rawSyllabusText}
                    onChange={(e) => setRawSyllabusText(e.target.value)}
                    placeholder="Paste your course syllabus here:
Module 1: Foundations of Mechanics
- Newton's Laws & Inertial Frames
- Conservation of Momentum
Module 2: Energy & Work
- Kinetic vs Potential Energy..."
                    className="w-full rounded-xl bg-stone-950 border border-stone-700 p-3 text-xs text-stone-100 placeholder-stone-500 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <p className="text-[11px] text-stone-400 mt-1">
                    The engine automatically extracts modules, topics, and structures them with cognitive checkpoints!
                  </p>
                </div>

                <div className="flex justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowOwnSyllabusModal(false)}
                    className="rounded-xl px-4 py-2 text-xs font-medium text-stone-400 hover:text-stone-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isGenerating || !rawSyllabusText.trim() || !customSubject.trim()}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2 text-xs font-semibold text-white shadow-lg hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 transition"
                  >
                    <Sparkles className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                    <span>{isGenerating ? 'Parsing Your Syllabus...' : 'Parse & Save My Syllabus'}</span>
                  </button>
                </div>
              </form>
            ) : (
              /* TAB 2: MANUAL BUILDER */
              <form onSubmit={handleManualCreateSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-stone-300 block mb-1">
                      Subject / Course Name:
                    </label>
                    <input
                      type="text"
                      required
                      value={manualSubject}
                      onChange={(e) => setManualSubject(e.target.value)}
                      placeholder="e.g. Physics 102 - Electromagnetism"
                      className="w-full rounded-xl bg-stone-950 border border-stone-700 px-3 py-2 text-xs text-stone-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-stone-300 block mb-1">
                      Course Source / Institution:
                    </label>
                    <input
                      type="text"
                      value={manualUniversity}
                      onChange={(e) => setManualUniversity(e.target.value)}
                      placeholder="e.g. My College Syllabus"
                      className="w-full rounded-xl bg-stone-950 border border-stone-700 px-3 py-2 text-xs text-stone-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Modules list */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-stone-300">
                      Modules &amp; Topics:
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setManualModulesList((prev) => [
                          ...prev,
                          {
                            title: `Unit ${prev.length + 1}`,
                            topicsText: 'Topic A\nTopic B',
                          },
                        ])
                      }
                      className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Add Another Unit</span>
                    </button>
                  </div>

                  {manualModulesList.map((m, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl bg-stone-950/60 p-3.5 border border-stone-800 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-stone-400">
                          Unit {idx + 1} Title
                        </span>
                        {manualModulesList.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              setManualModulesList((prev) =>
                                prev.filter((_, i) => i !== idx)
                              )
                            }
                            className="text-stone-500 hover:text-red-400 text-xs"
                          >
                            Remove Unit
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        required
                        value={m.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          setManualModulesList((prev) =>
                            prev.map((item, i) => (i === idx ? { ...item, title: val } : item))
                          );
                        }}
                        placeholder="e.g. Electric Charges & Coulomb's Law"
                        className="w-full rounded-lg bg-stone-900 border border-stone-700 px-3 py-1.5 text-xs text-stone-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                      <div>
                        <span className="text-[10px] text-stone-400 block mb-1">
                          Topics in this Unit (one per line):
                        </span>
                        <textarea
                          rows={2}
                          value={m.topicsText}
                          onChange={(e) => {
                            const val = e.target.value;
                            setManualModulesList((prev) =>
                              prev.map((item, i) =>
                                i === idx ? { ...item, topicsText: val } : item
                              )
                            );
                          }}
                          placeholder="Point charges\nElectric dipole"
                          className="w-full rounded-lg bg-stone-900 border border-stone-700 p-2 text-xs text-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowOwnSyllabusModal(false)}
                    className="rounded-xl px-4 py-2 text-xs font-medium text-stone-400 hover:text-stone-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!manualSubject.trim()}
                    className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-semibold text-white shadow-lg hover:bg-emerald-500 transition"
                  >
                    <Check className="h-4 w-4" />
                    <span>Create Custom Syllabus Record</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 2. MODAL: ADD MODULE TO CURRENT SYLLABUS */}
      {showAddModuleModal && currentCurriculum && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-stone-700 bg-stone-900 p-6 text-stone-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <ListPlus className="h-5 w-5 text-teal-400" />
                <h3 className="text-base font-bold text-stone-100">
                  Add Module to &ldquo;{currentCurriculum.subject}&rdquo;
                </h3>
              </div>
              <button
                onClick={() => setShowAddModuleModal(false)}
                className="text-stone-400 hover:text-stone-200 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddNewModule} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  Module / Week Title:
                </label>
                <input
                  type="text"
                  required
                  value={newModuleTitle}
                  onChange={(e) => setNewModuleTitle(e.target.value)}
                  placeholder="e.g. Graph Algorithms & Shortest Path"
                  className="w-full rounded-xl bg-stone-950 border border-stone-700 px-3.5 py-2 text-xs text-stone-100 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1">
                  Initial Topic / Concept Name:
                </label>
                <input
                  type="text"
                  value={newModuleInitialTopic}
                  onChange={(e) => setNewModuleInitialTopic(e.target.value)}
                  placeholder="e.g. Dijkstra's Algorithm & Priority Queues"
                  className="w-full rounded-xl bg-stone-950 border border-stone-700 px-3.5 py-2 text-xs text-stone-100 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs font-semibold text-stone-300 block mb-1">
                    Bloom's Level:
                  </label>
                  <select
                    value={newModuleBloom}
                    onChange={(e) => setNewModuleBloom(e.target.value)}
                    className="w-full rounded-xl bg-stone-950 border border-stone-700 px-3 py-2 text-xs text-stone-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  >
                    <option value="Understand & Apply">Understand &amp; Apply</option>
                    <option value="Analyze & Evaluate">Analyze &amp; Evaluate</option>
                    <option value="Synthesize & Create">Synthesize &amp; Create</option>
                    <option value="Foundational Recall">Foundational Recall</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-300 block mb-1">
                    Cognitive Pacing:
                  </label>
                  <select
                    value={newModulePacing}
                    onChange={(e) => setNewModulePacing(e.target.value)}
                    className="w-full rounded-xl bg-stone-950 border border-stone-700 px-3 py-2 text-xs text-stone-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  >
                    <option value="Gentle Onboarding">Gentle Onboarding</option>
                    <option value="Deep Conceptual Flow">Deep Conceptual Flow</option>
                    <option value="High Challenge Zone">High Challenge Zone</option>
                    <option value="Steady Deep Work">Steady Deep Work</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModuleModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-medium text-stone-400 hover:text-stone-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newModuleTitle.trim()}
                  className="flex items-center gap-1.5 rounded-xl bg-teal-600 px-5 py-2 text-xs font-semibold text-white hover:bg-teal-500 transition shadow"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Module</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. MODAL: AI UNIVERSITY CURRICULUM ARCHITECT */}
      {showArchitectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl border border-stone-700 bg-stone-900 p-6 text-stone-100 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-400" />
                <h3 className="text-base font-bold text-stone-100">
                  AI University Benchmark Architect
                </h3>
              </div>
              <button
                onClick={() => setShowArchitectModal(false)}
                className="text-stone-400 hover:text-stone-200 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed">
              Synthesize a curriculum benchmarked against world-leading universities, calibrated to your cognitive archetype (
              <span className="text-amber-400 font-semibold">{studentProfile.archetype}</span>).
            </p>

            <form onSubmit={handleArchitectSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1.5">
                  Choose or Type Subject:
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {PRESET_SUBJECTS.slice(0, 4).map((sub) => (
                    <button
                      type="button"
                      key={sub}
                      onClick={() => setArchitectSubject(sub)}
                      className={`rounded-lg px-2.5 py-1 text-[11px] transition ${
                        architectSubject === sub
                          ? 'bg-amber-600 text-white'
                          : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                      }`}
                    >
                      {sub.split('&')[0]}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  required
                  value={architectSubject}
                  onChange={(e) => setArchitectSubject(e.target.value)}
                  placeholder="e.g. Real Analysis, Quantum Mechanics, Machine Learning..."
                  className="w-full rounded-xl bg-stone-950 border border-stone-700 px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1.5">
                  Benchmark University Standard:
                </label>
                <select
                  value={architectUniversity}
                  onChange={(e) => setArchitectUniversity(e.target.value)}
                  className="w-full rounded-xl bg-stone-950 border border-stone-700 px-3.5 py-2.5 text-xs text-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  {UNIVERSITY_OPTIONS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-300 block mb-1.5">
                  Target Academic Goal / Depth:
                </label>
                <input
                  type="text"
                  value={architectGoal}
                  onChange={(e) => setArchitectGoal(e.target.value)}
                  placeholder="e.g. Master for university midterms in 6 weeks"
                  className="w-full rounded-xl bg-stone-950 border border-stone-700 px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowArchitectModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-medium text-stone-400 hover:text-stone-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGenerating || !architectSubject.trim()}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 px-5 py-2 text-xs font-semibold text-white shadow-lg hover:from-amber-500 hover:to-orange-500 disabled:opacity-50 transition"
                >
                  <Sparkles className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                  <span>{isGenerating ? 'Structuring Curriculum...' : 'Generate Curriculum'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
