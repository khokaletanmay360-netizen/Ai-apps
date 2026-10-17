import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper for checking valid key
function isValidGeminiKey(): boolean {
  const key = process.env.GEMINI_API_KEY;
  return Boolean(key && key !== 'MY_GEMINI_API_KEY' && key.trim().length > 8);
}

async function callGeminiSafely<T>(fn: () => Promise<T>, timeoutMs = 7000): Promise<T | null> {
  if (!isValidGeminiKey()) return null;
  try {
    let timer: NodeJS.Timeout;
    const timeoutPromise = new Promise<null>((resolve) => {
      timer = setTimeout(() => resolve(null), timeoutMs);
    });
    const result = await Promise.race([fn(), timeoutPromise]);
    clearTimeout(timer!);
    return result;
  } catch (err) {
    console.error('Gemini call error:', err);
    return null;
  }
}

// Helper for cleaning and parsing Gemini JSON responses
function parseGeminiJson<T>(rawText: string | undefined, fallback: T): T {
  if (!rawText) return fallback;
  try {
    let clean = rawText.trim();
    if (clean.startsWith('```json')) {
      clean = clean.replace(/^```json\s*/, '').replace(/```\s*$/, '');
    } else if (clean.startsWith('```')) {
      clean = clean.replace(/^```\s*/, '').replace(/```\s*$/, '');
    }
    return JSON.parse(clean) as T;
  } catch (err) {
    console.error('Failed to parse Gemini JSON output:', err, rawText);
    return fallback;
  }
}

// 1. Endpoint: Quote of the Day & World Insight
app.get('/api/quote', async (req: Request, res: Response) => {
  const category = (req.query.category as string) || 'metacognition';
  const prompt = `Generate a profound "Today's World Quote & Reflection" tailored for serious students.
The quote should bridge timeless philosophical/psychological wisdom with contemporary modern reality (e.g. artificial intelligence, digital overload, hyper-competition, rapid societal shifts).
Crucial instruction: Avoid any dualistic alienation or hard split between the "materialistic external world" and the "inner subjective world". Synthesize them: show how physical action, study, science, and outer reality harmonize with inner consciousness and psychological clarity.
Return strictly valid JSON with this structure:
{
  "quote": "string",
  "author": "string",
  "era": "string (e.g. Ancient Stoic / Modern Cognitive Science / Existentialist)",
  "context": "string (1-2 sentences on why this applies to today's high-pressure world)",
  "psychologicalAngle": "string (analysis through psychology: flow, ego-states, or cognitive resilience)",
  "metacognitiveAction": "string (one concrete reflective question or micro-habit for the student to practice today)",
  "synthesisMaterialInner": "string (how this connects outer physical achievement with inner peace)"
}`;

  const data = await callGeminiSafely(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.8,
      },
    });
    return parseGeminiJson(response.text, null);
  });
  if (data) return res.json(data);

  // Curated high-fidelity fallback
  return res.json({
    quote: "We do not see the world as it is; we see it through the lens of our nervous system and inner schemas, yet it is through direct engagement with the physical world that our minds take form.",
    author: "Synthesized Metacognitive Insight",
    era: "Contemporary Cognitive Neuropsychology",
    context: "In an era of endless digital screens and high-stakes academic pressure, students often feel estranged between external expectations and internal anxiety.",
    psychologicalAngle: "When the Adult ego state observes external demands without internalizing them as parental threats, learning transitions from defensive compliance to intrinsic flow.",
    metacognitiveAction: "Notice right now: Are you studying to defend against fear, or are you engaged in direct, curious contact with the material reality of the concept?",
    synthesisMaterialInner: "External physics and internal experience are two perspectives on one unified life. Mastery of external knowledge is the natural outward expression of inner clarity."
  });
});

