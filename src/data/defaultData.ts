import { Curriculum, DoubtInquiry, StudentProfile, WorldQuote } from '../types';

export const DEFAULT_QUOTE: WorldQuote = {
  quote: "The mind is not a vessel to be filled, but a fire to be kindled; yet that fire burns only when fed with the authentic kindling of real-world phenomena.",
  author: "Plutarch & Modern Metacognitive Synthesis",
  era: "Classical Philosophy to Modern Cognitive Epistemology",
  context: "In an era saturated by automated algorithmic outputs and constant information tides, authentic mastery requires active inquiry rather than passive reception.",
  psychologicalAngle: "When the Adult ego state conducts reality-testing on concepts instead of yielding to Critical Parent self-judgment, study ceases to feel punitive and becomes an intrinsically rewarding cognitive flow.",
  metacognitiveAction: "Before opening your notes, pause for 60 seconds: Ask yourself, 'What specific mechanism in reality am I seeking to decode right now?'",
  synthesisMaterialInner: "The material world (exams, code, physical equations, laboratory data) is not an adversary to your inner peace. It is the tangible mirror through which internal mental clarity tests and purifies itself."
};

export const DEFAULT_PROFILE: StudentProfile = {
  archetype: "First-Principles Architect",
  tagline: "Constructs unshakeable understanding by decomposing complex theories down to fundamental bedrock realities.",
  egoStateBalance: {
    parent: 20,
    adult: 60,
    child: 20,
    analysis: "Strong, calm Adult reality-testing foundation with vibrant natural curiosity. Vulnerable to Critical Parent perfectionism when faced with ambiguous exam boundaries."
  },
  cognitiveDimensions: {
    epistemicCuriosity: "High Deep Dive",
    processingStyle: "First-Principles Deductive",
    stressResponse: "Calm Diagnostic Inquiry",
    optimalStudyCadence: "50-minute focused conceptual sprints + 10-minute metacognitive synthesis"
  },
  strengths: [
    "Rejects mindless rote memorization in favor of causal mechanisms.",
    "Quickly identifies contradictory assumptions in problem formulations.",
    "Natural aptitude for deductive proofs and systematic knowledge hierarchies."
  ],
  blindSpots: [
    "Hesitation to engage in trial-and-error due to wanting full theoretical certainty first.",
    "Internal pressure to understand everything at once rather than embracing incremental cognitive scaffolding."
  ],
  tailoredCurriculumStrategy: {
    pacing: "Moderate velocity with high depth per module, preventing cognitive fragmentation.",
    checkpointFrequency: "Weekly diagnostic tests with post-mortem logic flaw reconstruction.",
    universityAlignment: "MIT & Oxford style: Rigorous mathematical foundations coupled with active conceptual questioning."
  }
};

