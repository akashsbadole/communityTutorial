"use client";

import React, { useState, useEffect } from "react";
import { X, Play, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface YouTubeVideoPopupProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
  title?: string;
  autoplay?: boolean;
}

export function YouTubeVideoPopup({
  isOpen,
  onClose,
  videoId,
  title = "Demo Video",
  autoplay = true,
}: YouTubeVideoPopupProps) {
  const [isMuted, setIsMuted] = useState(false);

  // Close popup on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when popup is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Extract video ID from various YouTube URL formats
  const getVideoId = (url: string) => {
    if (url.length === 11) return url; // Already just the ID
    
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : url;
  };

  const cleanVideoId = getVideoId(videoId);
  
  // YouTube embed URL with parameters
  const embedUrl = `https://www.youtube.com/embed/${cleanVideoId}?${new URLSearchParams({
    autoplay: autoplay ? "1" : "0",
    mute: isMuted ? "1" : "0",
    rel: "0", // Don't show related videos
    modestbranding: "1", // Minimal YouTube branding
    fs: "1", // Allow fullscreen
    cc_load_policy: "0", // Don't show captions by default
    iv_load_policy: "3", // Don't show annotations
    playsinline: "1", // Play inline on mobile
  }).toString()}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-6xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Play className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500">TrainingHub Demo</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Mute/Unmute Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMuted(!isMuted)}
              className="text-gray-600 hover:text-gray-900"
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>

            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-600 hover:text-gray-900"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Video Container */}
        <div className="relative bg-black">
          <div className="aspect-video">
            <iframe
              src={embedUrl}
              title={title}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <p>🎯 See how our platform helps students learn effectively</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>
              <Button size="sm" asChild>
                <a
                  href={`https://www.youtube.com/watch?v=${cleanVideoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Watch on YouTube
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hook for managing video popup state
export function useYouTubePopup(videoId: string) {
  const [isOpen, setIsOpen] = useState(false);

  const openVideo = () => setIsOpen(true);
  const closeVideo = () => setIsOpen(false);

  return {
    isOpen,
    openVideo,
    closeVideo,
    VideoPopup: ({ title, autoplay }: { title?: string; autoplay?: boolean }) => (
      <YouTubeVideoPopup
        isOpen={isOpen}
        onClose={closeVideo}
        videoId={videoId}
        title={title}
        autoplay={autoplay}
      />
    ),
  };
}