// 2. Endpoint: AI Curriculum & Syllabus Generator with Psychological Approach & University Data
app.post('/api/curriculum/generate', async (req: Request, res: Response) => {
  const { subject, targetGoal, university, studentProfile, existingModules } = req.body;

  const prompt = `You are a world-class academic curriculum architect and educational psychologist.
Construct a comprehensive university-benchmarked curriculum for the subject: "${subject}".
Target Goal / Level: "${targetGoal || 'Undergraduate to Advanced Mastery'}".
Benchmark University: "${university || 'MIT & Stanford standard'}".
Student Personality & Psychological Profile: ${JSON.stringify(studentProfile || { archetype: 'Balanced Explorer', egoState: 'Adult-dominated', pacing: 'Spaced deliberate practice' })}.

Requirements:
1. Ground the curriculum in accredited university standards (course syllabi from institutions like MIT OpenCourseWare, Stanford, Oxford, Cambridge, or IIT).
2. Integrate strict educational psychology principles:
   - Spaced cognitive load distribution (no overwhelming spikes)
   - Flow State trigger milestones (challenging yet achievable tasks)
   - Vygotsky's Zone of Proximal Development (ZPD scaffolding)
   - Bloom's Taxonomy progression (Remember -> Understand -> Apply -> Analyze -> Evaluate -> Create)
   - Metacognitive checkpoints (regular pauses for self-regulation and reflection)
3. Return strictly valid JSON in this schema:
{
  "subject": "${subject}",
  "universityBenchmark": "e.g. MIT 6.006 / Stanford CS106B aligned",
  "psychologicalFramework": "Summary of cognitive principles applied (e.g. Cognitive Load Theory + Flow Scaffolding)",
  "totalEstimatedWeeks": 8,
  "overview": "Brief description of the course and why this sequence works psychologically",
  "modules": [
    {
      "id": "mod-1",
      "week": 1,
      "title": "Module Title",
      "universityEquivalent": "e.g. MIT Lecture 1-3 equivalent",
      "bloomLevel": "Understand / Apply",
      "cognitivePacing": "Gentle onboarding / High flow / Deep synthesis",
      "topics": [
        {
          "id": "top-1-1",
          "name": "Topic Name",
          "description": "Clear conceptual summary",
          "recommendedResources": ["Resource 1 (e.g. MIT OCW Chapter)", "Interactive exercise"],
          "completed": false
        }
      ],
      "metacognitiveCheckpoint": "A reflective question for the student to verify their deep conceptual model before moving on",
      "practicalAnchor": "Real-world physical application that prevents purely theoretical dissociation"
    }
  ],
  "psychologicalTips": [
    "Specific tip based on the student's ego state and cognitive profile"
  ]
}`;

  const data = await callGeminiSafely(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });
    return parseGeminiJson(response.text, null);
  });
  if (data) return res.json(data);

  // Fallback curriculum
  return res.json({
    subject: subject || "Data Structures & Algorithmic Problem Solving",
    universityBenchmark: `${university || 'MIT 6.006'} Aligned Curriculum`,
    psychologicalFramework: "Zone of Proximal Development (ZPD) & Cognitive Load Pacing",
    totalEstimatedWeeks: 6,
    overview: "A carefully sequenced academic syllabus that balances rigorous algorithmic reasoning with gradual cognitive complexity to maintain Flow State.",
    modules: [
      {
        id: "mod-1",
        week: 1,
        title: "Foundations & Asymptotic Intuition",
        universityEquivalent: "MIT 6.006 Lec 1-2 / Stanford CS106B",
        bloomLevel: "Understand & Analyze",
        cognitivePacing: "High Flow, Low Anxiety",
        topics: [
          { id: "top-1-1", name: "Time & Space Complexity (Big-O, Omega, Theta)", description: "Intuitive growth rates of physical computation", recommendedResources: ["MIT OCW Lecture 1", "Algorithm Visualizer"], completed: false },
          { id: "top-1-2", name: "Memory Models & Cache Locality", description: "How hardware structures influence abstract algorithmic performance", recommendedResources: ["CS:APP Chapter on Memory Hierarchy"], completed: false }
        ],
        metacognitiveCheckpoint: "Can you explain Big-O without using algebraic notation, as a physical conservation of operational energy?",
        practicalAnchor: "Benchmarking execution time of 10^4 vs 10^7 operations on your local machine."
      },
      {
        id: "mod-2",
        week: 2,
        title: "Linear Data Structures & State Invariants",
        universityEquivalent: "Stanford CS106B Week 2",
        bloomLevel: "Apply & Evaluate",
        cognitivePacing: "Steady Deep Work",
        topics: [
          { id: "top-2-1", name: "Dynamic Arrays vs Linked Node Structures", description: "Trade-offs in contiguous vs pointer-based memory allocation", recommendedResources: ["Sedgewick Algorithms Pt 1"], completed: false },
          { id: "top-2-2", name: "Stack & Queue Invariants", description: "LIFO and FIFO mental models in parsing and scheduling", recommendedResources: ["Interactive Call-Stack Tracer"], completed: false }
        ],
        metacognitiveCheckpoint: "When writing a loop invariant, do you verify edge states (empty, single-item) automatically?",
        practicalAnchor: "Building an undo/redo stack engine for a text buffer."
      }
    ],
    psychologicalTips: [
      "Break problem-solving into distinct phases: First inspect without writing code to keep the Adult ego state active.",
      "Avoid equating speed of comprehension with intellectual capacity."
    ]
  });
});

