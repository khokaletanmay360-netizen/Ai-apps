import React from 'react';
import {
  Brain,
  BookOpen,
  HelpCircle,
  Target,
  UserCheck,
  Sparkles,
  Layers
} from 'lucide-react';
import { StudentProfile } from '../types';

export type NavTab = 'curriculum' | 'doubts' | 'test-mistakes' | 'personality';

interface Props {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  profile: StudentProfile;
  syllabusCount: number;
}

export const Navbar: React.FC<Props> = ({
  activeTab,
  onSelectTab,
  profile,
  syllabusCount,
}) => {
  const tabs = [
    {
      id: 'curriculum' as NavTab,
      label: 'Syllabus & Curriculum',
      icon: BookOpen,
      badge: `${syllabusCount} Active`,
    },
    {
      id: 'doubts' as NavTab,
      label: 'Doubts & PAC Metacognition',
      icon: HelpCircle,
      badge: 'PAC Theory',
    },
    {
      id: 'test-mistakes' as NavTab,
      label: 'Test & Logic Flaw Rectifier',
      icon: Target,
      badge: 'Debug Logic',
    },
    {
      id: 'personality' as NavTab,
      label: 'Cognitive Profiler',
      icon: UserCheck,
      badge: profile.archetype.split(' ')[0],
    },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-stone-800 bg-stone-950/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand */}
        <div
          onClick={() => onSelectTab('curriculum')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-indigo-600 text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition">
            <Brain className="h-5 w-5" />
          </span>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black tracking-tight text-stone-100">
                NOESIS
              </span>
              <span className="rounded bg-emerald-500/10 px-1.5 py-0.2 text-[9px] font-bold text-emerald-400 border border-emerald-500/20">
                AI COGNITIVE STUDIO
              </span>
            </div>
            <p className="text-[10px] text-stone-400 leading-none">
              University Syllabi &bull; PAC Ego States &bull; Metacognitive Logic Rectification
            </p>
          </div>
        </div>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-1.5 bg-stone-900/80 p-1 rounded-xl border border-stone-800">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  isActive
                    ? 'bg-stone-800 text-white shadow-sm border border-stone-700/80'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/40'
                }`}
              >
                <Icon
                  className={`h-3.5 w-3.5 ${
                    isActive ? 'text-emerald-400' : 'text-stone-500'
                  }`}
                />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`rounded px-1.5 py-0.2 text-[9px] font-medium ${
                      isActive
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-stone-800 text-stone-500'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Status Badge */}
        <div className="flex items-center gap-2.5">
          <div
            onClick={() => onSelectTab('personality')}
            className="flex items-center gap-2 rounded-xl bg-stone-900 px-3 py-1.5 border border-stone-800 cursor-pointer hover:border-purple-500/40 transition"
            title="Active Student Profile"
          >
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <div className="text-right">
              <span className="text-[10px] text-stone-400 block leading-tight">
                Profile
              </span>
              <span className="text-[11px] font-bold text-stone-200 block leading-tight truncate max-w-[110px] sm:max-w-none">
                {profile.archetype}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="flex md:hidden overflow-x-auto border-t border-stone-800/80 bg-stone-950 px-2 py-1.5 gap-1 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-1.5 shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                isActive
                  ? 'bg-stone-800 text-white border border-stone-700'
                  : 'text-stone-400 hover:bg-stone-900'
              }`}
            >
              <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-emerald-400' : ''}`} />
              <span>{tab.label.split('&')[0]}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
