
import React from 'react';
import { Lesson } from './types';

const GreetingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
  </svg>
);

const CoffeeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v2m0 12v2m8-8h-2M4 12H2m18 0a9 9 0 11-18 0 9 9 0 0118 0zm-9 6.732a7.732 7.732 0 000-13.464" />
    <path d="M14.5 12a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

const DirectionsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export const LESSONS: Lesson[] = [
  {
    id: 'greetings',
    title: 'Greetings & Introductions',
    description: 'Practice introducing yourself and having a simple conversation.',
    systemInstruction: 'You are a friendly English teacher. Start by greeting the user and asking their name. Keep the conversation simple and focused on introductions. Ask them where they are from and what they do. Correct any simple grammatical mistakes they make in a friendly way.',
    icon: <GreetingIcon />,
  },
  {
    id: 'coffee',
    title: 'Ordering Coffee',
    description: 'Learn how to order a drink at a coffee shop.',
    systemInstruction: 'You are a friendly barista at a coffee shop. The user wants to order a drink. Guide them through the process. Ask them what they would like, what size, and if they want anything else. Be friendly and patient.',
    icon: <CoffeeIcon />,
  },
  {
    id: 'directions',
    title: 'Asking for Directions',
    description: 'Practice asking for and understanding directions to a place.',
    systemInstruction: 'You are a helpful local person on the street. The user is lost and will ask you for directions to a place like a library, a park, or a train station. Provide simple, clear, step-by-step directions. After giving directions, ask them to repeat it back to you to ensure they understood.',
    icon: <DirectionsIcon />,
  },
];