// 2b. Endpoint: Parse Student's Own Raw Syllabus / Outline into Structured Curriculum
app.post('/api/curriculum/parse-raw', async (req: Request, res: Response) => {
  const { rawText, subject, university, studentProfile } = req.body;

  const prompt = `You are an educational psychologist and academic curriculum architect.
A student wants to upload or paste their OWN college/school syllabus or course outline:
Subject Title: "${subject || 'Custom Syllabus'}"
University / Institution: "${university || 'Custom Academic Course'}"
Raw Syllabus Content:
"""
${rawText}
"""

Task:
Convert this raw syllabus into a structured, highly organized weekly curriculum.
Keep the student's exact topics, but organize them into clean modules with:
- Week number & Title
- Bloom's Taxonomy cognitive level (e.g. Remember, Understand, Apply, Analyze, Evaluate)
- Cognitive pacing (Gentle onboarding / Deep focus / Mastery)
- Topics list with concise descriptions and recommended study resources
- Metacognitive self-check question (testing deep intuition)
- Practical anchor (real-world application)

Return strictly valid JSON:
{
  "subject": "${subject || 'Custom Syllabus'}",
  "universityBenchmark": "${university || 'Personal Course Syllabus'}",
  "psychologicalFramework": "Personalized Cognitive Load & Spaced Retrieval Scaffolding",
  "totalEstimatedWeeks": 6,
  "overview": "Carefully structured syllabus based directly on your provided course outline, optimized for metacognitive mastery.",
  "modules": [
    {
      "id": "mod-1",
      "week": 1,
      "title": "Module Title",
      "universityEquivalent": "Unit / Chapter 1",
      "bloomLevel": "Understand & Apply",
      "cognitivePacing": "Foundational Setup",
      "topics": [
        {
          "id": "top-1-1",
          "name": "Topic Name",
          "description": "Clear conceptual summary",
          "recommendedResources": ["Course Notes / Reference Text"],
          "completed": false
        }
      ],
      "metacognitiveCheckpoint": "A self-check question for understanding",
      "practicalAnchor": "Observable physical/computational application"
    }
  ],
  "psychologicalTips": [
    "Focus on one concept at a time using active retrieval before consulting textbook solutions."
  ]
}`;

  const data = await callGeminiSafely(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.5,
      },
    });
    return parseGeminiJson(response.text, null);
  });
  if (data) return res.json(data);

  // Fallback: rule-based parser of student's raw lines
  const lines = (rawText || '')
    .split('\n')
    .map((l: string) => l.trim())
    .filter((l: string) => l.length > 0);

  const fallbackModules = [];
  const chunkSize = Math.max(2, Math.ceil(lines.length / 4));
  let modIdx = 1;

  for (let i = 0; i < lines.length; i += chunkSize) {
    const chunk = lines.slice(i, i + chunkSize);
    fallbackModules.push({
      id: `mod-custom-${modIdx}`,
      week: modIdx,
      title: chunk[0]?.replace(/^[-*•0-9.)\s]+/, '') || `Unit ${modIdx}`,
      universityEquivalent: `Syllabus Section ${modIdx}`,
      bloomLevel: modIdx === 1 ? 'Understand & Apply' : 'Analyze & Evaluate',
      cognitivePacing: modIdx === 1 ? 'Foundational Pace' : 'Active Flow',
      topics: chunk.map((line: string, tIdx: number) => ({
        id: `top-custom-${modIdx}-${tIdx + 1}`,
        name: line.replace(/^[-*•0-9.)\s]+/, ''),
        description: `Detailed exploration of ${line.replace(/^[-*•0-9.)\s]+/, '')}`,
        recommendedResources: ['Primary Syllabus Reference Notes', 'Practice Problems'],
        completed: false
      })),
      metacognitiveCheckpoint: `Can you explain ${chunk[0]?.replace(/^[-*•0-9.)\s]+/, '') || 'this concept'} from first principles without looking at notes?`,
      practicalAnchor: 'Applying this theory to a concrete real-world problem or calculation.'
    });
    modIdx++;
  }

  if (fallbackModules.length === 0) {
    fallbackModules.push({
      id: 'mod-custom-1',
      week: 1,
      title: 'Foundational Syllabus Units',
      universityEquivalent: 'Unit 1',
      bloomLevel: 'Understand & Apply',
      cognitivePacing: 'Steady Pace',
      topics: [
        {
          id: 'top-custom-1-1',
          name: subject || 'Primary Topic',
          description: 'Fundamental definitions and core problems',
          recommendedResources: ['Course Materials'],
          completed: false
        }
      ],
      metacognitiveCheckpoint: 'Can you state the core axiom in your own words?',
      practicalAnchor: 'Direct real-world experiment or problem set.'
    });
  }

  return res.json({
    subject: subject || 'Custom Student Syllabus',
    universityBenchmark: university || 'Custom University Course',
    psychologicalFramework: 'Structured Cognitive Scaffolding & Spaced Retrieval',
    totalEstimatedWeeks: fallbackModules.length,
    overview: 'Structured directly from your submitted syllabus text with cognitive scaffolding and checkpoint milestones.',
    modules: fallbackModules,
    psychologicalTips: [
      'Break difficult topics into 45-minute focused blocks with 10-minute active recall synthesis.',
      'Review previous units weekly using spaced practice.'
    ]
  });
});

