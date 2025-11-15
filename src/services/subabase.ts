// src/services/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface Task {
  id: number;
  user_id: string;
  title: string;
  progress: number;
  due_date: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  completed: boolean;
  subtasks?: string[];
  time_estimate: number;
  file_name?: string;
  file_url?: string;
  created_at: string;
  updated_at: string;
}

// Helper to get current user identifier (using email from localStorage or a session)
export const getCurrentUserId = (): string => {
  // For now, use localStorage. In production, use proper auth
  if (typeof window === 'undefined') return 'anonymous';
  return localStorage.getItem('userEmail') || 'demo-user@example.com';
};

// Fetch all tasks for current user
export const fetchTasks = async (): Promise<Task[]> => {
  if (!supabase) throw new Error('Supabase not initialized');
  
  const userId = getCurrentUserId();
  
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .order('due_date', { ascending: true });
  
  if (error) throw error;
  return data || [];
};

// Add a new task
export const addTask = async (task: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Task> => {
  if (!supabase) throw new Error('Supabase not initialized');
  
  const userId = getCurrentUserId();
  
  const { data, error } = await supabase
    .from('tasks')
    .insert([{
      ...task,
      user_id: userId,
    }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Update a task
export const updateTask = async (id: number, updates: Partial<Task>): Promise<Task> => {
  if (!supabase) throw new Error('Supabase not initialized');
  
  const { data, error } = await supabase
    .from('tasks')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Delete a task
export const deleteTask = async (id: number): Promise<void> => {
  if (!supabase) throw new Error('Supabase not initialized');
  
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Toggle task completion
export const toggleTaskComplete = async (id: number, completed: boolean): Promise<Task> => {
  return updateTask(id, { completed });
};

// Update task progress
export const updateTaskProgress = async (id: number, progress: number): Promise<Task> => {
  return updateTask(id, { progress });
};

// Upload file (simplified - you'll need storage bucket setup)
export const uploadTaskFile = async (taskId: number, file: File): Promise<Task> => {
  if (!supabase) throw new Error('Supabase not initialized');
  
  // For now, just store the filename
  // In production, upload to Supabase Storage and store the URL
  return updateTask(taskId, { 
    file_name: file.name,
    // file_url: uploadedUrl // Add this after setting up storage
  });
};