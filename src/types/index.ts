// src/types/index.ts

export interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  image?: string;
}

export interface Task {
  id: number;
  text: string;
  completed: boolean;
}

export interface SessionHistory {
    id: number;
    title: string;
    date: string;
}

export interface GeminiApiCallParams {
    userMessage: string;
    imageData?: string | null;
    messages: Message[];
    tasks: Task[];
    currentGoal: string;
}