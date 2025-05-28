"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Mic,
  MicOff,
  Play,
  Pause,
  Square,
  Volume2,
  BarChart3,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";

interface VoiceAnalysisProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onAnalysisComplete: (analysis: VoiceAnalysisResult) => void;
  question?: string;
  timeLimit?: number;
}

interface VoiceAnalysisResult {
  transcript: string;
  confidence_score: number;
  speaking_pace: number;
  volume_consistency: number;
  pause_analysis: {
    total_pauses: number;
    avg_pause_duration: number;
    filler_words: string[];
  };
  clarity_score: number;
  overall_score: number;
  feedback: string[];
  recommendations: string[];
}

export default function VoiceAnalysis({
  isRecording,
  onStartRecording,
  onStopRecording,
  onAnalysisComplete,
  question,
  timeLimit = 300,
}: VoiceAnalysisProps) {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);
  const [analysis, setAnalysis] = useState<VoiceAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const wordsSpokenRef = useRef<string[]>([]);
  const pausesRef = useRef<number[]>([]);
  const volumeLevelsRef = useRef<number[]>([]);

  useEffect(() => {
    // Initialize speech recognition
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = "";
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
            wordsSpokenRef.current.push(...transcript.split(" "));
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript((prev) => prev + finalTranscript + interimTranscript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        if (event.error === "not-allowed") {
          toast.error(
            "Microphone access denied. Please allow microphone access to use voice analysis."
          );
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  }, [isRecording]);

  const startRecording = async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Set up audio context for volume analysis
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      microphoneRef.current =
        audioContextRef.current.createMediaStreamSource(stream);

      microphoneRef.current.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;

      // Start speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
      }

      // Start recording timer
      startTimeRef.current = Date.now();
      intervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setRecordingTime(elapsed);

        // Analyze audio level
        if (analyserRef.current) {
          const dataArray = new Uint8Array(
            analyserRef.current.frequencyBinCount
          );
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          const level = (average / 255) * 100;
          setAudioLevel(level);
          volumeLevelsRef.current.push(level);
        }

        // Auto-stop if time limit reached
        if (elapsed >= timeLimit) {
          onStopRecording();
        }
      }, 100);

      onStartRecording();
      toast.success("Recording started. Speak clearly into your microphone.");
    } catch (error) {
      console.error("Error starting recording:", error);
      toast.error(
        "Failed to start recording. Please check your microphone permissions."
      );
    }
  };

  const stopRecording = () => {
    // Stop speech recognition
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    // Stop audio stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    // Clear timer
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Analyze the recording
    if (transcript.trim()) {
      analyzeVoice();
    }

    onStopRecording();
  };

  const analyzeVoice = async () => {
    setIsAnalyzing(true);

    try {
      // Calculate speaking metrics
      const words = wordsSpokenRef.current.filter(
        (word) => word.trim().length > 0
      );
      const totalWords = words.length;
      const speakingTime = recordingTime;
      const wordsPerMinute =
        speakingTime > 0 ? (totalWords / speakingTime) * 60 : 0;

      // Analyze volume consistency
      const avgVolume =
        volumeLevelsRef.current.reduce((a, b) => a + b, 0) /
        volumeLevelsRef.current.length;
      const volumeVariance =
        volumeLevelsRef.current.reduce(
          (acc, level) => acc + Math.pow(level - avgVolume, 2),
          0
        ) / volumeLevelsRef.current.length;
      const volumeConsistency = Math.max(0, 100 - Math.sqrt(volumeVariance));

      // Detect filler words
      const fillerWords = [
        "um",
        "uh",
        "like",
        "you know",
        "so",
        "actually",
        "basically",
      ];
      const detectedFillers = words.filter((word) =>
        fillerWords.includes(word.toLowerCase().replace(/[.,!?]/g, ""))
      );

      // Calculate confidence score based on various factors
      const paceScore =
        wordsPerMinute >= 120 && wordsPerMinute <= 160
          ? 100
          : Math.max(0, 100 - Math.abs(140 - wordsPerMinute) * 2);

      const lengthScore = totalWords >= 50 ? 100 : (totalWords / 50) * 100;
      const fillerPenalty = Math.max(
        0,
        100 - (detectedFillers.length / totalWords) * 200
      );

      const confidenceScore =
        (paceScore + lengthScore + fillerPenalty + volumeConsistency) / 4;

      // Generate feedback
      const feedback = [];
      const recommendations = [];

      if (wordsPerMinute < 120) {
        feedback.push("Speaking pace is slower than ideal");
        recommendations.push(
          "Try to speak a bit faster to maintain engagement"
        );
      } else if (wordsPerMinute > 160) {
        feedback.push("Speaking pace is faster than ideal");
        recommendations.push("Slow down slightly to ensure clarity");
      } else {
        feedback.push("Good speaking pace");
      }

      if (volumeConsistency < 70) {
        feedback.push("Volume levels are inconsistent");
        recommendations.push(
          "Maintain consistent volume throughout your response"
        );
      } else {
        feedback.push("Good volume consistency");
      }

      if (detectedFillers.length > totalWords * 0.1) {
        feedback.push("High usage of filler words detected");
        recommendations.push(
          'Practice reducing filler words like "um", "uh", and "like"'
        );
      } else {
        feedback.push("Minimal use of filler words");
      }

      if (totalWords < 50) {
        feedback.push("Response could be more detailed");
        recommendations.push(
          "Provide more comprehensive answers with examples"
        );
      }

      const analysisResult: VoiceAnalysisResult = {
        transcript: transcript.trim(),
        confidence_score: Math.round(confidenceScore),
        speaking_pace: Math.round(wordsPerMinute),
        volume_consistency: Math.round(volumeConsistency),
        pause_analysis: {
          total_pauses: pausesRef.current.length,
          avg_pause_duration:
            pausesRef.current.length > 0
              ? pausesRef.current.reduce((a, b) => a + b, 0) /
                pausesRef.current.length
              : 0,
          filler_words: detectedFillers,
        },
        clarity_score: Math.round((lengthScore + fillerPenalty) / 2),
        overall_score: Math.round(confidenceScore),
        feedback,
        recommendations,
      };

      setAnalysis(analysisResult);
      onAnalysisComplete(analysisResult);
    } catch (error) {
      console.error("Error analyzing voice:", error);
      toast.error("Failed to analyze voice recording");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800";
    if (score >= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="space-y-6">
      {/* Recording Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5 text-blue-600" />
            Voice Recording & Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Recording Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  isRecording ? "bg-red-500 animate-pulse" : "bg-gray-300"
                }`}
              ></div>
              <span className="text-sm font-medium">
                {isRecording ? "Recording..." : "Ready to record"}
              </span>
              {isRecording && (
                <span className="text-sm text-gray-500">
                  {formatTime(recordingTime)} / {formatTime(timeLimit)}
                </span>
              )}
            </div>

            {/* Audio Level Indicator */}
            {isRecording && (
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-gray-500" />
                <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-100"
                    style={{ width: `${audioLevel}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Time Progress */}
          {isRecording && (
            <div>
              <Progress
                value={(recordingTime / timeLimit) * 100}
                className="h-2"
              />
            </div>
          )}

          {/* Recording Controls */}
          <div className="flex gap-2">
            {!isRecording ? (
              <Button onClick={onStartRecording} className="flex-1">
                <Mic className="h-4 w-4 mr-2" />
                Start Recording
              </Button>
            ) : (
              <Button
                onClick={onStopRecording}
                variant="destructive"
                className="flex-1"
              >
                <Square className="h-4 w-4 mr-2" />
                Stop Recording
              </Button>
            )}
          </div>

          {/* Live Transcript */}
          {transcript && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Live Transcript:
              </h4>
              <p className="text-sm text-gray-600">{transcript}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {isAnalyzing && (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Analyzing your voice...</p>
          </CardContent>
        </Card>
      )}

      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-600" />
              Voice Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Overall Score */}
            <div className="text-center">
              <div
                className={`text-4xl font-bold ${getScoreColor(
                  analysis.overall_score
                )}`}
              >
                {analysis.overall_score}%
              </div>
              <Badge className={getScoreBadgeColor(analysis.overall_score)}>
                Overall Confidence Score
              </Badge>
            </div>

            {/* Detailed Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 border rounded-lg">
                <div
                  className={`text-2xl font-bold ${getScoreColor(
                    analysis.confidence_score
                  )}`}
                >
                  {analysis.confidence_score}%
                </div>
                <div className="text-sm text-gray-600">Confidence</div>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {analysis.speaking_pace}
                </div>
                <div className="text-sm text-gray-600">Words/Min</div>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <div
                  className={`text-2xl font-bold ${getScoreColor(
                    analysis.volume_consistency
                  )}`}
                >
                  {analysis.volume_consistency}%
                </div>
                <div className="text-sm text-gray-600">Volume Consistency</div>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <div
                  className={`text-2xl font-bold ${getScoreColor(
                    analysis.clarity_score
                  )}`}
                >
                  {analysis.clarity_score}%
                </div>
                <div className="text-sm text-gray-600">Clarity</div>
              </div>
            </div>

            {/* Feedback */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Feedback:</h4>
              <ul className="space-y-1">
                {analysis.feedback.map((item, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendations */}
            {analysis.recommendations.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Recommendations:
                </h4>
                <ul className="space-y-1">
                  {analysis.recommendations.map((item, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <TrendingUp className="h-4 w-4 text-blue-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Filler Words */}
            {analysis.pause_analysis.filler_words.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Detected Filler Words:
                </h4>
                <div className="flex flex-wrap gap-1">
                  {[...new Set(analysis.pause_analysis.filler_words)].map(
                    (word, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {word}
                      </Badge>
                    )
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