// 3. Endpoint: Metacognitive Doubt & Philosophical Inquiry with Parent-Adult-Child (PAC) Theory
app.post('/api/doubts/analyze', async (req: Request, res: Response) => {
  const { question, context, studentBackground } = req.body;

  const prompt = `You are an expert metacognitive mentor and Transactional Analysis (PAC) psychologist.
A student has submitted the following academic doubt or philosophical/existential question:
"${question}"
Context/Feelings: "${context || 'No specific background provided'}".

CRITICAL PSYCHOLOGICAL GUIDELINE:
1. Apply Eric Berne's Transactional Analysis (Parent-Adult-Child ego state model):
   - Critical Parent: judgmental, rigid rules, internalized "shoulds", imposter voices.
   - Nurturing Parent: supportive, self-soothing, encouraging safety.
   - Adult: objective, fact-seeking, reality-testing, logical, calm, unclouded by old scripts.
   - Natural Child: authentic curiosity, spontaneous wonder, playful intuition.
   - Adapted/Rebellious Child: anxious to please, fear of failure, defensive avoidance.
2. AVOID artificial or false dualism that separates the "materialistic external world" from the "inner mental world".
   - Do NOT say "the material world doesn't matter" or "ignore the external reality".
   - Integrate both: show how physical reality (grades, exams, code, nature, physical actions) and inner phenomenology (mindset, emotions, cognitive constructs) are interconnected parts of one holistic student life.
3. Extract thinking patterns (e.g. all-or-nothing thinking, emotional reasoning, externalized locus of control, conflating difficulty with incompetence).
4. Provide a Metacognitive Exercise ("thinking about thinking"): how to step back into the Adult ego state and solve both the conceptual doubt and the psychological block.

Return strictly valid JSON with this schema:
{
  "doubtSummary": "Concise restatement of the core question",
  "pacAnalysis": {
    "dominantEgoState": "Critical Parent / Adapted Child / Natural Child / Adult",
    "egoStateBreakdown": {
      "parent": "Analysis of the Parent voice (critical vs nurturing demands)",
      "adult": "Analysis of the objective reality and logical core of the question",
      "child": "Analysis of the emotional impulse, vulnerability, or curiosity"
    },
    "scoreDistribution": {
      "parentPercent": 35,
      "adultPercent": 40,
      "childPercent": 25
    }
  },
  "philosophicalSynthesis": "Resolution that unifies external physical/academic reality with inner subjective meaning without dualistic alienation",
  "extractedThinkingPatterns": [
    {
      "pattern": "Name of cognitive pattern (e.g. Premature Cognitive Closure or Catastrophic Projection)",
      "evidence": "Quote or signal from their question",
      "reframing": "Constructive Adult reframing"
    }
  ],
  "conceptualExplanation": "Deep, crystal-clear explanation answering the actual academic/philosophical doubt directly with university-level rigor",
  "metacognitiveProtocol": {
    "step1Observation": "What should the student notice internally right now?",
    "step2Deconstruction": "How to deconstruct the assumption objectively?",
    "step3AdultAction": "A specific, grounded concrete action to take next"
  }
}`;

  const data = await callGeminiSafely(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });
    return parseGeminiJson(response.text, null);
  });
  if (data) return res.json(data);

  // High quality fallback
  return res.json({
    doubtSummary: question,
    pacAnalysis: {
      dominantEgoState: "Adapted Child / Critical Parent tension",
      egoStateBreakdown: {
        parent: "Internalized expectation demanding immediate mastery without the natural struggle of learning.",
        adult: "Seeking empirical clarity on the underlying concepts and testing logical validity.",
        child: "Feeling anxious about intellectual capability and seeking reassurance against failure."
      },
      scoreDistribution: {
        parentPercent: 40,
        adultPercent: 35,
        childPercent: 25
      }
    },
    philosophicalSynthesis: "Your internal subjective cognition and the external physical reality are deeply entwined. Abstract concepts exist to explain physical dynamics; understanding is not an isolated mental trophy, but a bridge that allows you to operate skillfully in the world.",
    extractedThinkingPatterns: [
      {
        pattern: "Conflation of Friction with Incapacity",
        evidence: "Interpreting temporary cognitive load as a permanent lack of aptitude.",
        reframing: "Cognitive resistance is the neurobiological signature of synaptic restructuring, not inadequacy."
      }
    ],
    conceptualExplanation: "When breaking down this concept, isolate the foundational axioms first. Knowledge builds hierarchically: once the base constraint is recognized in physical reality, the theoretical conclusion follows with mathematical necessity.",
    metacognitiveProtocol: {
      step1Observation: "Notice where physical tension resides when you encounter this doubt.",
      step2Deconstruction: "Separate what is factual (the theorem/task) from what is narrative ('I will never understand this').",
      step3AdultAction: "Write down the single next verifiable step in plain language before writing formal equations or code."
    }
  });
});

