
import React from 'react';

interface AudioVisualizerProps {
  isSpeaking: boolean;
  isAIResponding: boolean;
}

const Bar: React.FC<{ height: string, className?: string }> = ({ height, className = '' }) => (
  <div
    className={`w-1.5 rounded-full bg-teal-400 transition-all duration-150 ease-in-out ${className}`}
    style={{ height }}
  />
);

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ isSpeaking, isAIResponding }) => {
  const isActive = isSpeaking || isAIResponding;
  const statusText = isAIResponding ? "AI is speaking..." : isSpeaking ? "Listening..." : "Idle";
  const statusColor = isAIResponding ? "text-indigo-400" : isSpeaking ? "text-teal-400" : "text-gray-500";

  return (
    <div className="flex flex-col items-center justify-center p-2 bg-gray-800 rounded-lg">
        <div className="flex items-center justify-center space-x-1 h-10">
            <Bar height={isActive ? (isAIResponding ? '1.5rem' : '2.5rem') : '0.5rem'} />
            <Bar height={isActive ? '1rem' : '0.5rem'} />
            <Bar height={isActive ? (isSpeaking ? '2.5rem' : '1.5rem') : '0.5rem'} />
            <Bar height={isActive ? '1.75rem' : '0.5rem'} />
            <Bar height={isActive ? '2rem' : '0.5rem'} />
        </div>
        <p className={`mt-2 text-sm font-medium transition-colors duration-300 ${statusColor}`}>{statusText}</p>
    </div>
  );
};

export default AudioVisualizer;
