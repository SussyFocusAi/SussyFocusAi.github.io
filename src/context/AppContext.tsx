// src/context/AppContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SupabaseService from '../services/subabase';
import type { Task } from '../services/subabase';

interface TaskInput {
  title: string;
  progress: number;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  completed: boolean;
  subtasks?: string[];
  timeEstimate: number;
}

interface AppContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  addTask: (task: TaskInput) => Promise<void>;
  updateTask: (id: number, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  toggleComplete: (id: number) => Promise<void>;
  updateProgress: (id: number, progress: number) => Promise<void>;
  uploadFile: (taskId: number, file: File) => Promise<void>;
  refreshTasks: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load tasks on mount
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedTasks = await SupabaseService.fetchTasks();
      setTasks(fetchedTasks);
    } catch (err) {
      console.error('Error loading tasks:', err);
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (taskInput: TaskInput) => {
    try {
      const newTask = await SupabaseService.addTask({
        title: taskInput.title,
        progress: taskInput.progress,
        due_date: taskInput.dueDate,
        priority: taskInput.priority,
        category: taskInput.category,
        completed: taskInput.completed,
        subtasks: taskInput.subtasks,
        time_estimate: taskInput.timeEstimate,
      });
      setTasks(prev => [...prev, newTask]);
    } catch (err) {
      console.error('Error adding task:', err);
      throw err;
    }
  };

  const updateTask = async (id: number, updates: Partial<Task>) => {
    try {
      const updatedTask = await SupabaseService.updateTask(id, updates);
      setTasks(prev => prev.map(t => t.id === id ? updatedTask : t));
    } catch (err) {
      console.error('Error updating task:', err);
      throw err;
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await SupabaseService.deleteTask(id);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
      throw err;
    }
  };

  const toggleComplete = async (id: number) => {
    try {
      const task = tasks.find(t => t.id === id);
      if (!task) return;
      
      const updatedTask = await SupabaseService.toggleTaskComplete(id, !task.completed);
      setTasks(prev => prev.map(t => t.id === id ? updatedTask : t));
    } catch (err) {
      console.error('Error toggling task:', err);
      throw err;
    }
  };

  const updateProgress = async (id: number, progress: number) => {
    try {
      const updatedTask = await SupabaseService.updateTaskProgress(id, progress);
      setTasks(prev => prev.map(t => t.id === id ? updatedTask : t));
    } catch (err) {
      console.error('Error updating progress:', err);
      throw err;
    }
  };

  const uploadFile = async (taskId: number, file: File) => {
    try {
      const updatedTask = await SupabaseService.uploadTaskFile(taskId, file);
      setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
    } catch (err) {
      console.error('Error uploading file:', err);
      throw err;
    }
  };

  const refreshTasks = async () => {
    await loadTasks();
  };

  return (
    <AppContext.Provider
      value={{
        tasks,
        loading,
        error,
        addTask,
        updateTask,
        deleteTask,
        toggleComplete,
        updateProgress,
        uploadFile,
        refreshTasks,
      }}
    >
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