
import React, { useRef, useEffect } from 'react';
import { Lesson, TranscriptMessage } from '../types';
import { useGeminiLive } from '../hooks/useGeminiLive';
import AudioVisualizer from './AudioVisualizer';

interface ConversationViewProps {
  lesson: Lesson;
  onBack: () => void;
}

const ConversationView: React.FC<ConversationViewProps> = ({ lesson, onBack }) => {
  const {
    isSessionActive,
    transcript,
    error,
    startSession,
    stopSession,
    isMuted,
    toggleMute,
    isSpeaking,
    isAIResponding
  } = useGeminiLive({ systemInstruction: lesson.systemInstruction });
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);
  
  const handleStart = async () => {
    try {
        await startSession();
    } catch (e) {
        console.error("Failed to start session:", e);
    }
  };

  return (
    <div className="flex flex-col h-[70vh] max-h-[800px]">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold text-teal-400">{lesson.title}</h2>
          <p className="text-gray-400">{lesson.description}</p>
        </div>
        <button
          onClick={onBack}
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          &larr; Back to Lessons
        </button>
      </div>

      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden">
        {/* Left Panel: Video and Controls */}
        <div className="flex flex-col bg-gray-900/50 rounded-xl p-4">
          <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-lg mb-4">
            <video
                src="https://storage.googleapis.com/generative-ai-web-apps/eng-tutor-vid.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              ></video>
              <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-semibold">
                AI English Teacher
              </div>
          </div>
          <div className="mt-auto space-y-4">
             <AudioVisualizer isSpeaking={isSpeaking} isAIResponding={isAIResponding} />
             {error && <p className="text-red-400 text-center">{error}</p>}
            <div className="flex items-center justify-center space-x-4">
              {!isSessionActive ? (
                <button
                  onClick={handleStart}
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-full transition-transform transform hover:scale-105"
                >
                  Start Lesson
                </button>
              ) : (
                <button
                  onClick={stopSession}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full transition-transform transform hover:scale-105"
                >
                  End Session
                </button>
              )}
               <button onClick={toggleMute} className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors">
                  {isMuted ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M20 4a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                  )}
                </button>
            </div>
          </div>
        </div>
        {/* Right Panel: Transcript */}
        <div className="bg-gray-900/50 rounded-xl flex flex-col p-4">
          <h3 className="text-xl font-semibold mb-4 text-gray-300">Conversation Transcript</h3>
          <div className="flex-grow overflow-y-auto pr-2 space-y-4">
            {transcript.map((msg: TranscriptMessage) => (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${msg.speaker === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs md:max-w-sm lg:max-w-md p-3 rounded-2xl ${
                    msg.speaker === 'user'
                      ? 'bg-teal-600 rounded-br-none'
                      : 'bg-gray-700 rounded-bl-none'
                  }`}
                >
                  <p className="text-base">{msg.text}</p>
                </div>
              </div>
            ))}
            {transcript.length === 0 && (
                <div className="flex items-center justify-center h-full text-gray-500">
                    <p>Your conversation will appear here. Press "Start Lesson" to begin.</p>
                </div>
            )}
            <div ref={transcriptEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationView;