// 4. Endpoint: Generate Diagnostic Test
app.post('/api/test/generate', async (req: Request, res: Response) => {
  const { topic, difficulty, questionCount = 3 } = req.body;

  const prompt = `Generate a rigorous diagnostic test for students on the topic: "${topic || 'Core Academic Reasoning'}".
Difficulty level: "${difficulty || 'Intermediate'}".
Provide ${questionCount} questions.
For each question:
- State a clear problem statement that tests deep conceptual logic (not just rote memorization).
- 4 multiple choice options (A, B, C, D).
- Specify the correct option index (0 for A, 1 for B, etc.).
- An explanation of the underlying scientific/mathematical/philosophical principle.
- A common student misconception / flawed reasoning trap associated with this question.

Return strictly valid JSON:
{
  "topic": "${topic}",
  "questions": [
    {
      "id": "q-1",
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 1,
      "conceptTested": "Core concept name",
      "commonFlawTrap": "Description of why students usually pick the wrong distractor",
      "explanation": "Clear analytical walkthrough"
    }
  ]
}`;

  const data = await callGeminiSafely(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.6,
      },
    });
    return parseGeminiJson(response.text, null);
  });
  if (data) return res.json(data);

  return res.json({
    topic: topic || "Algorithmic Invariants & Logic",
    questions: [
      {
        id: "q-1",
        question: "Consider a binary search on a sorted array of N elements. If the target element is absent, what is the exact maximum number of comparisons performed?",
        options: [
          "log2(N) rounded down",
          "floor(log2(N)) + 1",
          "N / 2",
          "2 * log2(N)"
        ],
        correctIndex: 1,
        conceptTested: "Binary decision tree height and worst-case comparison bounds",
        commonFlawTrap: "Forgetting that leaf nodes at the deepest level require one final boundary comparison when absent.",
        explanation: "Binary search repeatedly halves the search space. A tree with N elements has height floor(log2(N)). When the target is absent, the search terminates at an empty child branch, requiring floor(log2(N)) + 1 comparisons."
      },
      {
        id: "q-2",
        question: "In thermodynamics, when gas expands adiabatically against an external constant pressure in an insulated cylinder, what happens to the internal energy and temperature?",
        options: [
          "Internal energy remains constant; temperature decreases",
          "Internal energy decreases; temperature decreases",
          "Internal energy decreases; temperature remains constant",
          "Internal energy increases due to entropy production"
        ],
        correctIndex: 1,
        conceptTested: "First Law of Thermodynamics (delta U = Q - W) under adiabatic constraints",
        commonFlawTrap: "Confusing isothermal expansion with adiabatic expansion, assuming temperature stays fixed because no heat enters.",
        explanation: "Since the cylinder is insulated, heat transfer Q = 0. As the gas expands against external pressure, work W > 0 is done by the system. By delta U = Q - W, delta U = -W < 0. For an ideal gas, U depends directly on temperature, hence temperature decreases."
      }
    ]
  });
});

