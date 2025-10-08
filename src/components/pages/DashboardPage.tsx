// src/components/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, Clock, TrendingUp, Plus, Target, Zap, X, Edit2, Trash2, Search, BarChart3, Bell, Brain, Trophy, Flame } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export default function Dashboard() {
  const { 
    tasks, 
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
  const [activeView, setActiveView] = useState('board');
  const [pomodoroMinutes, setPomodoroMinutes] = useState(25);
  const [pomodoroSeconds, setPomodoroSeconds] = useState(0);
  const [achievements] = useState([
    { id: 1, title: "First Task", description: "Complete your first task", unlocked: true, icon: "🎯" },
    { id: 2, title: "Early Bird", description: "Complete 5 tasks before noon", unlocked: false, icon: "🌅" },
    { id: 3, title: "Streak Master", description: "Maintain a 7-day streak", unlocked: true, icon: "🔥" },
    { id: 4, title: "Focus Champion", description: "Complete 10 focus sessions", unlocked: false, icon: "⚡" },
    { id: 5, title: "Century Club", description: "Complete 100 tasks total", unlocked: false, icon: "💯" }
  ]);

  const [weeklyData] = useState([
    { day: 'Mon', tasks: 8, focus: 120 },
    { day: 'Tue', tasks: 6, focus: 90 },
    { day: 'Wed', tasks: 10, focus: 150 },
    { day: 'Thu', tasks: 7, focus: 105 },
    { day: 'Fri', tasks: 9, focus: 135 },
    { day: 'Sat', tasks: 4, focus: 60 },
    { day: 'Sun', tasks: 5, focus: 75 }
  ]);

  const [notifications] = useState([
    { id: 1, text: "Task 'Complete React Project' is due tomorrow", time: "2 hours ago", type: "warning" },
    { id: 2, text: "You've completed 3 tasks today! 🎉", time: "4 hours ago", type: "success" },
    { id: 3, text: "New achievement unlocked: Streak Master!", time: "1 day ago", type: "achievement" }
  ]);

  const [newTask, setNewTask] = useState({
    title: '',
    dueDate: '',
    priority: 'medium',
    category: 'work',
    subtasks: [] as string[],
    timeEstimate: 60
  });

  const [currentSubtask, setCurrentSubtask] = useState('');

  const userName = "siigma";

  const completedTasks = tasks.filter(t => t.completed);
  const stats = {
    completedToday: completedTasks.length,
    totalTasks: tasks.length,
    focusTime: focusTime,
    streak: 7,
    productivity: Math.round((completedTasks.length / tasks.length) * 100) || 0,
    totalPoints: completedTasks.length * 10 + Math.floor(focusTime / 25) * 5
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isFocusing) {
      interval = setInterval(() => {
        if (pomodoroSeconds === 0) {
          if (pomodoroMinutes === 0) {
            setIsFocusing(false);
            setFocusTime(prev => prev + 25);
            setPomodoroMinutes(25);
            alert('Focus session complete! Take a break.');
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

  const addTask = () => {
    if (!newTask.title.trim()) return;
    
    contextAddTask({
      title: newTask.title,
      progress: 0,
      dueDate: newTask.dueDate,
      priority: newTask.priority as 'high' | 'medium' | 'low',
      category: newTask.category,
      completed: false,
      subtasks: newTask.subtasks,
      timeEstimate: newTask.timeEstimate
    });
    
    setNewTask({ title: '', dueDate: '', priority: 'medium', category: 'work', subtasks: [], timeEstimate: 60 });
    setShowAddModal(false);
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

  const updateTask = () => {
    if (!editingTask) return;
    contextUpdateTask(editingTask.id, editingTask);
    setEditingTask(null);
    setShowEditModal(false);
  };

  const deleteTask = (id: number) => {
    contextDeleteTask(id);
  };

  const toggleComplete = (id: number) => {
    contextToggleComplete(id);
  };

  const updateProgress = (id: number, progress: number) => {
    contextUpdateProgress(id, progress);
  };

  const startFocusSession = () => {
    setIsFocusing(true);
    setPomodoroMinutes(25);
    setPomodoroSeconds(0);
  };

  const stopFocusSession = () => {
    setIsFocusing(false);
    setPomodoroMinutes(25);
    setPomodoroSeconds(0);
  };

  const filteredTasks = tasks.filter(task => {
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

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'success': return 'bg-green-50 border-green-200';
      case 'achievement': return 'bg-purple-50 border-purple-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const Modal = ({ show, onClose, title, children }: any) => {
    if (!show) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
        <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">{title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>
          {children}
        </div>
      </div>
    );
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 pt-8 pb-12 px-4 sm:px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-2 rounded-xl">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">FocusAI Dashboard</h1>
              <p className="text-sm text-gray-600">Level {Math.floor(stats.totalPoints / 100)} • {stats.totalPoints} points</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowStats(!showStats)}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors relative"
            >
              <BarChart3 className="w-6 h-6 text-gray-600" />
            </button>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors relative"
            >
              <Bell className="w-6 h-6 text-gray-600" />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
          </div>
        </div>

        {/* Notifications Dropdown */}
        {showNotifications && (
          <div className="absolute right-4 top-20 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 p-4 z-40">
            <h3 className="font-bold mb-3">Notifications</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {notifications.map(notif => (
                <div key={notif.id} className={`p-3 rounded-lg border ${getNotificationColor(notif.type)}`}>
                  <p className="text-sm font-medium">{notif.text}</p>
                  <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats Modal */}
        <Modal show={showStats} onClose={() => setShowStats(false)} title="Weekly Analytics">
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-3">Tasks Completed</h4>
              <div className="flex items-end gap-2 h-32">
                {weeklyData.map((day, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div className="w-full bg-gradient-to-t from-purple-500 to-blue-500 rounded-t-lg hover:opacity-80 transition-opacity" 
                         style={{ height: `${(day.tasks / 10) * 100}%` }}>
                    </div>
                    <span className="text-xs mt-2 text-gray-600">{day.day}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Focus Time (minutes)</h4>
              <div className="flex items-end gap-2 h-32">
                {weeklyData.map((day, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div className="w-full bg-gradient-to-t from-orange-500 to-yellow-500 rounded-t-lg hover:opacity-80 transition-opacity" 
                         style={{ height: `${(day.focus / 150) * 100}%` }}>
                    </div>
                    <span className="text-xs mt-2 text-gray-600">{day.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>

        {/* Welcome Banner */}
        {showWelcome && (
          <div className="mb-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-3 rounded-full">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-1">
                      Welcome to FocusAI, {userName}!
                    </h2>
                    <p className="text-white/90">Your account is ready. Let's start achieving your goals together.</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowWelcome(false)}
                  className="text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">
            Welcome back, {userName}! <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Ready to focus?</span>
          </h1>
          <p className="text-lg text-gray-600">Here's your productivity overview for today</p>
        </div>

        {/* Pomodoro Timer Card */}
        {isFocusing && (
          <div className="mb-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-white shadow-xl">
            <div className="text-center">
              <Flame className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-4xl font-bold mb-2">
                {String(pomodoroMinutes).padStart(2, '0')}:{String(pomodoroSeconds).padStart(2, '0')}
              </h2>
              <p className="text-white/90 mb-4">Stay focused! You're doing great.</p>
              <button
                onClick={stopFocusSession}
                className="bg-white/20 hover:bg-white/30 px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Stop Session
              </button>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/50 hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <span className="text-2xl sm:text-3xl font-bold text-green-600">{stats.completedToday}</span>
            </div>
            <p className="text-sm text-gray-600">Completed</p>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/50 hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-8 h-8 text-blue-500" />
              <span className="text-2xl sm:text-3xl font-bold text-blue-600">{stats.totalTasks}</span>
            </div>
            <p className="text-sm text-gray-600">Total Tasks</p>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/50 hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 text-purple-500" />
              <span className="text-2xl sm:text-3xl font-bold text-purple-600">{stats.focusTime}m</span>
            </div>
            <p className="text-sm text-gray-600">Focus Time</p>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/50 hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-2">
              <Flame className="w-8 h-8 text-orange-500" />
              <span className="text-2xl sm:text-3xl font-bold text-orange-600">{stats.streak}</span>
            </div>
            <p className="text-sm text-gray-600">Day Streak</p>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/50 hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-cyan-500" />
              <span className="text-2xl sm:text-3xl font-bold text-cyan-600">{stats.productivity}%</span>
            </div>
            <p className="text-sm text-gray-600">Productivity</p>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/50 hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-2">
              <Trophy className="w-8 h-8 text-yellow-500" />
              <span className="text-2xl sm:text-3xl font-bold text-yellow-600">{stats.totalPoints}</span>
            </div>
            <p className="text-sm text-gray-600">XP Points</p>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Achievements</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {achievements.map(achievement => (
              <div
                key={achievement.id}
                className={`p-4 rounded-xl border-2 text-center transition-all ${
                  achievement.unlocked
                    ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300 hover:scale-105'
                    : 'bg-gray-50 border-gray-200 opacity-50'
                }`}
              >
                <div className="text-4xl mb-2">{achievement.icon}</div>
                <h3 className="font-semibold text-sm mb-1">{achievement.title}</h3>
                <p className="text-xs text-gray-600">{achievement.description}</p>
                {achievement.unlocked && (
                  <div className="mt-2 text-xs font-semibold text-yellow-600">Unlocked! ✓</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-2xl hover:scale-105 transition-transform shadow-lg text-left"
            >
              <Plus className="w-8 h-8 mb-3" />
              <h3 className="text-lg font-semibold mb-2">Add New Task</h3>
              <p className="text-sm opacity-90">Create a new task with AI assistance</p>
            </button>

            <button 
              onClick={isFocusing ? stopFocusSession : startFocusSession}
              className={`${isFocusing ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-blue-500 to-cyan-500'} text-white p-6 rounded-2xl hover:scale-105 transition-transform shadow-lg text-left`}
            >
              <Zap className="w-8 h-8 mb-3" />
              <h3 className="text-lg font-semibold mb-2">
                {isFocusing ? 'Stop Focus Session' : 'Start Focus Session'}
              </h3>
              <p className="text-sm opacity-90">
                {isFocusing ? 'Currently focusing...' : '25-minute Pomodoro timer'}
              </p>
            </button>

            <button className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 rounded-2xl hover:scale-105 transition-transform shadow-lg text-left">
              <Calendar className="w-8 h-8 mb-3" />
              <h3 className="text-lg font-semibold mb-2">View Schedule</h3>
              <p className="text-sm opacity-90">See your optimized daily schedule</p>
            </button>
          </div>
        </div>

        {/* View Selector */}
        <div className="mb-6 flex items-center gap-2">
          <button
            onClick={() => setActiveView('board')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeView === 'board' ? 'bg-purple-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            Board View
          </button>
          <button
            onClick={() => setActiveView('list')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeView === 'list' ? 'bg-purple-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            List View
          </button>
          <button
            onClick={() => setActiveView('calendar')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeView === 'calendar' ? 'bg-purple-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            Calendar View
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterPriority('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterPriority === 'all' ? 'bg-purple-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilterPriority('high')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterPriority === 'high' ? 'bg-red-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
            >
              High
            </button>
            <button
              onClick={() => setFilterPriority('medium')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterPriority === 'medium' ? 'bg-yellow-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
            >
              Medium
            </button>
            <button
              onClick={() => setFilterPriority('low')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterPriority === 'low' ? 'bg-green-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
            >
              Low
            </button>
          </div>
        </div>

        {/* Active Tasks */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Active Tasks ({filteredTasks.length})</h2>
          </div>

          {activeView === 'board' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['high', 'medium', 'low'].map(priority => (
                <div key={priority} className="bg-white/50 rounded-2xl p-4">
                  <h3 className="font-bold mb-4 capitalize flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${priority === 'high' ? 'bg-red-500' : priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`}></span>
                    {priority} Priority
                  </h3>
                  <div className="space-y-3">
                    {filteredTasks.filter(t => t.priority === priority).map(task => (
                      <div key={task.id} className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-2 mb-2">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggleComplete(task.id)}
                            className="w-5 h-5 mt-0.5 accent-purple-500 cursor-pointer"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm mb-1">{task.title}</h4>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Calendar className="w-3 h-3" />
                              {task.dueDate}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                              <Clock className="w-3 h-3" />
                              {task.timeEstimate}min
                            </div>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-blue-500 h-1.5 rounded-full"
                            style={{ width: `${task.progress}%` }}
                          ></div>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              setEditingTask(task);
                              setShowEditModal(true);
                            }}
                            className="flex-1 text-xs py-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="flex-1 text-xs py-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                    {filteredTasks.filter(t => t.priority === priority).length === 0 && (
                      <p className="text-sm text-gray-400 text-center py-4">No tasks</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeView === 'list' && (
            <div className="grid gap-4">
              {filteredTasks.length === 0 ? (
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-12 border border-white/50 text-center">
                  <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No tasks found</h3>
                  <p className="text-gray-500">Add a new task to get started!</p>
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <div key={task.id} className="bg-white/80 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-white/50 hover:shadow-lg transition-all">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggleComplete(task.id)}
                            className="w-5 h-5 mt-1 accent-purple-500 cursor-pointer"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                              <h3 className={`text-lg font-semibold ${task.completed ? 'line-through text-gray-400' : ''}`}>
                                {task.title}
                              </h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                              </span>
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600 border border-blue-200">
                                {task.category}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                Due {task.dueDate}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {task.timeEstimate}min
                              </span>
                              <span>{task.progress}% complete</span>
                            </div>
                            {task.subtasks && task.subtasks.length > 0 && (
                              <div className="mt-2">
                                <p className="text-xs font-semibold text-gray-500 mb-1">Subtasks:</p>
                                <div className="flex flex-wrap gap-1">
                                  {task.subtasks.map((subtask, idx) => (
                                    <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                      {subtask}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingTask(task);
                              setShowEditModal(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={task.progress}
                          onChange={(e) => updateProgress(task.id, parseInt(e.target.value))}
                          className="flex-1 accent-purple-500"
                        />
                        <span className="text-sm font-medium text-gray-600 w-12">{task.progress}%</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeView === 'calendar' && (
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/50">
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center font-semibold text-sm text-gray-600 py-2">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 35 }, (_, i) => {
                  const dayTasks = filteredTasks.filter(t => {
                    const taskDate = new Date(t.dueDate);
                    const cellDate = new Date(2025, 0, i - 2);
                    return taskDate.toDateString() === cellDate.toDateString();
                  });
                  
                  return (
                    <div key={i} className="aspect-square border border-gray-200 rounded-lg p-2 hover:bg-purple-50 transition-colors">
                      <div className="text-sm font-medium text-gray-700 mb-1">{i > 2 && i < 33 ? i - 2 : ''}</div>
                      {dayTasks.length > 0 && (
                        <div className="space-y-1">
                          {dayTasks.slice(0, 2).map(task => (
                            <div key={task.id} className="text-xs bg-purple-100 text-purple-700 px-1 py-0.5 rounded truncate">
                              {task.title}
                            </div>
                          ))}
                          {dayTasks.length > 2 && (
                            <div className="text-xs text-gray-500">+{dayTasks.length - 2} more</div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Completed Tasks */}
        {tasks.filter(t => t.completed).length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Completed Tasks 🎉</h2>
            <div className="grid gap-4">
              {tasks.filter(t => t.completed).map((task) => (
                <div key={task.id} className="bg-green-50/80 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <div>
                        <h3 className="text-lg font-semibold line-through text-gray-600">{task.title}</h3>
                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                          <span>+10 XP</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      <Modal show={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Task">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Task Title *</label>
            <input
              type="text"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter task title..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
            <input
              type="date"
              value={newTask.dueDate}
              onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Estimate (minutes)</label>
            <input
              type="number"
              value={newTask.timeEstimate}
              onChange={(e) => setNewTask({ ...newTask, timeEstimate: parseInt(e.target.value) || 60 })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              min="15"
              step="15"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <select
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={newTask.category}
              onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="work">Work</option>
              <option value="personal">Personal</option>
              <option value="education">Education</option>
              <option value="health">Health</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subtasks</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={currentSubtask}
                onChange={(e) => setCurrentSubtask(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSubtask()}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Add a subtask..."
              />
              <button
                onClick={addSubtask}
                className="px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            {newTask.subtasks.length > 0 && (
              <div className="space-y-1">
                {newTask.subtasks.map((subtask, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                    <span className="text-sm">{subtask}</span>
                    <button
                      onClick={() => removeSubtask(idx)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={addTask}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow"
          >
            Add Task
          </button>
        </div>
      </Modal>

      {/* Edit Task Modal */}
      <Modal show={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Task">
        {editingTask && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Task Title</label>
              <input
                type="text"
                value={editingTask.title}
                onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
              <input
                type="date"
                value={editingTask.dueDate}
                onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Estimate (minutes)</label>
              <input
                type="number"
                value={editingTask.timeEstimate}
                onChange={(e) => setEditingTask({ ...editingTask, timeEstimate: parseInt(e.target.value) || 60 })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                min="15"
                step="15"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={editingTask.priority}
                onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={editingTask.category}
                onChange={(e) => setEditingTask({ ...editingTask, category: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="education">Education</option>
                <option value="health">Health</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Progress: {editingTask.progress}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={editingTask.progress}
                onChange={(e) => setEditingTask({ ...editingTask, progress: parseInt(e.target.value) })}
                className="w-full accent-purple-500"
              />
            </div>
            <button
              onClick={updateTask}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow"
            >
              Update Task
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}