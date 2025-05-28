"use client";

import { useEffect, useRef, useState } from "react";
import { useInterviewStore } from "@/lib/stores/interview-store";
import { Camera, CameraOff, Eye, EyeOff, User, Volume2 } from "lucide-react";

interface VideoAnalyzerProps {
  onAnalysisUpdate?: (analysis: any) => void;
}

export function VideoAnalyzer({ onAnalysisUpdate }: VideoAnalyzerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const analysisIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // Video recording refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [cameraEnabled, setCameraEnabled] = useState(false);

  const {
    videoReady,
    isRecording,
    realTimeAnalysis,
    isVideoRecording,
    setVideoReady,
    updateRealTimeAnalysis,
    updateAnalysisResults,
    setVideoRecording,
    setRecordedVideoBlob,
    setVideoDownloadUrl,
  } = useInterviewStore();

  useEffect(() => {
    initializeCamera();
    return () => {
      cleanup();
    };
  }, []);

  useEffect(() => {
    if (isRecording && videoReady) {
      startAnalysis();
      startVideoRecording(); // Start video recording when interview recording starts
    } else {
      stopAnalysis();
      if (isVideoRecording) {
        stopVideoRecording(); // Stop video recording when interview recording stops
      }
    }
  }, [isRecording, videoReady]);

  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 640,
          height: 480,
          facingMode: "user",
        },
        audio: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        mediaStreamRef.current = stream;
        setCameraEnabled(true);
        setVideoReady(true);
        setError(null);

        // Initialize audio analysis
        initializeAudioAnalysis(stream);

        // Initialize video recording
        initializeVideoRecording(stream);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Camera access required for interview practice");
      setVideoReady(false);
    }
  };

  const initializeAudioAnalysis = (stream: MediaStream) => {
    try {
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);
    } catch (err) {
      console.error("Error initializing audio analysis:", err);
    }
  };

  // Initialize video recording capability
  const initializeVideoRecording = (stream: MediaStream) => {
    try {
      // Check if MediaRecorder is supported
      if (!MediaRecorder.isTypeSupported("video/webm")) {
        console.warn("WebM not supported, trying MP4");
        if (!MediaRecorder.isTypeSupported("video/mp4")) {
          console.error("No supported video format found");
          return;
        }
      }

      // Create MediaRecorder instance
      const options = {
        mimeType: MediaRecorder.isTypeSupported("video/webm")
          ? "video/webm"
          : "video/mp4",
        videoBitsPerSecond: 2500000, // 2.5 Mbps for good quality
      };

      mediaRecorderRef.current = new MediaRecorder(stream, options);
      recordedChunksRef.current = [];

      // Handle data available event
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      // Handle recording stop event
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, {
          type: mediaRecorderRef.current?.mimeType || "video/webm",
        });

        // Create download URL
        const url = URL.createObjectURL(blob);

        // Update store with recorded video
        setRecordedVideoBlob(blob);
        setVideoDownloadUrl(url);
        setVideoRecording(false);

        console.log("Video recording completed. Size:", blob.size, "bytes");
      };

      console.log("Video recording initialized successfully");
    } catch (err) {
      console.error("Error initializing video recording:", err);
    }
  };

  const startAnalysis = () => {
    if (analysisIntervalRef.current) return;

    analysisIntervalRef.current = setInterval(() => {
      performVideoAnalysis();
      performAudioAnalysis();
    }, 500); // Analyze every 500ms
  };

  const stopAnalysis = () => {
    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current);
      analysisIntervalRef.current = null;
    }
  };

  // Start video recording
  const startVideoRecording = () => {
    if (!mediaRecorderRef.current || isVideoRecording) return;

    try {
      recordedChunksRef.current = []; // Clear previous chunks
      mediaRecorderRef.current.start(1000); // Record in 1-second chunks
      setVideoRecording(true);
      console.log("Video recording started");
    } catch (err) {
      console.error("Error starting video recording:", err);
    }
  };

  // Stop video recording
  const stopVideoRecording = () => {
    if (!mediaRecorderRef.current || !isVideoRecording) return;

    try {
      mediaRecorderRef.current.stop();
      console.log("Video recording stopped");
    } catch (err) {
      console.error("Error stopping video recording:", err);
    }
  };

  const performVideoAnalysis = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Simple face detection using basic image analysis
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const analysis = analyzeFrame(imageData);

    updateRealTimeAnalysis(analysis);

    // Update cumulative analysis results
    updateCumulativeAnalysis(analysis);
  };

  const analyzeFrame = (imageData: ImageData): any => {
    const { data, width, height } = imageData;

    // Simple face detection based on skin tone and face-like patterns
    let facePixels = 0;
    let centerFacePixels = 0;
    let totalPixels = width * height;

    // Define center region for eye contact detection
    const centerX = width / 2;
    const centerY = height / 2;
    const centerRadius = Math.min(width, height) * 0.15;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Simple skin tone detection
      if (isSkinTone(r, g, b)) {
        facePixels++;

        // Check if this pixel is in the center region
        const pixelIndex = i / 4;
        const x = pixelIndex % width;
        const y = Math.floor(pixelIndex / width);
        const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);

        if (distance < centerRadius) {
          centerFacePixels++;
        }
      }
    }

    const faceDetected = facePixels > totalPixels * 0.05; // At least 5% skin tone
    const lookingAtCamera = centerFacePixels > facePixels * 0.3; // 30% of face in center
    const goodPosture =
      facePixels > totalPixels * 0.08 && facePixels < totalPixels * 0.25; // Good face size

    return {
      faceDetected,
      lookingAtCamera,
      goodPosture,
      facePixels,
      centerFacePixels,
    };
  };

  const isSkinTone = (r: number, g: number, b: number): boolean => {
    // Simple skin tone detection algorithm
    return (
      r > 95 &&
      g > 40 &&
      b > 20 &&
      Math.max(r, g, b) - Math.min(r, g, b) > 15 &&
      Math.abs(r - g) > 15 &&
      r > g &&
      r > b
    );
  };

  const performAudioAnalysis = () => {
    if (!analyserRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Calculate average volume
    const average =
      dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
    const speaking = average > 20; // Threshold for speaking detection

    updateRealTimeAnalysis({ speaking });
  };

  const updateCumulativeAnalysis = (currentAnalysis: any) => {
    // Simple scoring based on current analysis
    const confidence = currentAnalysis.faceDetected
      ? currentAnalysis.goodPosture
        ? 80
        : 60
      : 20;

    const eyeContact = currentAnalysis.lookingAtCamera ? 90 : 30;
    const posture = currentAnalysis.goodPosture ? 85 : 40;
    const engagement =
      currentAnalysis.faceDetected && realTimeAnalysis.speaking ? 90 : 50;

    const overallScore = Math.round(
      (confidence + eyeContact + posture + engagement) / 40
    );

    const suggestions = [];
    if (!currentAnalysis.faceDetected) {
      suggestions.push("Make sure your face is visible in the camera");
    }
    if (!currentAnalysis.lookingAtCamera) {
      suggestions.push("Look directly at the camera for better eye contact");
    }
    if (!currentAnalysis.goodPosture) {
      suggestions.push(
        "Adjust your position - sit up straight and center yourself"
      );
    }
    if (!realTimeAnalysis.speaking) {
      suggestions.push("Speak clearly and at a good volume");
    }

    updateAnalysisResults({
      confidence,
      eyeContact,
      posture,
      engagement,
      overallScore,
      suggestions,
    });
  };

  const cleanup = () => {
    stopAnalysis();

    // Stop video recording if active
    if (isVideoRecording && mediaRecorderRef.current) {
      stopVideoRecording();
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    // Clean up MediaRecorder
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current = null;
    }
    recordedChunksRef.current = [];

    setCameraEnabled(false);
    setVideoReady(false);
  };

  const toggleCamera = () => {
    if (mediaStreamRef.current) {
      const videoTrack = mediaStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setCameraEnabled(videoTrack.enabled);
      }
    }
  };

  return (
    <div className="relative bg-gray-900 rounded-lg overflow-hidden">
      {/* Video Display */}
      <div className="relative" style={{ aspectRatio: "4/3" }}>
        {error ? (
          <div className="flex items-center justify-center h-full text-white">
            <div className="text-center">
              <CameraOff className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">Camera Access Required</p>
              <p className="text-sm opacity-75 mb-4">{error}</p>
              <button
                onClick={initializeCamera}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Enable Camera
              </button>
            </div>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover transform scale-x-[-1]"
            />
            <canvas ref={canvasRef} className="hidden" />
          </>
        )}

        {/* Real-time Analysis Indicators */}
        {videoReady && (
          <div className="absolute top-4 left-4 space-y-2">
            {/* Face Detection */}
            <div
              className={`flex items-center gap-2 px-2 py-1 rounded text-xs ${
                realTimeAnalysis.faceDetected
                  ? "bg-green-600 text-white"
                  : "bg-red-600 text-white"
              }`}
            >
              <User className="h-3 w-3" />
              {realTimeAnalysis.faceDetected ? "Face Detected" : "No Face"}
            </div>

            {/* Eye Contact */}
            <div
              className={`flex items-center gap-2 px-2 py-1 rounded text-xs ${
                realTimeAnalysis.lookingAtCamera
                  ? "bg-green-600 text-white"
                  : "bg-yellow-600 text-white"
              }`}
            >
              {realTimeAnalysis.lookingAtCamera ? (
                <Eye className="h-3 w-3" />
              ) : (
                <EyeOff className="h-3 w-3" />
              )}
              {realTimeAnalysis.lookingAtCamera
                ? "Good Eye Contact"
                : "Look at Camera"}
            </div>

            {/* Speaking Indicator */}
            <div
              className={`flex items-center gap-2 px-2 py-1 rounded text-xs ${
                realTimeAnalysis.speaking
                  ? "bg-blue-600 text-white"
                  : "bg-gray-600 text-white"
              }`}
            >
              <Volume2 className="h-3 w-3" />
              {realTimeAnalysis.speaking ? "Speaking" : "Silent"}
            </div>
          </div>
        )}

        {/* Recording Indicators */}
        <div className="absolute top-4 right-4 space-y-2">
          {isRecording && (
            <div className="flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              Recording
            </div>
          )}
          {isVideoRecording && (
            <div className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              Video Recording
            </div>
          )}
        </div>

        {/* Camera Controls */}
        {videoReady && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <button
              onClick={toggleCamera}
              className={`p-2 rounded-full ${
                cameraEnabled
                  ? "bg-gray-800 text-white hover:bg-gray-700"
                  : "bg-red-600 text-white hover:bg-red-700"
              } transition-colors`}
            >
              {cameraEnabled ? (
                <Camera className="h-4 w-4" />
              ) : (
                <CameraOff className="h-4 w-4" />
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
