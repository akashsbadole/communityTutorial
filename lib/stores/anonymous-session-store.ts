'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AnonymousSessionState {
  questionsAnswered: number;
  sessionStartTime: number | null;
  hasShownLoginPrompt: boolean;
  
  // Actions
  incrementQuestions: () => void;
  resetSession: () => void;
  setLoginPromptShown: (shown: boolean) => void;
  canContinue: () => boolean;
  getRemainingQuestions: () => number;
}

const MAX_ANONYMOUS_QUESTIONS = 5;

export const useAnonymousSessionStore = create<AnonymousSessionState>()(
  persist(
    (set, get) => ({
      questionsAnswered: 0,
      sessionStartTime: null,
      hasShownLoginPrompt: false,

      incrementQuestions: () => {
        const state = get();
        set({
          questionsAnswered: state.questionsAnswered + 1,
          sessionStartTime: state.sessionStartTime || Date.now(),
        });
      },

      resetSession: () => {
        set({
          questionsAnswered: 0,
          sessionStartTime: null,
          hasShownLoginPrompt: false,
        });
      },

      setLoginPromptShown: (shown: boolean) => {
        set({ hasShownLoginPrompt: shown });
      },

      canContinue: () => {
        const state = get();
        return state.questionsAnswered < MAX_ANONYMOUS_QUESTIONS;
      },

      getRemainingQuestions: () => {
        const state = get();
        return Math.max(0, MAX_ANONYMOUS_QUESTIONS - state.questionsAnswered);
      },
    }),
    {
      name: 'anonymous-session-storage',
      partialize: (state) => ({
        questionsAnswered: state.questionsAnswered,
        sessionStartTime: state.sessionStartTime,
        hasShownLoginPrompt: state.hasShownLoginPrompt,
      }),
    }
  )
);
