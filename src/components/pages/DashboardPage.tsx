// src/components/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, Clock, TrendingUp, Plus, Target, Zap, X, Edit2, Trash2, Search, BarChart3, Bell, Brain, Trophy, Flame, Loader2, Sparkles, Award, Coffee } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export default function Dashboard() {
  const { 
    tasks, 
    loading,
    error,
    addTask: contextAddTask, 
    updateTask: contextUpdateTask, 
    deleteTask: contextDeleteTask, 
    toggleComplete: contextToggleComplete,
    updateProgress: contextUpdateProgress 
  } = useAppContext();

  const [showWelcome, setShowWelcome] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [focusTime, setFocusTime] = useState(185);
  const [isFocusing, setIsFocusing] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [activeView, setActiveView] = useState('list');
  const [pomodoroMinutes, setPomodoroMinutes] = useState(25);
  const [pomodoroSeconds, setPomodoroSeconds] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userName, setUserName] = useState('User');
  const [taskAddedAnimation, setTaskAddedAnimation] = useState(false);

  const [newTask, setNewTask] = useState({
    title: '',
    dueDate: '',
    priority: 'medium',
    category: 'work',
    subtasks: [] as string[],
    timeEstimate: 60
  });

  const [currentSubtask, setCurrentSubtask] = useState('');

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '☀️ Good Morning';
    if (hour < 18) return '🌤️ Good Afternoon';
    return '🌙 Good Evening';
  };

  // Load user name from localStorage
  useEffect(() => {
    const savedName = localStorage.getItem('userName') || 'User';
    setUserName(savedName);
  }, []);

  // Convert database format to display format
  const convertedTasks = tasks.map(t => ({
    ...t,
    dueDate: t.due_date || t.dueDate,
    timeEstimate: t.time_estimate || t.timeEstimate || 60
  }));

  const completedTasks = convertedTasks.filter(t => t.completed);
  const stats = {
    completedToday: completedTasks.length,
    totalTasks: convertedTasks.length,
    focusTime: focusTime,
    streak: 7,
    productivity: Math.round((completedTasks.length / convertedTasks.length) * 100) || 0,
    totalPoints: completedTasks.length * 10 + Math.floor(focusTime / 25) * 5
  };

  // Pomodoro timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isFocusing) {
      interval = setInterval(() => {
        if (pomodoroSeconds === 0) {
          if (pomodoroMinutes === 0) {
            setIsFocusing(false);
            setFocusTime(prev => prev + 25);
            setPomodoroMinutes(25);
            alert('🎉 Focus session complete! Take a break.');
          } else {
            setPomodoroMinutes(prev => prev - 1);
            setPomodoroSeconds(59);
          }
        } else {
          setPomodoroSeconds(prev => prev - 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isFocusing, pomodoroMinutes, pomodoroSeconds]);

  const addTask = async () => {
    if (!newTask.title.trim()) {
      alert('⚠️ Please enter a task title');
      return;
    }
    
    if (!newTask.dueDate) {
      alert('⚠️ Please select a due date');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await contextAddTask({
        title: newTask.title,
        progress: 0,
        dueDate: newTask.dueDate,
        priority: newTask.priority as 'high' | 'medium' | 'low',
        category: newTask.category,
        completed: false,
        subtasks: newTask.subtasks,
        timeEstimate: newTask.timeEstimate
      });
      
      // Success animation
      setTaskAddedAnimation(true);
      setTimeout(() => setTaskAddedAnimation(false), 2000);
      
      setNewTask({ 
        title: '', 
        dueDate: '', 
        priority: 'medium', 
        category: 'work', 
        subtasks: [], 
        timeEstimate: 60 
      });
      setShowAddModal(false);
    } catch (err: any) {
      alert('❌ Failed to add task: ' + (err.message || 'Unknown error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateTask = async () => {
    if (!editingTask) return;
    
    if (!editingTask.title?.trim()) {
      alert('⚠️ Please enter a task title');
      return;
    }

    if (!editingTask.dueDate) {
      alert('⚠️ Please select a due date');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await contextUpdateTask(editingTask.id, {
        title: editingTask.title,
        due_date: editingTask.dueDate,
        priority: editingTask.priority,
        category: editingTask.category,
        time_estimate: editingTask.timeEstimate,
        progress: editingTask.progress
      });
      
      setEditingTask(null);
      setShowEditModal(false);
    } catch (err: any) {
      alert('❌ Failed to update task: ' + (err.message || 'Unknown error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteTask = async (id: number) => {
    if (!confirm('🗑️ Are you sure you want to delete this task?')) return;
    
    try {
      await contextDeleteTask(id);
    } catch (err) {
      alert('❌ Failed to delete task');
    }
  };

  const toggleComplete = async (id: number) => {
    try {
      await contextToggleComplete(id);
      setTaskAddedAnimation(true);
      setTimeout(() => setTaskAddedAnimation(false), 2000);
    } catch (err) {
      alert('❌ Failed to update task');
    }
  };

  const updateProgress = async (id: number, progress: number) => {
    try {
      await contextUpdateProgress(id, progress);
    } catch (err) {
      alert('❌ Failed to update progress');
    }
  };

  const addSubtask = () => {
    if (currentSubtask.trim()) {
      setNewTask({ ...newTask, subtasks: [...newTask.subtasks, currentSubtask] });
      setCurrentSubtask('');
    }
  };

  const removeSubtask = (index: number) => {
    setNewTask({ ...newTask, subtasks: newTask.subtasks.filter((_, i) => i !== index) });
  };

  const filteredTasks = convertedTasks.filter(task => {
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPriority && matchesSearch && !task.completed;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-600 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-600 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-600 border-green-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const Modal = ({ show, onClose, title, children }: any) => {
    if (!show) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fade-in" onClick={onClose}>
        <div className="bg-white rounded-2xl p-4 sm:p-6 max-w-md w-full max-h-[90vh] overflow-y-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg sm:text-xl font-bold">{title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors" disabled={isSubmitting}>
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
          {children}
        </div>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="relative">
            <Loader2 className="w-16 h-16 sm:w-20 sm:h-20 animate-spin text-purple-600 mx-auto mb-4" />
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 absolute top-0 right-1/3 animate-pulse" />
          </div>
          <p className="text-gray-600 text-lg sm:text-xl font-medium">Loading your workspace...</p>
          <p className="text-gray-400 text-sm mt-2">Preparing your tasks and goals</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center px-4">
        <div className="text-center bg-white rounded-2xl p-6 sm:p-8 shadow-xl max-w-md w-full">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-xl sm:text-2xl font-bold mb-2">Oops! Something went wrong</h2>
          <p className="text-red-600 mb-6 text-sm sm:text-base">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all transform hover:scale-105 w-full sm:w-auto"
          >
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 pt-4 sm:pt-8 pb-12 px-3 sm:px-4 lg:px-6">
      {/* Success Animation */}
      {taskAddedAnimation && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <div className="bg-green-500 text-white px-4 sm:px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold text-sm sm:text-base">Success! 🎉</span>
          </div>
        </div>
      )}

      <div className="container mx-auto max-w-7xl">
        {/* Welcome Banner */}
        {showWelcome && (
          <div className="mb-6 sm:mb-8 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-2xl p-4 sm:p-6 text-white shadow-xl relative overflow-hidden animate-fade-in">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="bg-white/20 p-2 sm:p-3 rounded-full animate-bounce">
                    <Sparkles className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold mb-1">
                      Welcome to FocusAI!
                    </h2>
                    <p className="text-white/90 text-sm sm:text-base">Your productivity journey starts now 🚀</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowWelcome(false)}
                  className="text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors self-end sm:self-auto"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold">
              {getGreeting()}, <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">{userName}!</span>
            </h1>
            <div className="flex items-center gap-2">
              <div className="bg-white/80 backdrop-blur px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold text-purple-600 flex items-center gap-1.5">
                <Award className="w-3 h-3 sm:w-4 sm:h-4" />
                Level {Math.floor(stats.totalPoints / 100)}
              </div>
              <div className="bg-white/80 backdrop-blur px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold text-yellow-600 flex items-center gap-1.5">
                <Trophy className="w-3 h-3 sm:w-4 sm:h-4" />
                {stats.totalPoints} XP
              </div>
            </div>
          </div>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600">Ready to crush your goals today?</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          <div className="bg-white/80 backdrop-blur-lg rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-white/50 hover:scale-105 transition-transform cursor-pointer">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1 sm:mb-2">
              <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
              <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600">{stats.completedToday}</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600">Completed</p>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-white/50 hover:scale-105 transition-transform cursor-pointer">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1 sm:mb-2">
              <Target className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
              <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600">{stats.totalTasks}</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600">Total Tasks</p>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-white/50 hover:scale-105 transition-transform cursor-pointer">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1 sm:mb-2">
              <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />
              <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-600">{stats.focusTime}m</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600">Focus Time</p>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-white/50 hover:scale-105 transition-transform cursor-pointer">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1 sm:mb-2">
              <Flame className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
              <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-600">{stats.streak}</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600">Day Streak</p>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-white/50 hover:scale-105 transition-transform cursor-pointer">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1 sm:mb-2">
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-500" />
              <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-cyan-600">{stats.productivity}%</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600">Productivity</p>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 border border-white/50 hover:scale-105 transition-transform cursor-pointer">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1 sm:mb-2">
              <Coffee className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
              <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-yellow-600">{Math.floor(stats.focusTime / 25)}</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600">Sessions</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            Quick Actions
          </h2>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 sm:p-6 rounded-xl sm:rounded-2xl hover:scale-105 transition-all shadow-lg text-left w-full group"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="bg-white/20 p-2 sm:p-3 rounded-lg group-hover:rotate-90 transition-transform">
                <Plus className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-1">Add New Task</h3>
                <p className="text-xs sm:text-sm opacity-90">Create and track your next goal</p>
              </div>
            </div>
          </button>
        </div>

        {/* Filters */}
        <div className="mb-4 sm:mb-6 flex flex-col gap-3 sm:gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['all', 'high', 'medium', 'low'].map(priority => (
              <button
                key={priority}
                onClick={() => setFilterPriority(priority)}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-medium transition-all text-xs sm:text-sm ${
                  filterPriority === priority 
                    ? 'bg-purple-500 text-white shadow-md scale-105' 
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Active Tasks */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
            <Target className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            Active Tasks ({filteredTasks.length})
          </h2>

          {filteredTasks.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-lg rounded-xl sm:rounded-2xl p-8 sm:p-12 border border-white/50 text-center animate-fade-in">
              <div className="text-6xl sm:text-8xl mb-4">🎯</div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No tasks found</h3>
              <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6">Ready to start your productivity journey?</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:shadow-lg transition-all transform hover:scale-105 text-sm sm:text-base inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                Add Your First Task
              </button>
            </div>
          ) : (
            <div className="grid gap-3 sm:gap-4">
              {filteredTasks.map((task, index) => (
                <div 
                  key={task.id} 
                  className="bg-white/80 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/50 hover:shadow-xl transition-all animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleComplete(task.id)}
                      className="w-5 h-5 sm:w-6 sm:h-6 mt-0.5 accent-purple-500 cursor-pointer flex-shrink-0"
                    />
                    <div className="flex-1 w-full min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <h3 className="text-base sm:text-lg font-semibold truncate">{task.title}</h3>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)} whitespace-nowrap`}>
                            {task.priority}
                          </span>
                          <span className="px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600 border border-blue-200 whitespace-nowrap">
                            {task.category}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                          {task.dueDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                          {task.timeEstimate}min
                        </span>
                      </div>
                      <div className="flex items-center gap-3 sm:gap-4">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={task.progress}
                          onChange={(e) => updateProgress(task.id, parseInt(e.target.value))}
                          className="flex-1 accent-purple-500 h-2 cursor-pointer"
                        />
                        <span className="text-xs sm:text-sm font-bold text-purple-600 w-10 sm:w-12 text-right">{task.progress}%</span>
                      </div>
                    </div>
                    <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => {
                          setEditingTask(task);
                          setShowEditModal(true);
                        }}
                        className="flex-1 sm:flex-none p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4 sm:w-5 sm:h-5 mx-auto" />
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="flex-1 sm:flex-none p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5 mx-auto" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <div className="mt-6 sm:mt-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              Completed Tasks 🎉
            </h2>
            <div className="grid gap-3 sm:gap-4">
              {completedTasks.map((task, index) => (
                <div 
                  key={task.id} 
                  className="bg-green-50/80 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-green-200 animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1">
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0" />
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold line-through text-gray-600">{task.title}</h3>
                        <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500 mt-1 flex-wrap">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                          <span className="flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            +10 XP
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors self-end sm:self-auto"
                    >
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      <Modal show={showAddModal} onClose={() => !isSubmitting && setShowAddModal(false)} title="✨ Add New Task">
        <div className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Task Title *</label>
            <input
              type="text"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
              placeholder="What do you want to accomplish?"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Due Date *</label>
            <input
              type="date"
              value={newTask.dueDate}
              onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
              className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
              disabled={isSubmitting}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                disabled={isSubmitting}
              >
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={newTask.category}
                onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                disabled={isSubmitting}
              >
                <option value="work">💼 Work</option>
                <option value="personal">🏠 Personal</option>
                <option value="education">📚 Education</option>
                <option value="health">💪 Health</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Time Estimate (minutes)</label>
            <input
              type="number"
              value={newTask.timeEstimate}
              onChange={(e) => setNewTask({ ...newTask, timeEstimate: parseInt(e.target.value) || 60 })}
              className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
              min="15"
              step="15"
              disabled={isSubmitting}
            />
          </div>
          <button
            onClick={addTask}
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                Adding Task...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                Add Task
              </>
            )}
          </button>
        </div>
      </Modal>

      {/* Edit Task Modal */}
      <Modal show={showEditModal} onClose={() => !isSubmitting && setShowEditModal(false)} title="✏️ Edit Task">
        {editingTask && (
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Task Title *</label>
              <input
                type="text"
                value={editingTask.title}
                onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Due Date *</label>
              <input
                type="date"
                value={editingTask.dueDate}
                onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={editingTask.priority}
                onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                disabled={isSubmitting}
              >
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Progress: {editingTask.progress}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={editingTask.progress}
                onChange={(e) => setEditingTask({ ...editingTask, progress: parseInt(e.target.value) })}
                className="w-full accent-purple-500 h-2 cursor-pointer"
                disabled={isSubmitting}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
            <button
              onClick={updateTask}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  Updating Task...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  Update Task
                </>
              )}
            </button>
          </div>
        )}
      </Modal>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slide-in-right {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.4s ease-out backwards;
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}