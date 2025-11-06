
// FIX: Added React import to make the JSX namespace available.
import React from 'react';

export interface Lesson {
  id: string;
  title: string;
  description: string;
  systemInstruction: string;
  icon: JSX.Element;
}

export interface TranscriptMessage {
  id: number;
  speaker: 'user' | 'ai';
  text: string;
}