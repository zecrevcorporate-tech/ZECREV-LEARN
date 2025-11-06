
import React, { useState } from 'react';
// FIX: The 'Lesson' type is defined in 'types.ts', not 'constants.tsx'.
import { LESSONS } from './constants';
import { Lesson } from './types';
import LessonSelector from './components/LessonSelector';
import ConversationView from './components/ConversationView';

const App: React.FC = () => {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const handleSelectLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
  };

  const handleBackToLessons = () => {
    setSelectedLesson(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-teal-400">AI English Tutor</h1>
          <p className="text-gray-400 mt-2 text-lg">Your personal AI-powered spoken English teacher.</p>
        </header>
        
        <main className="bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8 w-full transition-all duration-500">
          {!selectedLesson ? (
            <LessonSelector lessons={LESSONS} onSelectLesson={handleSelectLesson} />
          ) : (
            <ConversationView lesson={selectedLesson} onBack={handleBackToLessons} />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;