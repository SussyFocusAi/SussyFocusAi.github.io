// src/context/AppContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Task {
  id: number;
  title: string;
  progress: number;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  category: string;
  subtasks?: string[];
  timeEstimate?: number;
  file?: File;
}

interface AppContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: number, updates: Partial<Task>) => void;
  deleteTask: (id: number) => void;
  toggleComplete: (id: number) => void;
  uploadFile: (taskId: number, file: File) => void;
  updateProgress: (id: number, progress: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([
    { 
      id: 1, 
      title: "Complete React Project", 
      progress: 75, 
      dueDate: "2025-01-15", 
      priority: "high", 
      completed: false, 
      category: "work",
      subtasks: ["Setup project", "Build components", "Testing"],
      timeEstimate: 180
    },
    { 
      id: 2, 
      title: "Study for Finals", 
      progress: 45, 
      dueDate: "2025-01-20", 
      priority: "high", 
      completed: false, 
      category: "education",
      subtasks: ["Review notes", "Practice problems"],
      timeEstimate: 240
    },
    { 
      id: 3, 
      title: "Write Blog Post", 
      progress: 20, 
      dueDate: "2025-01-18", 
      priority: "medium", 
      completed: false, 
      category: "personal",
      subtasks: ["Outline", "Draft", "Edit"],
      timeEstimate: 120
    },
    { 
      id: 4, 
      title: "Plan Weekend Trip", 
      progress: 90, 
      dueDate: "2025-01-12", 
      priority: "low", 
      completed: false, 
      category: "personal",
      subtasks: ["Book hotel", "Plan itinerary"],
      timeEstimate: 60
    }
  ]);

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask = {
      ...task,
      id: Date.now()
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (id: number, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
  };

  const deleteTask = (id: number) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const toggleComplete = (id: number) => {
    setTasks(prev => prev.map(task =>
      task.id === id 
        ? { ...task, completed: !task.completed, progress: !task.completed ? 100 : task.progress }
        : task
    ));
  };

  const uploadFile = (taskId: number, file: File) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, file } : task
    ));
  };

  const updateProgress = (id: number, progress: number) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, progress: Math.min(100, Math.max(0, progress)) } : task
    ));
  };

  return (
    <AppContext.Provider value={{
      tasks,
      addTask,
      updateTask,
      deleteTask,
      toggleComplete,
      uploadFile,
      updateProgress
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}