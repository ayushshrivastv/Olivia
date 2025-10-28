/**
 * Olivia - AI Voice Assistant
 * Copyright (c) 2024 Ayush Srivastava
 * 
 * Licensed under the MIT License
 */
"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { sendAudioMessage, audioMessageEmitter, startRecording, stopRecording, getIsRecording } from "@/utils/AudioUtils";

export default function AudioMessenger() {
  const [isRecording, setIsRecording] = useState(false);

  const toggleRecording = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  };

  // Set up event listeners
  useEffect(() => {
    const handleRecordingState = (state: boolean) => setIsRecording(state);
    const handleRecordingMessage = (message: string) => {
      const rxDataEl = document.getElementById("rxData") as HTMLTextAreaElement;
      if (rxDataEl) rxDataEl.innerText = message;
    };
    const handleRecordingError = (error: Error) => {
      console.error('Recording error:', error);
      setIsRecording(false);
    };

    audioMessageEmitter.on('recordingStateChanged', handleRecordingState);
    audioMessageEmitter.on('recordingMessage', handleRecordingMessage);
    audioMessageEmitter.on('recordingError', handleRecordingError);

    // Set initial recording state
    setIsRecording(getIsRecording());

    // Clean up event listeners
    return () => {
      audioMessageEmitter.off('recordingStateChanged', handleRecordingState);
      audioMessageEmitter.off('recordingMessage', handleRecordingMessage);
      audioMessageEmitter.off('recordingError', handleRecordingError);
    };
  }, []);

  // Set up send button event listener
  useEffect(() => {
    const sendBtn = document.getElementById("sendBtn");
    const clickHandler = () => {
      const txDataEl = document.getElementById("txData") as HTMLTextAreaElement;
      sendAudioMessage(txDataEl.value);
    }
    if (sendBtn) sendBtn.addEventListener("click", clickHandler);

    return () => {
      if (sendBtn) sendBtn.removeEventListener("click", clickHandler);
    };
  }, []);

  return (
    <div className="absolute right-0 top-0 z-50">
      <Script src="/ggwave/ggwave.js" strategy="afterInteractive" />
      <div className="flex justify-center items-center p-8">
        <Card className="w-full max-w-2xl rounded-3xl">
          <CardHeader>
            <CardTitle className="text-center text-xl">
              Audio Messenger
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <label htmlFor="txData" className="block text-lg font-medium">
                Message to Send
              </label>
              <textarea
                id="txData"
                className="w-full h-32 p-3 rounded-xl bg-background border border-input hover:border-accent focus:border-ring focus:ring-2 focus:ring-ring focus:outline-none transition-colors"
                defaultValue="ping 2"
              />
              <Button
                id="sendBtn"
                variant="outline"
                size="lg"
                className="w-full rounded-full"
              >
                Send Message
              </Button>
            </div>

            <div className="space-y-4">
              <label htmlFor="rxData" className="block text-lg font-medium">
                Received Messages
              </label>
              <div
                id="rxData"
                className="w-full h-32 p-3 rounded-xl bg-muted border border-input transition-colors overflow-y-auto whitespace-pre-wrap break-words"
                role="textbox"
                aria-readonly="true"
              />
              <Button
                onClick={toggleRecording}
                variant={isRecording ? "default" : "outline"}
                size="lg"
                className="w-full rounded-full"
              >
                {isRecording ? "Stop Recording" : "Start Recording"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}