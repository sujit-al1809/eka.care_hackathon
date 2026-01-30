"use client"
import { useEffect, useRef } from 'react';
import { useMicVAD, utils } from "@ricky0123/vad-react";
import { convertAudioToText } from '../services/speechToText';

interface VadAudioProcessorProps {
    isCallActive: boolean;
    onTranscriptReceived: (transcript: string, isFinal: boolean) => void;
    onError?: (error: string) => void;
    onSpeechStart?: () => void;
    onSpeechEnd?: () => void;
    onProcessingStart?: () => void;
    onProcessingEnd?: () => void;
}

const VadAudioProcessor = ({
    isCallActive,
    onTranscriptReceived,
    onError,
    onSpeechStart,
    onSpeechEnd,
    onProcessingStart,
    onProcessingEnd
}: VadAudioProcessorProps) => {

    // @ts-ignore - workletURL and modelURL are supported but missing in types
    const vad = useMicVAD({
        startOnLoad: false,
        // Load files from local public directory to avoid CDN/CORS/Bundler issues
        workletURL: "/vad/vad.worklet.bundle.min.js",
        modelURL: "/vad/silero_vad.onnx",
        ortConfig: (ort: any) => {
            ort.env.wasm.wasmPaths = "/vad/";
            ort.env.wasm.numThreads = 1; // Disable multi-threading to simplify WASM loading if needed
        },
        onSpeechStart: () => {
            if (!isCallActive) return;
            console.log("VAD: Speech started");
            onSpeechStart?.();
        },
        onSpeechEnd: async (audio) => {
            if (!isCallActive) return;

            console.log("VAD: Speech ended");
            onSpeechEnd?.();

            try {
                onProcessingStart?.();
                const wavBuffer = utils.encodeWAV(audio);
                const blob = new Blob([wavBuffer], { type: "audio/wav" });

                console.log("VAD: Sending audio for transcription...");
                const transcript = await convertAudioToText(blob);

                console.log("VAD: Transcript received:", transcript);
                if (transcript) {
                    onTranscriptReceived(transcript, true);
                }
            } catch (err: any) {
                console.error("VAD Processing Error:", err);
                // Only report error if it's not an abort/cancel or if call is still active
                if (isCallActive) {
                    onError?.(err.message || "Failed to process audio");
                }
            } finally {
                if (isCallActive) {
                    onProcessingEnd?.();
                }
            }
        },
        // Adjust VAD sensitivity
        positiveSpeechThreshold: 0.8,
        negativeSpeechThreshold: 0.60, // Hysteresis
        minSpeechFrames: 4,
        preSpeechPadFrames: 5,
        redemptionFrames: 8,
    });

    useEffect(() => {
        if (isCallActive) {
            if (!vad.listening && !vad.loading && !vad.errored) {
                console.log("VAD: Starting...");
                vad.start();
            }
        } else {
            if (vad.listening) {
                console.log("VAD: Pausing...");
                vad.pause();
            }
        }
        // Cleanup on unmount or when call becomes inactive handled by vad hook mostly, 
        // but explicit pause is good.
        return () => {
            if (vad.listening) vad.pause();
        }
    }, [isCallActive, vad]);

    // Handle errors from VAD
    useEffect(() => {
        if (vad.errored) {
            console.error("VAD Error:", vad.errored);
            onError?.("Voice Activity Detection Error");
        }
    }, [vad.errored, onError]);

    return null; // Logic only component
};

export default VadAudioProcessor;
