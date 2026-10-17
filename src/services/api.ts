import {
  Curriculum,
  DoubtInquiry,
  MistakeAnalysis,
  QuizQuestion,
  StudentProfile,
  WorldQuote,
} from '../types';

export const api = {
  // 1. Fetch Today's World Quote & Reflection
  async getQuote(category = 'metacognition'): Promise<WorldQuote> {
    try {
      const res = await fetch(`/api/quote?category=${encodeURIComponent(category)}`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('API getQuote fallback:', err);
      return {
        quote: "We do not see the world as it is; we see it through the lens of our nervous system and inner schemas, yet it is through direct engagement with the physical world that our minds take form.",
        author: "Synthesized Metacognitive Insight",
        era: "Contemporary Cognitive Epistemology",
        context: "In an era of rapid information and automated systems, grounding yourself in physical reality alongside inner clarity is the student's highest edge.",
        psychologicalAngle: "When the Adult ego state conducts reality testing without fear of judgment, study transforms from chore to flow.",
        metacognitiveAction: "Notice right now: Are you studying out of defensive fear or genuine curiosity?",
        synthesisMaterialInner: "External exams and internal understanding are two perspectives of one unified learning journey."
      };
    }
  },

  // 2. Generate University & Psychological Curriculum
  async generateCurriculum(payload: {
    subject: string;
    targetGoal: string;
    university: string;
    studentProfile?: StudentProfile;
  }): Promise<Curriculum> {
    try {
      const res = await fetch('/api/curriculum/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      return {
        ...data,
        id: `curr-${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0],
      };
    } catch (err) {
      console.warn('API generateCurriculum fallback:', err);
      return {
        id: `curr-${Date.now()}`,
        subject: payload.subject || "Academic Foundations",
        universityBenchmark: `${payload.university || 'Top Tier'} Benchmark`,
        psychologicalFramework: "Zone of Proximal Development & Flow Calibration",
        totalEstimatedWeeks: 6,
        overview: "A structured academic progression balancing theoretical clarity with deliberate practice.",
        createdAt: new Date().toISOString().split('T')[0],
        modules: [
          {
            id: `mod-${Date.now()}-1`,
            week: 1,
            title: `Foundations of ${payload.subject}`,
            universityEquivalent: "Core Lecture Series 1",
            bloomLevel: "Understand & Apply",
            cognitivePacing: "Gentle Onboarding",
            topics: [
              {
                id: `top-${Date.now()}-1`,
                name: `Fundamental Axioms of ${payload.subject}`,
                description: "Core principles and physical definitions.",
                recommendedResources: ["Foundational Texts", "Lecture Notes"],
                completed: false
              }
            ],
            metacognitiveCheckpoint: "Can you restate the foundational axiom without looking at textbook notes?",
            practicalAnchor: "Applying the concept to an observable everyday phenomenon."
          }
        ],
        psychologicalTips: [
          "Alternate between 45-minute focus intervals and 10-minute metacognitive synthesis.",
          "Keep an inquiry notebook for unresolved questions instead of letting them trigger anxiety."
        ]
      };
    }
  },

  // 2b. Parse Student's Own Raw Syllabus / Outline
  async parseRawSyllabus(payload: {
    rawText: string;
    subject: string;
    university: string;
    studentProfile?: StudentProfile;
  }): Promise<Curriculum> {
    try {
      const res = await fetch('/api/curriculum/parse-raw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      return {
        ...data,
        id: `curr-${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0],
      };
    } catch (err) {
      console.warn('API parseRawSyllabus fallback:', err);
      const lines = payload.rawText.split('\n').filter((l) => l.trim().length > 0);
      return {
        id: `curr-${Date.now()}`,
        subject: payload.subject || "My Custom Syllabus",
        universityBenchmark: payload.university || "Course Syllabus",
        psychologicalFramework: "Student-Paced Cognitive Scaffolding",
        totalEstimatedWeeks: Math.max(2, Math.ceil(lines.length / 3)),
        overview: "Structured directly from your submitted syllabus topics.",
        createdAt: new Date().toISOString().split('T')[0],
        modules: [
          {
            id: `mod-${Date.now()}-1`,
            week: 1,
            title: lines[0] || "Foundational Topics",
            universityEquivalent: "Section 1",
            bloomLevel: "Understand & Apply",
            cognitivePacing: "Steady Pace",
            topics: lines.slice(0, 4).map((line, idx) => ({
              id: `top-${Date.now()}-${idx}`,
              name: line.replace(/^[-*•0-9.)\s]+/, ''),
              description: `Study and practice of ${line.replace(/^[-*•0-9.)\s]+/, '')}`,
              recommendedResources: ["Course Notes"],
              completed: false,
            })),
            metacognitiveCheckpoint: "Can you summarize the core concept without notes?",
            practicalAnchor: "Solving an end-of-chapter application problem.",
          },
        ],
        psychologicalTips: ["Review topics with active recall before exams."],
      };
    }
  },
  async analyzeDoubt(payload: {
    question: string;
    context?: string;
    studentBackground?: string;
  }): Promise<DoubtInquiry> {
    try {
      const res = await fetch('/api/doubts/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      return {
        ...data,
        id: `doubt-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        question: payload.question,
        context: payload.context,
      };
    } catch (err) {
      console.warn('API analyzeDoubt fallback:', err);
      return {
        id: `doubt-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        question: payload.question,
        context: payload.context,
        doubtSummary: payload.question,
        pacAnalysis: {
          dominantEgoState: "Critical Parent / Adapted Child interaction",
          egoStateBreakdown: {
            parent: "Internalized expectation demanding immediate fluency without struggle.",
            adult: "Observes the factual mechanics of the concept without self-blame.",
            child: "Anxious response seeking emotional safety."
          },
          scoreDistribution: {
            parentPercent: 35,
            adultPercent: 40,
            childPercent: 25
          }
        },
        philosophicalSynthesis: "Physical academic challenges and inner self-worth are not in conflict; external tests simply reveal where models can be refined.",
        extractedThinkingPatterns: [
          {
            pattern: "Emotional Reasoning",
            evidence: "Assuming difficulty means intellectual inability.",
            reframing: "Cognitive resistance is proof of active learning, not incapacity."
          }
        ],
        conceptualExplanation: "Decompose the problem into elementary components. Trace how each part functions before assessing the whole system.",
        metacognitiveProtocol: {
          step1Observation: "Notice when frustration arises and label it neutrally.",
          step2Deconstruction: "Separate empirical facts from self-critical stories.",
          step3AdultAction: "Formulate one testable hypothesis about the problem."
        }
      };
    }
  },

  // 4. Generate Diagnostic Test Questions
  async generateTest(payload: {
    topic: string;
    difficulty: string;
    questionCount?: number;
  }): Promise<{ topic: string; questions: QuizQuestion[] }> {
    try {
      const res = await fetch('/api/test/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('API generateTest fallback:', err);
      return {
        topic: payload.topic,
        questions: [
          {
            id: `q-fallback-1`,
            question: `In studying ${payload.topic}, when does a theoretical model fail to predict real-world experimental observations?`,
            options: [
              "When experimental measurements are inherently invalid",
              "When hidden boundary conditions or unstated assumptions are violated",
              "Theoretical models never fail if the mathematics is pure",
              "Only when the student makes an algebraic calculation error"
            ],
            correctIndex: 1,
            conceptTested: "Boundary conditions and physical model assumptions",
            commonFlawTrap: "Believing mathematical models are universal without empirical boundary constraints.",
            explanation: "All models are approximations conditioned on specific assumptions (e.g. friction-less, linear response). Violating boundary conditions causes deviations."
          }
        ]
      };
    }
  },

  // 5. Improve the Mistake & Logic Debugger
  async analyzeMistake(payload: {
    question: string;
    chosenAnswer: string;
    correctAnswer: string;
    studentReasoning: string;
    topic?: string;
  }): Promise<MistakeAnalysis> {
    try {
      const res = await fetch('/api/test/analyze-mistake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('API analyzeMistake fallback:', err);
      return {
        question: payload.question,
        chosenAnswer: payload.chosenAnswer,
        correctAnswer: payload.correctAnswer,
        studentReasoning: payload.studentReasoning,
        identifiedFlaw: {
          name: "Premature Cognitive Closure",
          description: "You anchored on the first plausible explanation and stopped testing alternative possibilities.",
          intuitiveTrap: "The initial thought was partially true, making it feel complete before boundary checks were run."
        },
        argumentReconstruction: [
          { step: 1, type: "Valid Premise", text: "You identified the core mechanism correctly." },
          { step: 2, type: "Cognitive Leap", text: "You skipped verifying edge conditions and assumptions." },
          { step: 3, type: "Correct Deduction", text: "Factoring in the boundary constraint shifts the conclusion." },
          { step: 4, type: "Sound Conclusion", text: "The correct answer accounts for both the base rule and boundary case." }
        ],
        clearExplanation: "A sound deduction requires every premise to be verified against constraints before leaping to an answer.",
        anchoringMentalModel: {
          name: "The Inversion Check",
          rule: "Before confirming your answer, ask: 'Under what specific condition would this choice be completely wrong?'",
          applicationGuide: "Apply this 5-second sanity check on all multiple-choice questions."
        },
        microVerificationQuestion: {
          question: "Can you state the single assumption that broke your initial logic?",
          hint: "Focus on the unstated boundary condition."
        }
      };
    }
  },

  // 6. Analyze Personality Profile
  async analyzePersonality(payload: {
    answers: Record<string, string>;
    selfDescription?: string;
  }): Promise<StudentProfile> {
    try {
      const res = await fetch('/api/personality/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('API analyzePersonality fallback:', err);
      return {
        archetype: "Empirical Synthesizer",
        tagline: "Unifies theoretical concepts with practical experimentation and reality testing.",
        egoStateBalance: {
          parent: 25,
          adult: 55,
          child: 20,
          analysis: "Healthy rational Adult orientation with active curiosity and well-regulated study habits."
        },
        cognitiveDimensions: {
          epistemicCuriosity: "High Experimental",
          processingStyle: "Inductive & Concrete",
          stressResponse: "Calm Iteration",
          optimalStudyCadence: "50-min study / 10-min reflection"
        },
        strengths: ["Strong practical grasp", "Iterative resilience"],
        blindSpots: ["Can overlook abstract edge cases"],
        tailoredCurriculumStrategy: {
          pacing: "Balanced weekly blocks",
          checkpointFrequency: "Weekly tests with logic reviews",
          universityAlignment: "Hands-on laboratory + analytical problem sets"
        }
      };
    }
  }
};
