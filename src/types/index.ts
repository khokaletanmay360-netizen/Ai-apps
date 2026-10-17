export interface WorldQuote {
  quote: string;
  author: string;
  era: string;
  context: string;
  psychologicalAngle: string;
  metacognitiveAction: string;
  synthesisMaterialInner: string;
}

export interface SyllabusTopic {
  id: string;
  name: string;
  description: string;
  recommendedResources: string[];
  completed: boolean;
  notes?: string;
}

export interface SyllabusModule {
  id: string;
  week: number;
  title: string;
  universityEquivalent: string;
  bloomLevel: string;
  cognitivePacing: string;
  topics: SyllabusTopic[];
  metacognitiveCheckpoint: string;
  practicalAnchor: string;
}

export interface Curriculum {
  id: string;
  subject: string;
  universityBenchmark: string;
  psychologicalFramework: string;
  totalEstimatedWeeks: number;
  overview: string;
  modules: SyllabusModule[];
  psychologicalTips: string[];
  createdAt: string;
}

export interface PACBreakdown {
  parent: string;
  adult: string;
  child: string;
}

export interface PACScoreDistribution {
  parentPercent: number;
  adultPercent: number;
  childPercent: number;
}

export interface ThinkingPattern {
  pattern: string;
  evidence: string;
  reframing: string;
}

export interface MetacognitiveProtocol {
  step1Observation: string;
  step2Deconstruction: string;
  step3AdultAction: string;
}

export interface DoubtInquiry {
  id: string;
  timestamp: string;
  question: string;
  context?: string;
  doubtSummary: string;
  pacAnalysis: {
    dominantEgoState: string;
    egoStateBreakdown: PACBreakdown;
    scoreDistribution: PACScoreDistribution;
  };
  philosophicalSynthesis: string;
  extractedThinkingPatterns: ThinkingPattern[];
  conceptualExplanation: string;
  metacognitiveProtocol: MetacognitiveProtocol;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  conceptTested: string;
  commonFlawTrap: string;
  explanation: string;
}

export interface ArgumentStep {
  step: number;
  type: string;
  text: string;
}

export interface MistakeAnalysis {
  question: string;
  chosenAnswer: string;
  correctAnswer: string;
  studentReasoning: string;
  identifiedFlaw: {
    name: string;
    description: string;
    intuitiveTrap: string;
  };
  argumentReconstruction: ArgumentStep[];
  clearExplanation: string;
  anchoringMentalModel: {
    name: string;
    rule: string;
    applicationGuide: string;
  };
  microVerificationQuestion: {
    question: string;
    hint: string;
  };
}

export interface CognitiveDimensions {
  epistemicCuriosity: string;
  processingStyle: string;
  stressResponse: string;
  optimalStudyCadence: string;
}

export interface StudentProfile {
  archetype: string;
  tagline: string;
  egoStateBalance: {
    parent: number;
    adult: number;
    child: number;
    analysis: string;
  };
  cognitiveDimensions: CognitiveDimensions;
  strengths: string[];
  blindSpots: string[];
  tailoredCurriculumStrategy: {
    pacing: string;
    checkpointFrequency: string;
    universityAlignment: string;
  };
}
