import { create } from "zustand";

export interface Question {
  id: number;
  text: string;
  category: string;
  timeLimit: number; // seconds
}

export interface AnalysisResults {
  confidence: number; // 0-100
  eyeContact: number; // 0-100
  posture: number; // 0-100
  engagement: number; // 0-100
  overallScore: number; // 0-10
  suggestions: string[];
}

export interface InterviewState {
  // Session state
  currentQuestion: number;
  isRecording: boolean;
  videoReady: boolean;
  ttsPlaying: boolean;
  sessionStarted: boolean;
  sessionCompleted: boolean;

  // Video recording state
  isVideoRecording: boolean;
  recordedVideoBlob: Blob | null;
  videoDownloadUrl: string | null;

  // Analysis data
  analysisResults: AnalysisResults;
  realTimeAnalysis: {
    faceDetected: boolean;
    lookingAtCamera: boolean;
    goodPosture: boolean;
    speaking: boolean;
  };

  // Questions
  questions: Question[];

  // Actions
  setCurrentQuestion: (question: number) => void;
  setRecording: (recording: boolean) => void;
  setVideoReady: (ready: boolean) => void;
  setTtsPlaying: (playing: boolean) => void;
  setSessionStarted: (started: boolean) => void;
  setSessionCompleted: (completed: boolean) => void;
  updateAnalysisResults: (results: Partial<AnalysisResults>) => void;
  updateRealTimeAnalysis: (
    analysis: Partial<InterviewState["realTimeAnalysis"]>
  ) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  resetSession: () => void;

  // Video recording actions
  setVideoRecording: (recording: boolean) => void;
  setRecordedVideoBlob: (blob: Blob | null) => void;
  setVideoDownloadUrl: (url: string | null) => void;
}

// Default questions for the simplified interview
const defaultQuestions: Question[] = [
  {
    id: 1,
    text: "Tell me about yourself and your background.",
    category: "Introduction",
    timeLimit: 120,
  },
  {
    id: 2,
    text: "What are your greatest strengths?",
    category: "Strengths",
    timeLimit: 90,
  },
  {
    id: 3,
    text: "Describe a challenging project you worked on.",
    category: "Experience",
    timeLimit: 150,
  },
  {
    id: 4,
    text: "Where do you see yourself in 5 years?",
    category: "Goals",
    timeLimit: 90,
  },
  {
    id: 5,
    text: "Why are you interested in this position?",
    category: "Motivation",
    timeLimit: 120,
  },
  {
    id: 6,
    text: "What is your biggest weakness?",
    category: "Self-awareness",
    timeLimit: 90,
  },
  {
    id: 7,
    text: "Describe a time when you had to work in a team.",
    category: "Teamwork",
    timeLimit: 120,
  },
  {
    id: 8,
    text: "How do you handle stress and pressure?",
    category: "Problem-solving",
    timeLimit: 90,
  },
  {
    id: 9,
    text: "What questions do you have for us?",
    category: "Engagement",
    timeLimit: 90,
  },
  {
    id: 10,
    text: "Thank you for your time. Any final thoughts?",
    category: "Closing",
    timeLimit: 60,
  },
];

const initialAnalysisResults: AnalysisResults = {
  confidence: 0,
  eyeContact: 0,
  posture: 0,
  engagement: 0,
  overallScore: 0,
  suggestions: [],
};

const initialRealTimeAnalysis = {
  faceDetected: false,
  lookingAtCamera: false,
  goodPosture: false,
  speaking: false,
};

export const useInterviewStore = create<InterviewState>((set, get) => ({
  // Initial state
  currentQuestion: 0,
  isRecording: false,
  videoReady: false,
  ttsPlaying: false,
  sessionStarted: false,
  sessionCompleted: false,

  // Video recording initial state
  isVideoRecording: false,
  recordedVideoBlob: null,
  videoDownloadUrl: null,

  analysisResults: initialAnalysisResults,
  realTimeAnalysis: initialRealTimeAnalysis,
  questions: defaultQuestions,

  // Actions
  setCurrentQuestion: (question: number) => set({ currentQuestion: question }),

  setRecording: (recording: boolean) => set({ isRecording: recording }),

  setVideoReady: (ready: boolean) => set({ videoReady: ready }),

  setTtsPlaying: (playing: boolean) => set({ ttsPlaying: playing }),

  setSessionStarted: (started: boolean) => set({ sessionStarted: started }),

  setSessionCompleted: (completed: boolean) =>
    set({ sessionCompleted: completed }),

  updateAnalysisResults: (results: Partial<AnalysisResults>) =>
    set((state) => ({
      analysisResults: { ...state.analysisResults, ...results },
    })),

  updateRealTimeAnalysis: (
    analysis: Partial<InterviewState["realTimeAnalysis"]>
  ) =>
    set((state) => ({
      realTimeAnalysis: { ...state.realTimeAnalysis, ...analysis },
    })),

  nextQuestion: () => {
    const { currentQuestion, questions } = get();
    if (currentQuestion < questions.length - 1) {
      set({ currentQuestion: currentQuestion + 1 });
    } else {
      set({ sessionCompleted: true, isRecording: false });
    }
  },

  previousQuestion: () => {
    const { currentQuestion } = get();
    if (currentQuestion > 0) {
      set({ currentQuestion: currentQuestion - 1 });
    }
  },

  resetSession: () =>
    set({
      currentQuestion: 0,
      isRecording: false,
      videoReady: false,
      ttsPlaying: false,
      sessionStarted: false,
      sessionCompleted: false,
      isVideoRecording: false,
      recordedVideoBlob: null,
      videoDownloadUrl: null,
      analysisResults: initialAnalysisResults,
      realTimeAnalysis: initialRealTimeAnalysis,
    }),

  // Video recording actions
  setVideoRecording: (recording: boolean) =>
    set({ isVideoRecording: recording }),

  setRecordedVideoBlob: (blob: Blob | null) => set({ recordedVideoBlob: blob }),

  setVideoDownloadUrl: (url: string | null) => set({ videoDownloadUrl: url }),
}));
