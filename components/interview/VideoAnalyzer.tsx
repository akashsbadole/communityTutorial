"use client";

import { useEffect, useRef, useState } from "react";
import { useInterviewStore } from "@/lib/stores/interview-store";
import { Camera, CameraOff, Eye, EyeOff, User, Volume2 } from "lucide-react";
import * as faceapi from "face-api.js";

// MediaPipe will be loaded dynamically to avoid SSR issues
// We'll use multiple loading strategies for maximum compatibility

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
  const recordingStartTimeRef = useRef<number | null>(null);
  const recordingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const videoDeletionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [recordingTimeLeft, setRecordingTimeLeft] = useState<number | null>(
    null
  );
  const [faceApiLoaded, setFaceApiLoaded] = useState(false);
  const [mediaPipeLoaded, setMediaPipeLoaded] = useState(false);
  const [faceDetections, setFaceDetections] = useState<any[]>([]);
  const [faceMeshResults, setFaceMeshResults] = useState<any>(null);
  const [advancedAnalysis, setAdvancedAnalysis] = useState({
    eyeGazeDirection: { x: 0, y: 0 },
    headPose: { pitch: 0, yaw: 0, roll: 0 },
    emotionScores: {
      happy: 0,
      sad: 0,
      angry: 0,
      fearful: 0,
      disgusted: 0,
      surprised: 0,
      neutral: 0,
    },
    confidenceLevel: 0,
    attentionScore: 0,
    blinkRate: 0,
    speechClarity: 0,
  });

  // MediaPipe refs
  const faceMeshRef = useRef<any>(null);

  // CDN loading function for MediaPipe
  const loadMediaPipeFromCDN = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (window && (window as any).FaceMesh) {
        resolve();
        return;
      }

      // Create script tag for MediaPipe
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js";
      script.onload = () => {
        console.log("📦 MediaPipe script loaded from CDN");
        // Give it a moment to initialize
        setTimeout(() => {
          if (window && (window as any).FaceMesh) {
            resolve();
          } else {
            reject(new Error("MediaPipe not available after CDN load"));
          }
        }, 100);
      };
      script.onerror = () => {
        reject(new Error("Failed to load MediaPipe from CDN"));
      };

      document.head.appendChild(script);
    });
  };

  const {
    videoReady,
    isRecording,
    realTimeAnalysis,
    isVideoRecording,
    videoDownloadUrl,
    setVideoReady,
    updateRealTimeAnalysis,
    updateAnalysisResults,
    setVideoRecording,
    setRecordedVideoBlob,
    setVideoDownloadUrl,
  } = useInterviewStore();

  useEffect(() => {
    const initialize = async () => {
      await initializeCamera();
      await initializeFaceAPI();

      // Try MediaPipe as an enhancement, but don't block if it fails
      setTimeout(() => {
        initializeMediaPipe().catch((error) => {
          console.log(
            "🔄 MediaPipe enhancement not available, continuing with Face-API.js only"
          );
          console.log("MediaPipe error details:", error.message);
          // Ensure MediaPipe is marked as not loaded
          setMediaPipeLoaded(false);
        });
      }, 2000); // Give Face-API.js more time to load first
    };

    initialize();

    return () => {
      cleanup();
    };
  }, []);

  // Initialize Face-API.js models
  const initializeFaceAPI = async () => {
    try {
      console.log("Loading Face-API.js models...");

      const MODEL_URL = "/models";

      // Load all required models
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]);

      setFaceApiLoaded(true);
      console.log("✅ Face-API.js models loaded successfully");
    } catch (error) {
      console.error("❌ Error loading Face-API.js models:", error);
      setFaceApiLoaded(false);
      console.log("Using basic face detection as fallback");
    }
  };

  // Initialize MediaPipe Face Mesh with robust error handling
  const initializeMediaPipe = async () => {
    try {
      console.log("🔬 Attempting to initialize MediaPipe Face Mesh...");

      // Check if MediaPipe is available in the environment
      if (typeof window === "undefined") {
        console.log("❌ MediaPipe requires browser environment");
        setMediaPipeLoaded(false);
        return;
      }

      // Try multiple loading strategies
      let MediaPipeFaceMesh = null;

      try {
        // Strategy 1: Try dynamic import with proper destructuring
        console.log("📦 Attempting dynamic import of MediaPipe...");
        const mediaPipeModule = await import("@mediapipe/face_mesh");

        // Try different ways to access FaceMesh
        MediaPipeFaceMesh =
          mediaPipeModule.FaceMesh ||
          mediaPipeModule.default?.FaceMesh ||
          mediaPipeModule.default;

        if (MediaPipeFaceMesh) {
          console.log("✅ MediaPipe module loaded via dynamic import");
        } else {
          throw new Error("FaceMesh constructor not found in module");
        }
      } catch (importError) {
        console.warn("⚠️ Dynamic import failed:", importError);

        // Strategy 2: Check if already loaded globally
        if (window && (window as any).FaceMesh) {
          MediaPipeFaceMesh = (window as any).FaceMesh;
          console.log("✅ MediaPipe found in global scope");
        } else {
          // Strategy 3: Try CDN loading
          console.log("🌐 Attempting CDN loading of MediaPipe...");
          try {
            await loadMediaPipeFromCDN();
            if (window && (window as any).FaceMesh) {
              MediaPipeFaceMesh = (window as any).FaceMesh;
              console.log("✅ MediaPipe loaded from CDN");
            } else {
              throw new Error(
                "CDN loading failed - FaceMesh not available globally"
              );
            }
          } catch (cdnError) {
            console.warn("⚠️ CDN loading failed:", cdnError);
            console.log("❌ MediaPipe not available via any method");
            throw new Error(
              "MediaPipe FaceMesh not available via any loading strategy"
            );
          }
        }
      }

      if (!MediaPipeFaceMesh) {
        throw new Error("MediaPipe FaceMesh constructor not found");
      }

      console.log("🚀 Creating MediaPipe Face Mesh instance...");
      const faceMesh = new MediaPipeFaceMesh({
        locateFile: (file: string) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
        },
      });

      faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      faceMesh.onResults(onMediaPipeResults);
      faceMeshRef.current = faceMesh;

      setMediaPipeLoaded(true);
      console.log("✅ MediaPipe Face Mesh initialized successfully!");
      console.log(
        "🎯 Advanced facial landmark detection (468 points) is now active"
      );
    } catch (error) {
      console.warn("⚠️ MediaPipe initialization failed:", error);
      setMediaPipeLoaded(false);
      console.log("🔄 Falling back to Face-API.js only (still very advanced!)");

      // Don't throw error - just continue without MediaPipe
      // Face-API.js will still provide excellent analysis
    }
  };

  // Handle MediaPipe results
  const onMediaPipeResults = (results: any) => {
    setFaceMeshResults(results);

    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
      const landmarks = results.multiFaceLandmarks[0];
      const analysis = performAdvancedFacialAnalysis(landmarks);
      setAdvancedAnalysis(analysis);
    }
  };

  // Advanced facial analysis using MediaPipe landmarks
  const performAdvancedFacialAnalysis = (landmarks: any[]) => {
    try {
      // Key landmark indices for MediaPipe Face Mesh
      const leftEye = landmarks.slice(362, 374); // Left eye landmarks
      const rightEye = landmarks.slice(33, 45); // Right eye landmarks
      const nose = landmarks.slice(1, 5); // Nose tip landmarks
      const mouth = landmarks.slice(61, 81); // Mouth landmarks
      const leftEyebrow = landmarks.slice(46, 53); // Left eyebrow
      const rightEyebrow = landmarks.slice(53, 60); // Right eyebrow

      // Calculate eye gaze direction
      const eyeGaze = calculateEyeGaze(leftEye, rightEye, nose);

      // Calculate head pose
      const headPose = calculateHeadPose(landmarks);

      // Analyze facial expressions
      const emotionScores = analyzeFacialExpressions(
        landmarks,
        mouth,
        leftEyebrow,
        rightEyebrow
      );

      // Calculate attention and confidence scores
      const attentionScore = calculateAttentionScore(eyeGaze, headPose);
      const confidenceLevel = calculateConfidenceFromLandmarks(
        landmarks,
        emotionScores
      );

      // Analyze blink rate
      const blinkRate = analyzeBlinks(leftEye, rightEye);

      return {
        eyeGazeDirection: eyeGaze,
        headPose,
        emotionScores,
        confidenceLevel,
        attentionScore,
        blinkRate,
        speechClarity: 0, // Will be calculated from audio analysis
      };
    } catch (error) {
      console.error("Error in advanced facial analysis:", error);
      return advancedAnalysis; // Return current state on error
    }
  };

  // Calculate eye gaze direction
  const calculateEyeGaze = (leftEye: any[], rightEye: any[], nose: any[]) => {
    try {
      // Calculate center points
      const leftEyeCenter = {
        x: leftEye.reduce((sum, point) => sum + point.x, 0) / leftEye.length,
        y: leftEye.reduce((sum, point) => sum + point.y, 0) / leftEye.length,
      };

      const rightEyeCenter = {
        x: rightEye.reduce((sum, point) => sum + point.x, 0) / rightEye.length,
        y: rightEye.reduce((sum, point) => sum + point.y, 0) / rightEye.length,
      };

      const noseCenter = {
        x: nose.reduce((sum, point) => sum + point.x, 0) / nose.length,
        y: nose.reduce((sum, point) => sum + point.y, 0) / nose.length,
      };

      // Calculate gaze direction relative to nose
      const eyeCenter = {
        x: (leftEyeCenter.x + rightEyeCenter.x) / 2,
        y: (leftEyeCenter.y + rightEyeCenter.y) / 2,
      };

      return {
        x: (eyeCenter.x - noseCenter.x) * 100, // Normalized gaze direction
        y: (eyeCenter.y - noseCenter.y) * 100,
      };
    } catch (error) {
      return { x: 0, y: 0 };
    }
  };

  // Calculate head pose (pitch, yaw, roll)
  const calculateHeadPose = (landmarks: any[]) => {
    try {
      // Use key facial landmarks to estimate head pose
      const noseTip = landmarks[1];
      const leftEyeCorner = landmarks[33];
      const rightEyeCorner = landmarks[263];
      const chin = landmarks[175];
      const forehead = landmarks[10];

      // Calculate yaw (left-right rotation)
      const eyeDistance = Math.abs(leftEyeCorner.x - rightEyeCorner.x);
      const noseToLeftEye = Math.abs(noseTip.x - leftEyeCorner.x);
      const noseToRightEye = Math.abs(noseTip.x - rightEyeCorner.x);
      const yaw = ((noseToLeftEye - noseToRightEye) / eyeDistance) * 45; // Degrees

      // Calculate pitch (up-down rotation)
      const faceHeight = Math.abs(forehead.y - chin.y);
      const noseToForehead = Math.abs(noseTip.y - forehead.y);
      const pitch = (noseToForehead / faceHeight - 0.5) * 60; // Degrees

      // Calculate roll (tilt)
      const eyeSlope =
        (rightEyeCorner.y - leftEyeCorner.y) /
        (rightEyeCorner.x - leftEyeCorner.x);
      const roll = Math.atan(eyeSlope) * (180 / Math.PI); // Degrees

      return { pitch, yaw, roll };
    } catch (error) {
      return { pitch: 0, yaw: 0, roll: 0 };
    }
  };

  // Analyze facial expressions from landmarks
  const analyzeFacialExpressions = (
    landmarks: any[],
    mouth: any[],
    leftEyebrow: any[],
    rightEyebrow: any[]
  ) => {
    try {
      // Calculate mouth curvature for happiness/sadness
      const mouthCornerLeft = mouth[0];
      const mouthCornerRight = mouth[mouth.length - 1];
      const mouthCenter = mouth[Math.floor(mouth.length / 2)];

      const mouthCurvature =
        (mouthCornerLeft.y + mouthCornerRight.y) / 2 - mouthCenter.y;
      const happiness = Math.max(0, Math.min(1, mouthCurvature * 10 + 0.5));
      const sadness = Math.max(0, Math.min(1, -mouthCurvature * 10 + 0.5));

      // Calculate eyebrow position for surprise/anger
      const leftBrowHeight =
        leftEyebrow.reduce((sum, point) => sum + point.y, 0) /
        leftEyebrow.length;
      const rightBrowHeight =
        rightEyebrow.reduce((sum, point) => sum + point.y, 0) /
        rightEyebrow.length;
      const avgBrowHeight = (leftBrowHeight + rightBrowHeight) / 2;

      // Normalize brow height (lower values = raised brows = surprise)
      const surprise = Math.max(0, Math.min(1, (0.3 - avgBrowHeight) * 5));
      const angry = Math.max(0, Math.min(1, (avgBrowHeight - 0.25) * 5));

      // Calculate neutral as inverse of other emotions
      const totalEmotions = happiness + sadness + surprise + angry;
      const neutral = Math.max(0, 1 - totalEmotions);

      return {
        happy: happiness,
        sad: sadness,
        angry: angry,
        fearful: 0, // Simplified - would need more complex analysis
        disgusted: 0, // Simplified - would need more complex analysis
        surprised: surprise,
        neutral: neutral,
      };
    } catch (error) {
      return {
        happy: 0,
        sad: 0,
        angry: 0,
        fearful: 0,
        disgusted: 0,
        surprised: 0,
        neutral: 1,
      };
    }
  };

  // Calculate attention score based on gaze and head pose
  const calculateAttentionScore = (
    eyeGaze: { x: number; y: number },
    headPose: { pitch: number; yaw: number; roll: number }
  ) => {
    try {
      // Calculate how directly the person is looking at the camera
      const gazeDistance = Math.sqrt(
        eyeGaze.x * eyeGaze.x + eyeGaze.y * eyeGaze.y
      );
      const gazeScore = Math.max(0, 1 - gazeDistance / 50); // Normalize to 0-1

      // Calculate head pose score (closer to center = higher score)
      const poseDistance = Math.sqrt(
        headPose.pitch * headPose.pitch + headPose.yaw * headPose.yaw
      );
      const poseScore = Math.max(0, 1 - poseDistance / 45); // Normalize to 0-1

      // Combine scores
      return Math.round((gazeScore * 0.7 + poseScore * 0.3) * 100);
    } catch (error) {
      return 50; // Default moderate attention
    }
  };

  // Calculate confidence from landmarks and emotions
  const calculateConfidenceFromLandmarks = (
    landmarks: any[],
    emotionScores: any
  ) => {
    try {
      // Factors that indicate confidence:
      // 1. Upright posture (head not tilted too much)
      // 2. Direct gaze
      // 3. Positive emotions
      // 4. Stable facial features

      const headStability =
        1 - Math.abs(landmarks[10].y - landmarks[175].y) / 100; // Face height stability
      const emotionConfidence =
        emotionScores.happy +
        emotionScores.neutral -
        (emotionScores.sad + emotionScores.fearful);
      const overallStability = Math.max(0, Math.min(1, headStability));

      const confidence =
        (overallStability * 0.4 + Math.max(0, emotionConfidence) * 0.6) * 100;
      return Math.round(Math.max(0, Math.min(100, confidence)));
    } catch (error) {
      return 50; // Default moderate confidence
    }
  };

  // Analyze blink rate
  const analyzeBlinks = (leftEye: any[], rightEye: any[]) => {
    try {
      // Calculate eye openness based on vertical distance
      const leftEyeHeight = Math.abs(leftEye[1].y - leftEye[5].y); // Top and bottom of eye
      const rightEyeHeight = Math.abs(rightEye[1].y - rightEye[5].y);

      const avgEyeHeight = (leftEyeHeight + rightEyeHeight) / 2;

      // Detect if eyes are closed (very small height)
      const eyesClosed = avgEyeHeight < 0.01;

      // Simple blink rate calculation (would need temporal tracking for accuracy)
      return eyesClosed ? 1 : 0; // 1 if blinking, 0 if not
    } catch (error) {
      return 0;
    }
  };

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

        // Schedule auto-deletion after 5 minutes
        videoDeletionTimeoutRef.current = setTimeout(() => {
          console.log("Auto-deleting video after 5 minutes");
          cleanupVideoData();
        }, 300000); // 5 minutes
      };

      console.log("Video recording initialized successfully");
    } catch (err) {
      console.error("Error initializing video recording:", err);
    }
  };

  const startAnalysis = () => {
    if (analysisIntervalRef.current) return;

    console.log("Starting video and audio analysis...");
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

  // Start video recording with 5-minute limit
  const startVideoRecording = () => {
    if (!mediaRecorderRef.current || isVideoRecording) return;

    try {
      recordedChunksRef.current = []; // Clear previous chunks
      recordingStartTimeRef.current = Date.now();
      setRecordingTimeLeft(300); // 5 minutes in seconds

      mediaRecorderRef.current.start(1000); // Record in 1-second chunks
      setVideoRecording(true);
      console.log("Video recording started with 5-minute limit");

      // Set up 5-minute auto-stop timer
      recordingTimeoutRef.current = setTimeout(() => {
        console.log("5-minute limit reached, stopping recording");
        stopVideoRecording();
      }, 300000); // 5 minutes = 300,000ms

      // Update countdown timer every second
      const countdownInterval = setInterval(() => {
        if (recordingStartTimeRef.current) {
          const elapsed = Math.floor(
            (Date.now() - recordingStartTimeRef.current) / 1000
          );
          const remaining = Math.max(0, 300 - elapsed);
          setRecordingTimeLeft(remaining);

          if (remaining <= 0) {
            clearInterval(countdownInterval);
          }
        }
      }, 1000);

      // Store the countdown interval reference for cleanup
      (window as any).recordingCountdownInterval = countdownInterval;
    } catch (err) {
      console.error("Error starting video recording:", err);
    }
  };

  // Stop video recording
  const stopVideoRecording = () => {
    if (!mediaRecorderRef.current || !isVideoRecording) return;

    try {
      // Clear the 5-minute timeout if recording is stopped manually
      if (recordingTimeoutRef.current) {
        clearTimeout(recordingTimeoutRef.current);
        recordingTimeoutRef.current = null;
      }

      mediaRecorderRef.current.stop();
      setRecordingTimeLeft(null);
      recordingStartTimeRef.current = null;
      console.log("Video recording stopped");
    } catch (err) {
      console.error("Error stopping video recording:", err);
    }
  };

  // Clean up video data (for auto-deletion)
  const cleanupVideoData = () => {
    // Revoke the blob URL to free memory
    const { videoDownloadUrl } = useInterviewStore.getState();
    if (videoDownloadUrl) {
      URL.revokeObjectURL(videoDownloadUrl);
    }

    // Clear video data from store
    setRecordedVideoBlob(null);
    setVideoDownloadUrl(null);

    console.log("Video data cleaned up (auto-deleted)");
  };

  const performVideoAnalysis = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx || video.videoWidth === 0 || video.videoHeight === 0) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    let analysis;

    // Use Face-API.js if available, otherwise fallback to basic analysis
    if (faceApiLoaded) {
      analysis = await performFaceAPIAnalysis(video);
    } else {
      // Enhanced face detection using multiple techniques
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      analysis = analyzeFrameAdvanced(imageData, canvas.width, canvas.height);
    }

    // Process with MediaPipe if available
    if (mediaPipeLoaded && faceMeshRef.current) {
      try {
        await faceMeshRef.current.send({ image: video });
      } catch (error) {
        console.error("MediaPipe processing error:", error);
      }
    }

    // Enhance analysis with advanced features if available
    const enhancedAnalysis = {
      ...analysis,
      // Add advanced analysis data if MediaPipe is working
      ...(mediaPipeLoaded && advancedAnalysis.confidenceLevel > 0
        ? {
            advancedConfidence: advancedAnalysis.confidenceLevel,
            attentionScore: advancedAnalysis.attentionScore,
            headPose: advancedAnalysis.headPose,
            emotionScores: advancedAnalysis.emotionScores,
            eyeGazeDirection: advancedAnalysis.eyeGazeDirection,
            blinkRate: advancedAnalysis.blinkRate,
          }
        : {}),
    };

    updateRealTimeAnalysis(enhancedAnalysis);

    // Update cumulative analysis results
    updateCumulativeAnalysis(enhancedAnalysis);
  };

  // Advanced Face-API.js analysis
  const performFaceAPIAnalysis = async (video: HTMLVideoElement) => {
    try {
      if (!faceApiLoaded) {
        // Fallback to basic analysis if Face-API.js not loaded
        const imageData = canvasRef.current
          ?.getContext("2d")
          ?.getImageData(0, 0, video.videoWidth, video.videoHeight);
        if (imageData) {
          return analyzeFrameAdvanced(
            imageData,
            video.videoWidth,
            video.videoHeight
          );
        }
        return {
          faceDetected: false,
          lookingAtCamera: false,
          goodPosture: false,
          confidence: 0,
        };
      }

      // Use Face-API.js for advanced detection
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();

      setFaceDetections(detections);

      if (detections.length > 0) {
        const detection = detections[0];
        const landmarks = detection.landmarks;
        const expressions = detection.expressions;

        // Calculate eye contact based on face landmarks
        const leftEye = landmarks.getLeftEye();
        const rightEye = landmarks.getRightEye();
        const nose = landmarks.getNose();

        // Simple eye contact detection based on eye-nose alignment
        const eyeCenter = {
          x: (leftEye[0].x + rightEye[0].x) / 2,
          y: (leftEye[0].y + rightEye[0].y) / 2,
        };
        const noseCenter = {
          x: nose[0].x,
          y: nose[0].y,
        };

        // Check if eyes are looking towards camera (simplified)
        const eyeNoseDistance = Math.abs(eyeCenter.x - noseCenter.x);
        const lookingAtCamera = eyeNoseDistance < 20; // Threshold for direct gaze

        // Calculate confidence based on expressions
        const confidence =
          Math.max(
            expressions.happy || 0,
            expressions.neutral || 0,
            expressions.surprised || 0
          ) * 100;

        // Check posture based on face position
        const faceBox = detection.detection.box;
        const videoCenter = {
          x: video.videoWidth / 2,
          y: video.videoHeight / 2,
        };
        const faceCenter = {
          x: faceBox.x + faceBox.width / 2,
          y: faceBox.y + faceBox.height / 2,
        };

        const distanceFromCenter = Math.sqrt(
          Math.pow(faceCenter.x - videoCenter.x, 2) +
            Math.pow(faceCenter.y - videoCenter.y, 2)
        );

        const goodPosture = distanceFromCenter < 100; // Face is centered

        // Combine with MediaPipe analysis if available
        const combinedAnalysis = {
          faceDetected: true,
          lookingAtCamera,
          goodPosture,
          confidence: Math.round(confidence),
          expressions,
          landmarks: landmarks.positions,
          // Add advanced analysis from MediaPipe
          advancedAnalysis: mediaPipeLoaded ? advancedAnalysis : null,
        };

        return combinedAnalysis;
      } else {
        return {
          faceDetected: false,
          lookingAtCamera: false,
          goodPosture: false,
          confidence: 0,
          expressions: null,
          landmarks: null,
          advancedAnalysis: null,
        };
      }
    } catch (error) {
      console.error("Face-API analysis error:", error);
      // Fallback to basic analysis
      const imageData = canvasRef.current
        ?.getContext("2d")
        ?.getImageData(0, 0, video.videoWidth, video.videoHeight);
      if (imageData) {
        return analyzeFrameAdvanced(
          imageData,
          video.videoWidth,
          video.videoHeight
        );
      }
      return {
        faceDetected: false,
        lookingAtCamera: false,
        goodPosture: false,
        confidence: 0,
      };
    }
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

  // Advanced frame analysis with multiple detection techniques
  const analyzeFrameAdvanced = (
    imageData: ImageData,
    width: number,
    height: number
  ): any => {
    const { data } = imageData;

    // Multiple analysis techniques
    const skinToneAnalysis = analyzeSkinTone(data, width, height);
    const motionAnalysis = analyzeMotion(data, width, height);
    const brightnessAnalysis = analyzeBrightness(data, width, height);

    // Combine results for more accurate detection
    const faceDetected =
      skinToneAnalysis.faceDetected && brightnessAnalysis.hasGoodLighting;
    const lookingAtCamera =
      skinToneAnalysis.lookingAtCamera && motionAnalysis.isStable;
    const goodPosture = skinToneAnalysis.goodPosture && motionAnalysis.isStable;

    return {
      faceDetected,
      lookingAtCamera,
      goodPosture,
      speaking: false, // Will be updated by audio analysis
      confidence: calculateConfidence(
        faceDetected,
        lookingAtCamera,
        goodPosture
      ),
    };
  };

  // Skin tone analysis for face detection
  const analyzeSkinTone = (
    data: Uint8ClampedArray,
    width: number,
    height: number
  ) => {
    let facePixels = 0;
    let centerFacePixels = 0;
    const totalPixels = width * height;

    // Define center region for eye contact detection
    const centerX = width / 2;
    const centerY = height / 2;
    const centerRadius = Math.min(width, height) * 0.15;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Enhanced skin tone detection
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
      facePixels > totalPixels * 0.08 && facePixels < totalPixels * 0.25;

    return { faceDetected, lookingAtCamera, goodPosture };
  };

  // Motion analysis for stability detection
  const analyzeMotion = (
    data: Uint8ClampedArray,
    width: number,
    height: number
  ) => {
    // Simple motion detection by comparing with previous frame
    // For now, assume stable if we have consistent face detection
    return {
      isStable: true, // Simplified for now
      movementLevel: 0.1,
    };
  };

  // Brightness analysis for lighting conditions
  const analyzeBrightness = (
    data: Uint8ClampedArray,
    width: number,
    height: number
  ) => {
    let totalBrightness = 0;
    const sampleSize = Math.min(1000, data.length / 4); // Sample pixels for performance

    for (let i = 0; i < sampleSize * 4; i += 16) {
      // Sample every 4th pixel
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const brightness = (r + g + b) / 3;
      totalBrightness += brightness;
    }

    const avgBrightness = totalBrightness / sampleSize;
    const hasGoodLighting = avgBrightness > 50 && avgBrightness < 200; // Good lighting range

    return { hasGoodLighting, avgBrightness };
  };

  // Calculate overall confidence score
  const calculateConfidence = (
    faceDetected: boolean,
    lookingAtCamera: boolean,
    goodPosture: boolean
  ): number => {
    let score = 0;
    if (faceDetected) score += 40;
    if (lookingAtCamera) score += 30;
    if (goodPosture) score += 30;
    return Math.min(100, score);
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

    // Advanced audio analysis
    const speechClarity = calculateSpeechClarity(dataArray);
    const voiceConfidence = calculateVoiceConfidence(average, dataArray);

    // Update advanced analysis with speech data
    if (mediaPipeLoaded) {
      setAdvancedAnalysis((prev) => ({
        ...prev,
        speechClarity,
        confidenceLevel: Math.max(prev.confidenceLevel, voiceConfidence),
      }));
    }

    updateRealTimeAnalysis({
      speaking,
      speechClarity,
      voiceConfidence,
    });
  };

  // Calculate speech clarity from frequency data
  const calculateSpeechClarity = (dataArray: Uint8Array): number => {
    try {
      // Analyze frequency distribution for speech clarity
      const lowFreq = dataArray.slice(0, dataArray.length / 4);
      const midFreq = dataArray.slice(
        dataArray.length / 4,
        dataArray.length / 2
      );
      const highFreq = dataArray.slice(dataArray.length / 2);

      const lowAvg =
        lowFreq.reduce((sum, val) => sum + val, 0) / lowFreq.length;
      const midAvg =
        midFreq.reduce((sum, val) => sum + val, 0) / midFreq.length;
      const highAvg =
        highFreq.reduce((sum, val) => sum + val, 0) / highFreq.length;

      // Good speech has balanced frequency distribution
      const balance = 1 - Math.abs(midAvg - (lowAvg + highAvg) / 2) / 100;
      return Math.max(0, Math.min(100, balance * 100));
    } catch (error) {
      return 50; // Default moderate clarity
    }
  };

  // Calculate voice confidence from audio characteristics
  const calculateVoiceConfidence = (
    volume: number,
    dataArray: Uint8Array
  ): number => {
    try {
      // Factors for voice confidence:
      // 1. Consistent volume (not too quiet or too loud)
      // 2. Steady frequency pattern
      // 3. Clear articulation

      const volumeScore = volume > 15 && volume < 80 ? 1 : 0.5;

      // Calculate frequency stability
      const variance =
        dataArray.reduce((sum, val, i) => {
          const avg = dataArray.reduce((s, v) => s + v, 0) / dataArray.length;
          return sum + Math.pow(val - avg, 2);
        }, 0) / dataArray.length;

      const stabilityScore = Math.max(0, 1 - variance / 1000);

      return Math.round((volumeScore * 0.6 + stabilityScore * 0.4) * 100);
    } catch (error) {
      return 50; // Default moderate confidence
    }
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
    console.log("Cleaning up video analyzer...");
    stopAnalysis();

    // Stop video recording if active
    if (isVideoRecording && mediaRecorderRef.current) {
      stopVideoRecording();
    }

    // Clear all timeouts and intervals
    if (recordingTimeoutRef.current) {
      clearTimeout(recordingTimeoutRef.current);
      recordingTimeoutRef.current = null;
    }
    if (videoDeletionTimeoutRef.current) {
      clearTimeout(videoDeletionTimeoutRef.current);
      videoDeletionTimeoutRef.current = null;
    }

    // Clear countdown interval
    if ((window as any).recordingCountdownInterval) {
      clearInterval((window as any).recordingCountdownInterval);
      (window as any).recordingCountdownInterval = null;
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

    // Clean up video data
    cleanupVideoData();

    setCameraEnabled(false);
    setVideoReady(false);
    setRecordingTimeLeft(null);
    console.log("Video analyzer cleanup completed");
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
            {/* Analysis Status */}
            <div
              className={`flex items-center gap-2 px-2 py-1 rounded text-xs ${
                faceApiLoaded
                  ? "bg-purple-600 text-white"
                  : "bg-gray-600 text-white"
              }`}
            >
              <span className="text-xs">🤖</span>
              {faceApiLoaded ? "Face-API.js Active" : "Loading AI..."}
            </div>

            {/* MediaPipe Status */}
            <div
              className={`flex items-center gap-2 px-2 py-1 rounded text-xs ${
                mediaPipeLoaded
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-500 text-white"
              }`}
            >
              <span className="text-xs">🔬</span>
              {mediaPipeLoaded ? "MediaPipe Active" : "MediaPipe Loading..."}
            </div>

            {/* Overall Status */}
            <div
              className={`flex items-center gap-2 px-2 py-1 rounded text-xs ${
                faceApiLoaded
                  ? mediaPipeLoaded
                    ? "bg-green-600 text-white"
                    : "bg-yellow-600 text-white"
                  : "bg-red-600 text-white"
              }`}
            >
              <span className="text-xs">⚡</span>
              {faceApiLoaded
                ? mediaPipeLoaded
                  ? "Full AI Active"
                  : "Advanced AI Active"
                : "Basic Mode"}
            </div>

            {/* Advanced Analysis Indicators */}
            {faceApiLoaded && advancedAnalysis.confidenceLevel > 0 && (
              <>
                {/* Confidence Level */}
                <div
                  className={`flex items-center gap-2 px-2 py-1 rounded text-xs ${
                    advancedAnalysis.confidenceLevel > 70
                      ? "bg-green-600"
                      : advancedAnalysis.confidenceLevel > 40
                      ? "bg-yellow-600"
                      : "bg-red-600"
                  } text-white`}
                >
                  <span className="text-xs">💪</span>
                  Confidence: {advancedAnalysis.confidenceLevel}%
                </div>

                {/* Attention Score */}
                <div
                  className={`flex items-center gap-2 px-2 py-1 rounded text-xs ${
                    advancedAnalysis.attentionScore > 70
                      ? "bg-green-600"
                      : advancedAnalysis.attentionScore > 40
                      ? "bg-yellow-600"
                      : "bg-red-600"
                  } text-white`}
                >
                  <span className="text-xs">👁️</span>
                  Attention: {advancedAnalysis.attentionScore}%
                </div>

                {/* Head Pose Indicator */}
                <div className="flex items-center gap-2 px-2 py-1 rounded text-xs bg-blue-600 text-white">
                  <span className="text-xs">📐</span>
                  Pose: {Math.round(advancedAnalysis.headPose.yaw)}°
                </div>

                {/* Emotion Indicator */}
                {Object.entries(advancedAnalysis.emotionScores).map(
                  ([emotion, score]) => {
                    if (score > 0.3) {
                      return (
                        <div
                          key={emotion}
                          className="flex items-center gap-2 px-2 py-1 rounded text-xs bg-pink-600 text-white"
                        >
                          <span className="text-xs">😊</span>
                          {emotion}: {Math.round(score * 100)}%
                        </div>
                      );
                    }
                    return null;
                  }
                )}
              </>
            )}

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

            {/* Advanced Speech Analysis */}
            {realTimeAnalysis.speechClarity !== undefined && (
              <div
                className={`flex items-center gap-2 px-2 py-1 rounded text-xs ${
                  realTimeAnalysis.speechClarity > 70
                    ? "bg-green-600"
                    : realTimeAnalysis.speechClarity > 40
                    ? "bg-yellow-600"
                    : "bg-red-600"
                } text-white`}
              >
                <span className="text-xs">🎤</span>
                Clarity: {realTimeAnalysis.speechClarity}%
              </div>
            )}

            {/* Voice Confidence */}
            {realTimeAnalysis.voiceConfidence !== undefined && (
              <div
                className={`flex items-center gap-2 px-2 py-1 rounded text-xs ${
                  realTimeAnalysis.voiceConfidence > 70
                    ? "bg-green-600"
                    : realTimeAnalysis.voiceConfidence > 40
                    ? "bg-yellow-600"
                    : "bg-red-600"
                } text-white`}
              >
                <span className="text-xs">🗣️</span>
                Voice: {realTimeAnalysis.voiceConfidence}%
              </div>
            )}
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
              {recordingTimeLeft !== null && (
                <span className="ml-2 font-mono text-xs">
                  {Math.floor(recordingTimeLeft / 60)}:
                  {(recordingTimeLeft % 60).toString().padStart(2, "0")}
                </span>
              )}
            </div>
          )}
          {recordingTimeLeft !== null && recordingTimeLeft <= 30 && (
            <div className="flex items-center gap-2 bg-orange-600 text-white px-3 py-1 rounded-full text-sm animate-pulse">
              ⚠️ {recordingTimeLeft}s left
            </div>
          )}
        </div>

        {/* Camera Controls */}
        {videoReady && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
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

            {/* Video Download Button */}
            {videoDownloadUrl && (
              <a
                href={videoDownloadUrl}
                download={`interview-recording-${new Date()
                  .toISOString()
                  .slice(0, 19)}.webm`}
                className="p-2 rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors"
                title="Download Recording"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
