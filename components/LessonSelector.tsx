
import React from 'react';
import { Lesson } from '../types';

interface LessonSelectorProps {
  lessons: Lesson[];
  onSelectLesson: (lesson: Lesson) => void;
}

const LessonSelector: React.FC<LessonSelectorProps> = ({ lessons, onSelectLesson }) => {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-semibold mb-6 text-gray-200">Choose a Lesson to Start</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {lessons.map((lesson) => (
          <button
            key={lesson.id}
            onClick={() => onSelectLesson(lesson)}
            className="bg-gray-700/50 p-6 rounded-lg text-left hover:bg-teal-500/20 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-opacity-75"
          >
            <div className="flex items-center mb-3">
              {lesson.icon}
              <h3 className="text-xl font-bold ml-4 text-white">{lesson.title}</h3>
            </div>
            <p className="text-gray-400">{lesson.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LessonSelector;
