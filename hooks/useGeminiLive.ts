
import { useState, useRef, useCallback } from 'react';
import { GoogleGenAI, LiveSession, LiveServerMessage, Modality, Blob } from '@google/genai';
import { TranscriptMessage } from '../types';
import { decode, encode, decodePcmAudioData } from '../utils/audioUtils';

// Audio Configuration
const INPUT_SAMPLE_RATE = 16000;
const OUTPUT_SAMPLE_RATE = 24000;
const BUFFER_SIZE = 4096;

interface UseGeminiLiveProps {
  systemInstruction: string;
}

export const useGeminiLive = ({ systemInstruction }: UseGeminiLiveProps) => {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAIResponding, setIsAIResponding] = useState(false);

  const aiRef = useRef<GoogleGenAI | null>(null);
  const sessionPromiseRef = useRef<Promise<LiveSession> | null>(null);

  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const microphoneStreamRef = useRef<MediaStream | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);

  const nextStartTimeRef = useRef(0);
  const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const currentInputTranscriptionRef = useRef('');
  const currentOutputTranscriptionRef = useRef('');

  const startSession = useCallback(async () => {
    setError(null);
    setTranscript([]);

    try {
      if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set.");
      }
      aiRef.current = new GoogleGenAI({ apiKey: process.env.API_KEY });

      inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: INPUT_SAMPLE_RATE });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: OUTPUT_SAMPLE_RATE });

      microphoneStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });

      sessionPromiseRef.current = aiRef.current.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          systemInstruction,
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
        },
        callbacks: {
          onopen: () => {
            const source = inputAudioContextRef.current!.createMediaStreamSource(microphoneStreamRef.current!);
            scriptProcessorRef.current = inputAudioContextRef.current!.createScriptProcessor(BUFFER_SIZE, 1, 1);

            scriptProcessorRef.current.onaudioprocess = (audioProcessingEvent) => {
                setIsSpeaking(true);
                const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                const l = inputData.length;
                const int16 = new Int16Array(l);
                for (let i = 0; i < l; i++) {
                    int16[i] = inputData[i] * 32768;
                }
                const pcmBlob: Blob = {
                    data: encode(new Uint8Array(int16.buffer)),
                    mimeType: `audio/pcm;rate=${INPUT_SAMPLE_RATE}`,
                };

                // Use the session promise to ensure we only send data after connection is established.
                sessionPromiseRef.current?.then((session) => {
                    session.sendRealtimeInput({ media: pcmBlob });
                });
            };

            source.connect(scriptProcessorRef.current);
            scriptProcessorRef.current.connect(inputAudioContextRef.current!.destination);
            setIsSessionActive(true);
          },
          onmessage: async (message: LiveServerMessage) => {
            setIsSpeaking(false);
            if (message.serverContent?.outputTranscription) {
                currentOutputTranscriptionRef.current += message.serverContent.outputTranscription.text;
            }
            if (message.serverContent?.inputTranscription) {
                currentInputTranscriptionRef.current += message.serverContent.inputTranscription.text;
            }
            if (message.serverContent?.turnComplete) {
                const userText = currentInputTranscriptionRef.current.trim();
                const aiText = currentOutputTranscriptionRef.current.trim();
                if (userText) {
                    setTranscript(prev => [...prev, { id: Date.now(), speaker: 'user', text: userText }]);
                }
                if (aiText) {
                    setTranscript(prev => [...prev, { id: Date.now() + 1, speaker: 'ai', text: aiText }]);
                }
                currentInputTranscriptionRef.current = '';
                currentOutputTranscriptionRef.current = '';
            }

            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && !isMuted) {
              setIsAIResponding(true);
              const audioBytes = decode(base64Audio);
              const audioBuffer = await decodePcmAudioData(audioBytes, outputAudioContextRef.current!, OUTPUT_SAMPLE_RATE, 1);
              
              const currentTime = outputAudioContextRef.current!.currentTime;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, currentTime);

              const source = outputAudioContextRef.current!.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputAudioContextRef.current!.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              
              audioSourcesRef.current.add(source);
              source.onended = () => {
                audioSourcesRef.current.delete(source);
                if (audioSourcesRef.current.size === 0) {
                    setIsAIResponding(false);
                }
              };
            }
          },
          onerror: (e) => {
            console.error("Session error:", e);
            setError('A session error occurred. Please try again.');
            stopSession();
          },
          onclose: () => {
             console.log("Session closed.");
          },
        },
      });

    } catch (e: any) {
      console.error("Failed to initialize session:", e);
      setError(`Initialization failed: ${e.message}. Please check permissions and API key.`);
    }
  }, [systemInstruction, isMuted]);

  const stopSession = useCallback(() => {
    setIsSpeaking(false);
    setIsAIResponding(false);
    
    // Stop microphone processing
    scriptProcessorRef.current?.disconnect();
    scriptProcessorRef.current = null;
    microphoneStreamRef.current?.getTracks().forEach((track) => track.stop());
    microphoneStreamRef.current = null;
    
    // Close audio contexts
    inputAudioContextRef.current?.close().catch(console.error);
    outputAudioContextRef.current?.close().catch(console.error);
    inputAudioContextRef.current = null;
    outputAudioContextRef.current = null;

    // Stop all playing audio
    audioSourcesRef.current.forEach(source => source.stop());
    audioSourcesRef.current.clear();
    nextStartTimeRef.current = 0;

    // Close Gemini session
    sessionPromiseRef.current?.then(session => session.close()).catch(console.error);
    sessionPromiseRef.current = null;
    
    setIsSessionActive(false);
  }, []);
  
  const toggleMute = () => {
    setIsMuted(prev => !prev);
    if (!isMuted) { // Muting now
        audioSourcesRef.current.forEach(source => source.stop());
        audioSourcesRef.current.clear();
        nextStartTimeRef.current = 0;
    }
  };


  return { isSessionActive, transcript, error, startSession, stopSession, isMuted, toggleMute, isSpeaking, isAIResponding };
};