// 5. Endpoint: Improve the Mistake & Logic Flaw Rectifier
app.post('/api/test/analyze-mistake', async (req: Request, res: Response) => {
  const { question, chosenAnswer, correctAnswer, studentReasoning, topic } = req.body;

  const prompt = `You are a cognitive logician and academic diagnostic tutor.
A student answered a test question incorrectly. They have provided the thought process and reasoning they used.
Analyze their mistake, identify their exact logical flaw, reconstruct their argument into a valid logical sequence, and explain it with crystal clarity.

Question: "${question}"
Student's Chosen Answer: "${chosenAnswer}"
Correct Answer: "${correctAnswer}"
Student's Explained Logic / Reasoning: "${studentReasoning}"
Subject/Topic: "${topic || 'Academic Logic'}"

Instructions:
1. Pinpoint the exact Cognitive/Logical Flaw (e.g. Premature Generalization, Confusing Necessary vs Sufficient Condition, Overlooking Boundary Conditions, Affirming the Consequent, Inappropriate Analogy).
2. Show what was intuitive or seductive about their reasoning (validate their intent so they do not retreat into shame or Adapted Child defensiveness).
3. Re-structure their argument into a clean, formal logical chain (Premise 1 -> Premise 2 -> Flaw in Student's Step -> Correct Deduction -> Sound Conclusion).
4. Provide a memorable "Mental Model" or heuristic rule of thumb to prevent this exact mistake in future academic exams.
5. Provide a follow-up mini self-test question to verify understanding immediately.

Return strictly valid JSON:
{
  "identifiedFlaw": {
    "name": "Formal or informal fallacy / cognitive trap name",
    "description": "Why this specific flaw occurred in their reasoning",
    "intuitiveTrap": "Why this mistake made intuitive sense at first glance"
  },
  "argumentReconstruction": [
    { "step": 1, "type": "Valid Premise", "text": "Starting fact or definition that the student correctly recognized" },
    { "step": 2, "type": "Cognitive Leap / Divergence", "text": "The exact juncture where the student's reasoning deviated from formal logic" },
    { "step": 3, "type": "Correct Deduction", "text": "What valid inference should have been drawn instead" },
    { "step": 4, "type": "Sound Conclusion", "text": "The inevitable logical outcome" }
  ],
  "clearExplanation": "Friendly yet intellectually rigorous explanation of the physical/mathematical reality behind the correct answer",
  "anchoringMentalModel": {
    "name": "Heuristic / Rule of Thumb Name",
    "rule": "One concise sentence they can memorize",
    "applicationGuide": "How to deploy this heuristic whenever facing similar exam problems"
  },
  "microVerificationQuestion": {
    "question": "A quick variation of the problem to test immediate mastery",
    "hint": "What to look out for"
  }
}`;

  const data = await callGeminiSafely(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.5,
      },
    });
    return parseGeminiJson(response.text, null);
  });
  if (data) return res.json(data);

  // Fallback
  return res.json({
    identifiedFlaw: {
      name: "Conflation of Necessary vs Sufficient Conditions",
      description: "You treated a necessary condition as if it alone were sufficient to guarantee the outcome, omitting a secondary operational constraint.",
      intuitiveTrap: "Because the relationship holds in simpler symmetric cases, the brain tends to extrapolate linearly without checking asymmetrical edge cases."
    },
    argumentReconstruction: [
      { step: 1, type: "Valid Premise", text: "You correctly identified that the system halves the search territory at each branch." },
      { step: 2, type: "Cognitive Leap / Divergence", text: "You assumed the last evaluation occurs inside the array elements, omitting the final boundary check when absent." },
      { step: 3, type: "Correct Deduction", text: "Termination when absent requires confirming low > high, which adds exactly 1 terminal step after the leaf." },
      { step: 4, type: "Sound Conclusion", text: "Hence the formula must account for the terminal boundary: floor(log2(N)) + 1." }
    ],
    clearExplanation: "Think of an absent element not as landing on a slot, but falling through the cracks between slots. Finding a slot takes log2(N) steps; hitting the floor outside takes one additional comparison to confirm there are no more slots left.",
    anchoringMentalModel: {
      name: "The Boundary Fencepost Heuristic",
      rule: "Always test whether your algorithm terminates 'on' a target or 'past' the boundary of targets.",
      applicationGuide: "On questions involving counts or search iterations, quickly trace N=1 and N=2 to see if an off-by-one occurs."
    },
    microVerificationQuestion: {
      question: "If an array has 3 elements [2, 5, 8] and you search for target 6 (absent), count every comparison made step-by-step.",
      hint: "Trace mid=1 (val 5), then subarray [8], mid=2 (val 8), then right pointers cross."
    }
  });
});

