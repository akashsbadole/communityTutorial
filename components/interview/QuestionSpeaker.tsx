"use client";

import { useEffect, useRef, useState } from "react";
import { useInterviewStore } from "@/lib/stores/interview-store";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Square } from "lucide-react";
import { Button } from "@/components/ui/button";

export function QuestionSpeaker() {
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] =
    useState<SpeechSynthesisVoice | null>(null);

  const { currentQuestion, questions, ttsPlaying, setTtsPlaying, isRecording } =
    useInterviewStore();

  const currentQuestionData = questions[currentQuestion];

  useEffect(() => {
    // Check if speech synthesis is supported
    if ("speechSynthesis" in window) {
      setIsSupported(true);
      loadVoices();

      // Listen for voices changed event
      speechSynthesis.addEventListener("voiceschanged", loadVoices);

      return () => {
        speechSynthesis.removeEventListener("voiceschanged", loadVoices);
      };
    }
  }, []);

  useEffect(() => {
    // Auto-play question when it changes
    if (currentQuestionData && isSupported && selectedVoice) {
      setTimeout(() => {
        speakQuestion();
      }, 1000); // 1 second delay before speaking
    }
  }, [currentQuestion, selectedVoice, isSupported]);

  const loadVoices = () => {
    const availableVoices = speechSynthesis.getVoices();
    setVoices(availableVoices);

    // Select a good default voice (prefer English voices)
    const englishVoices = availableVoices.filter(
      (voice) => voice.lang.startsWith("en") && !voice.name.includes("Google")
    );

    const preferredVoice =
      englishVoices.find(
        (voice) =>
          voice.name.includes("Female") ||
          voice.name.includes("Samantha") ||
          voice.name.includes("Alex")
      ) ||
      englishVoices[0] ||
      availableVoices[0];

    setSelectedVoice(preferredVoice);
  };

  const speakQuestion = () => {
    if (!isSupported || !selectedVoice || !currentQuestionData) {
      console.warn("Speech synthesis not available:", {
        isSupported,
        selectedVoice,
        currentQuestionData,
      });
      return;
    }

    // Stop any current speech
    speechSynthesis.cancel();

    // Wait a moment for cancel to complete
    setTimeout(() => {
      // Create new utterance
      const utterance = new SpeechSynthesisUtterance(currentQuestionData.text);
      utterance.voice = selectedVoice;
      utterance.rate = 0.9; // Slightly slower for clarity
      utterance.pitch = 1;
      utterance.volume = 0.8;

      // Set up event listeners
      utterance.onstart = () => {
        console.log("🎤 AI Interviewer started speaking");
        setTtsPlaying(true);
      };

      utterance.onend = () => {
        console.log("🎤 AI Interviewer finished speaking");
        setTtsPlaying(false);
      };

      utterance.onerror = (event) => {
        console.error("🚨 Speech synthesis error:", event);
        setTtsPlaying(false);

        // Try to restart speech synthesis if it fails
        setTimeout(() => {
          if (
            speechSynthesis.speaking === false &&
            speechSynthesis.pending === false
          ) {
            console.log("🔄 Retrying speech synthesis...");
            speechSynthesis.speak(utterance);
          }
        }, 1000);
      };

      utterance.onpause = () => {
        console.log("⏸️ Speech paused");
      };

      utterance.onresume = () => {
        console.log("▶️ Speech resumed");
      };

      utteranceRef.current = utterance;
      speechSynthesis.speak(utterance);

      console.log(
        "🎤 AI Interviewer speaking:",
        currentQuestionData.text.substring(0, 50) + "..."
      );
    }, 100);
  };

  const pauseResumeSpeech = () => {
    if (!isSupported) return;

    if (ttsPlaying) {
      if (speechSynthesis.paused) {
        speechSynthesis.resume();
        console.log("🔊 Speech resumed");
      } else {
        speechSynthesis.pause();
        console.log("⏸️ Speech paused");
      }
    } else {
      speakQuestion();
    }
  };

  const stopSpeech = () => {
    if (!isSupported) return;

    console.log("🛑 Stopping AI Interviewer speech");
    speechSynthesis.cancel();
    setTtsPlaying(false);

    // Clear the utterance reference
    if (utteranceRef.current) {
      utteranceRef.current = null;
    }
  };

  const repeatQuestion = () => {
    stopSpeech();
    setTimeout(() => {
      speakQuestion();
    }, 500);
  };

  if (!isSupported) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-yellow-800">
          <VolumeX className="h-5 w-5" />
          <span className="font-medium">Text-to-Speech Not Available</span>
        </div>
        <p className="text-sm text-yellow-700 mt-1">
          Your browser doesn't support text-to-speech. Please read the question
          below.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Question Display */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
              {currentQuestionData?.category}
            </span>
          </div>
          <div className="text-sm text-gray-500">
            {currentQuestionData?.timeLimit}s limit
          </div>
        </div>

        <h2 className="text-xl font-semibold text-gray-900 leading-relaxed">
          {currentQuestionData?.text}
        </h2>
      </div>

      {/* TTS Controls */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="h-5 w-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              AI Interviewer
            </span>
            {ttsPlaying && (
              <div className="flex items-center gap-1">
                <div className="w-1 h-4 bg-blue-500 animate-pulse"></div>
                <div
                  className="w-1 h-3 bg-blue-500 animate-pulse"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-1 h-5 bg-blue-500 animate-pulse"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <span className="text-xs text-blue-600 ml-2">Speaking...</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={pauseResumeSpeech}
              disabled={isRecording}
              className="flex items-center gap-2"
            >
              {ttsPlaying && !speechSynthesis.paused ? (
                <>
                  <Pause className="h-4 w-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  {ttsPlaying ? "Resume" : "Play"}
                </>
              )}
            </Button>

            {ttsPlaying && (
              <Button
                variant="outline"
                size="sm"
                onClick={stopSpeech}
                disabled={isRecording}
                className="flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50"
              >
                <Square className="h-4 w-4" />
                Stop
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={repeatQuestion}
              disabled={isRecording}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Repeat
            </Button>
          </div>
        </div>

        {/* Voice Status */}
        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span>Voice:</span>
            <span className="font-medium">
              {selectedVoice ? selectedVoice.name : "Loading..."}
            </span>
            {selectedVoice && (
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                Ready
              </span>
            )}
          </div>
          <div className="text-right">
            <span>{voices.length} voices available</span>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-2 text-xs text-gray-600">
          <p>
            💡 The AI interviewer will read the question aloud.
            {!isRecording &&
              " Click the record button when you're ready to answer."}
            {isRecording &&
              " You're being recorded - speak naturally and look at the camera."}
          </p>
        </div>
      </div>

      {/* Real-time Tips */}
      {isRecording && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">💡 Interview Tips</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Look directly at the camera for good eye contact</li>
            <li>• Sit up straight and keep your face centered</li>
            <li>• Speak clearly and at a moderate pace</li>
            <li>• Take a moment to think before answering</li>
          </ul>
        </div>
      )}

      {/* Voice Selection (Hidden but functional) */}
      {voices.length > 0 && (
        <select
          value={selectedVoice?.name || ""}
          onChange={(e) => {
            const voice = voices.find((v) => v.name === e.target.value);
            setSelectedVoice(voice || null);
          }}
          className="hidden" // Hidden for simplicity, but functional
        >
          {voices
            .filter((voice) => voice.lang.startsWith("en"))
            .map((voice) => (
              <option key={voice.name} value={voice.name}>
                {voice.name} ({voice.lang})
              </option>
            ))}
        </select>
      )}
    </div>
  );
}