export const INITIAL_CURRICULA: Curriculum[] = [
  {
    id: "curr-1",
    subject: "Algorithmic Reasoning & Data Structures",
    universityBenchmark: "MIT 6.006 & Stanford CS106B Aligned",
    psychologicalFramework: "Zone of Proximal Development (ZPD) & Cognitive Load Pacing",
    totalEstimatedWeeks: 6,
    createdAt: "2026-10-17",
    overview: "A university-grade curriculum engineered to cultivate deep mental models of computation, balancing theoretical complexity with tangible code experiments to sustain Flow State.",
    modules: [
      {
        id: "mod-1",
        week: 1,
        title: "Foundations & Asymptotic Intuition",
        universityEquivalent: "MIT 6.006 Lec 1-2: Algorithmic Growth",
        bloomLevel: "Understand & Analyze",
        cognitivePacing: "Gentle Onboarding, High Conceptual Flow",
        topics: [
          {
            id: "top-1-1",
            name: "Asymptotic Analysis & Big-O Notation",
            description: "Evaluating execution scaling as physical constraints of memory and compute.",
            recommendedResources: ["MIT OCW Lecture 1", "Interactive Asymptotic Visualizer"],
            completed: true,
            notes: "Understood: Big-O is an upper bound on growth rate, not absolute wall-clock seconds."
          },
          {
            id: "top-1-2",
            name: "Divide-and-Conquer & Master Theorem",
            description: "Recursive decomposition of problem states into non-overlapping sub-problems.",
            recommendedResources: ["CLRS Chapter 4", "Stanford CS161 Notes"],
            completed: false
          }
        ],
        metacognitiveCheckpoint: "Can you explain Big-O without using algebraic notation, as a physical conservation of operational energy?",
        practicalAnchor: "Benchmarking execution time of 10^4 vs 10^7 elements in a simple search loop."
      },
      {
        id: "mod-2",
        week: 2,
        title: "Linear Structures & State Invariants",
        universityEquivalent: "Stanford CS106B Week 2: Memory Contiguity",
        bloomLevel: "Apply & Evaluate",
        cognitivePacing: "Steady Deep Work",
        topics: [
          {
            id: "top-2-1",
            name: "Dynamic Array Doubling Strategy & Amortized Cost",
            description: "Why geometric expansion achieves O(1) amortized insertion despite occasional O(N) reallocation.",
            recommendedResources: ["MIT 6.006 Lec 2", "Python List Implementation Deep Dive"],
            completed: false
          },
          {
            id: "top-2-2",
            name: "Node Invariants in Stacks and Double-Ended Queues",
            description: "Maintaining pointer coherence under concurrent push/pop operations.",
            recommendedResources: ["Sedgewick Algorithms Pt 1"],
            completed: false
          }
        ],
        metacognitiveCheckpoint: "When writing a loop invariant, do you verify edge states (empty, single-item) automatically?",
        practicalAnchor: "Building an undo/redo stack engine for a text buffer."
      },
      {
        id: "mod-3",
        week: 3,
        title: "Hierarchical Trees & Balanced Search Invariants",
        universityEquivalent: "Berkeley CS61B: Balanced Search Trees",
        bloomLevel: "Analyze & Synthesize",
        cognitivePacing: "High Flow Challenge Zone",
        topics: [
          {
            id: "top-3-1",
            name: "Binary Search Trees & Pathological Degeneracy",
            description: "How ordered inputs degrade BST from O(log N) to O(N) linked list.",
            recommendedResources: ["Berkeley CS61B Tree Visualizer"],
            completed: false
          },
          {
            id: "top-3-2",
            name: "AVL & Red-Black Rotations (Self-Balancing Logic)",
            description: "Restoring logarithmic depth through local pointer rotations.",
            recommendedResources: ["Visualgo.net AVL Module"],
            completed: false
          }
        ],
        metacognitiveCheckpoint: "Do you see tree balance as a static state or as a dynamic thermodynamic equilibrium?",
        practicalAnchor: "Implementing an in-memory index for fast auto-complete search."
      }
    ],
    psychologicalTips: [
      "When encountering a tricky algorithm, draw the data structure with pen and paper first to activate spatial-tactile cognition.",
      "Separate the problem into two distinct phases: First trace without code to keep the Adult ego state active, then write implementation."
    ]
  }
];

export const INITIAL_DOUBTS: DoubtInquiry[] = [
  {
    id: "doubt-1",
    timestamp: "2026-10-17 08:30",
    question: "Why do I understand mathematical concepts during lecture, but freeze when facing novel exam questions? Am I just faking my comprehension?",
    context: "Studying for college midterms, feeling persistent self-doubt and imposter tension.",
    doubtSummary: "Discrepancy between passive lecture recognition and active exam problem-solving under evaluation stress.",
    pacAnalysis: {
      dominantEgoState: "Critical Parent attacking Adapted Child",
      egoStateBreakdown: {
        parent: "Internalized critical judge insisting: 'If you really knew this, it would come effortlessly without friction.'",
        adult: "Observes the real cognitive difference between 'recognition memory' (lecture) and 'generative retrieval' (unassisted exam).",
        child: "Fearful of failure and feeling exposed to external judgment."
      },
      scoreDistribution: {
        parentPercent: 45,
        adultPercent: 25,
        childPercent: 30
      }
    },
    philosophicalSynthesis: "Your subjective fear and the objective exam problem are not in irreconcilable opposition. The exam is not an indictment of your soul or internal worth; it is simply a physical instrument measuring retrieval pathway automaticity. When you decouple external measurement from existential worth, your Adult state can calmly debug the problem.",
    extractedThinkingPatterns: [
      {
        pattern: "Illusion of Explanatory Depth",
        evidence: "Mistaking fluent understanding of a professor's lecture for personally consolidated neural schemata.",
        reframing: "Passive listening uses perceptual pathways; solving novel problems requires activating generative motor and retrieval pathways."
      },
      {
        pattern: "Imposter Attribution",
        evidence: "'Am I just faking my comprehension?'",
        reframing: "The friction you feel is standard cognitive load, not evidence of intellectual fraudulence."
      }
    ],
    conceptualExplanation: "Cognitive science defines this as the 'Generation Effect' (Slamecka & Graf). When listening to a professor, your working memory piggybacks on their structured logic. On an exam, the cue structure is absent. The remedy is not more reading, but 'Free Recall & Blind Formulation' — closing all materials and deriving the concept from scratch on a blank sheet.",
    metacognitiveProtocol: {
      step1Observation: "Notice the physiological surge (tight chest, shallow breath) when you hit an unfamiliar exam phrasing.",
      step2Deconstruction: "Name the inner critic: 'That is my Critical Parent speaking. My Adult mind will now read the problem statement as raw data.'",
      step3AdultAction: "Extract the 3 given variables, write down the target variable, and formulate one known relationship between them before deciding on a strategy."
    }
  }
];