// 6. Endpoint: Student Personality & Cognitive Profile Analyzer
app.post('/api/personality/analyze', async (req: Request, res: Response) => {
  const { answers, selfDescription } = req.body;

  const prompt = `You are an expert cognitive psychologist specializing in student learning styles, Transactional Analysis (Parent-Adult-Child ego states), and metacognition.
Based on the student's self-description and responses:
Answers: ${JSON.stringify(answers || {})}
Self Description: "${selfDescription || 'University student striving for deep comprehension and consistent focus'}"

Analyze:
1. Cognitive Learning Archetype (e.g. First-Principles Architect, Empirical Synthesizer, Intuitive Explorer, or Deliberate Systems Builder).
2. Transactional Analysis (PAC) Ego Profile (Parent, Adult, Child percentages and tendencies).
3. Primary Metacognitive Strengths and Cognitive Blind Spots.
4. Academic and Curricular Recommendations: How they should structure their syllabus, study sessions, and doubt resolution to experience maximum flow and minimal friction.

Return strictly valid JSON:
{
  "archetype": "Title of Cognitive Archetype",
  "tagline": "A sharp, inspiring 1-sentence descriptor of their intellectual style",
  "egoStateBalance": {
    "parent": 25,
    "adult": 55,
    "child": 20,
    "analysis": "Summary of how their ego states interact during study pressure"
  },
  "cognitiveDimensions": {
    "epistemicCuriosity": "High / Moderate / Deep Dive",
    "processingStyle": "First-Principles Deductive / Concrete Inductive / Spatial Synthetic",
    "stressResponse": "Catastrophic Overplanning / Freeze-Avoidance / Calm Diagnostic Inquiry",
    "optimalStudyCadence": "e.g. 50-minute deep blocks with 10-minute metacognitive debriefs"
  },
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "blindSpots": ["Blind spot 1 with specific remedy", "Blind spot 2 with specific remedy"],
  "tailoredCurriculumStrategy": {
    "pacing": "Recommended weekly load distribution",
    "checkpointFrequency": "How often to run self-tests and mistake logic rectifications",
    "universityAlignment": "Which university lecture/lab format fits them best (e.g. MIT Problem-Set heavy vs Oxford Tutorial inquiry)"
  }
}`;

  const data = await callGeminiSafely(async () => {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });
    return parseGeminiJson(response.text, null);
  });
  if (data) return res.json(data);

  // Fallback
  return res.json({
    archetype: "First-Principles Architect",
    tagline: "Builds unshakeable conceptual foundations by refusing to memorize what can be logically deduced.",
    egoStateBalance: {
      parent: 20,
      adult: 60,
      child: 20,
      analysis: "Strong Adult baseline with healthy Child curiosity, occasionally challenged by Critical Parent perfectionism when initial intuition is challenged."
    },
    cognitiveDimensions: {
      epistemicCuriosity: "High Deep Dive",
      processingStyle: "First-Principles Deductive",
      stressResponse: "Calm Diagnostic Inquiry",
      optimalStudyCadence: "45m deep focus + 15m logic mapping"
    },
    strengths: [
      "Exceptional capacity to dissect complex theories down to bedrock axioms.",
      "Resistant to superficial rote cramming; seeks true functional understanding.",
      "High metacognitive self-awareness when given structured reflective prompts."
    ],
    blindSpots: [
      "Perfectionistic paralysis: Delaying practice problem sets until all theory feels 100% complete. Remedy: Solve an imperfect problem on Day 1.",
      "Over-intellectualizing emotional fatigue: Treating natural cognitive exhaustion as a personal logic deficit."
    ],
    tailoredCurriculumStrategy: {
      pacing: "Moderate velocity with high depth per module, preventing shallow breadth.",
      checkpointFrequency: "Bi-weekly diagnostic test with dedicated logic debugging post-mortems.",
      universityAlignment: "MIT & Oxford style: Rigorous mathematical foundations coupled with active conceptual questioning."
    }
  });
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    app.use('*', async (req: Request, res: Response, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Noesis Server is running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
