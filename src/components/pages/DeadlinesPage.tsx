// src/components/pages/DeadlinesPage.tsx
import React, { useState } from 'react';
import { Calendar, AlertCircle, Clock, CheckCircle, Upload, Flag } from 'lucide-react';
import Button from '../Button';
import { useAppContext } from '../../context/AppContext'; // ADD THIS

export default function DeadlinesPage() {
  const { tasks, toggleComplete, uploadFile } = useAppContext(); // ADD THIS
  
  // Calculate deadlines from actual tasks
  const upcomingDeadlines = tasks
    .filter(t => !t.completed)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  
  const completedDeadlines = tasks.filter(t => t.completed);

  const getUrgency = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const daysUntil = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntil < 0) return { text: 'Overdue!', color: 'bg-red-100 text-red-600', days: daysUntil };
    if (daysUntil === 0) return { text: 'Due Today', color: 'bg-orange-100 text-orange-600', days: 0 };
    if (daysUntil <= 3) return { text: `${daysUntil} days left`, color: 'bg-yellow-100 text-yellow-600', days: daysUntil };
    return { text: `${daysUntil} days`, color: 'bg-green-100 text-green-600', days: daysUntil };
  };

  const urgentCount = upcomingDeadlines.filter(t => {
    const urgency = getUrgency(t.dueDate);
    return urgency.days <= 3;
  }).length;

  const thisWeekCount = upcomingDeadlines.filter(t => {
    const urgency = getUrgency(t.dueDate);
    return urgency.days <= 7;
  }).length;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-600 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-600 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-600 border-green-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const handleFileUpload = (taskId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(taskId, file);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Deadlines</span> Overview
          </h1>
          <p className="text-lg text-gray-600">Stay on top of your important deadlines and never miss another due date</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/50 hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Urgent (Next 3 Days)</p>
                <p className="text-3xl font-bold text-red-600">{urgentCount}</p>
              </div>
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/50 hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">This Week</p>
                <p className="text-3xl font-bold text-orange-600">{thisWeekCount}</p>
              </div>
              <Calendar className="w-10 h-10 text-orange-500" />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/50 hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Completed</p>
                <p className="text-3xl font-bold text-green-600">{completedDeadlines.length}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Upcoming Deadlines</h2>

          <div className="space-y-4">
            {upcomingDeadlines.map((task) => {
              const urgency = getUrgency(task.dueDate);
              
              return (
                <div key={task.id} className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/50 hover:shadow-lg transition-all">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold">{task.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${urgency.color}`}>
                          {urgency.text}
                        </span>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-gray-600 mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Due {task.dueDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {task.timeEstimate || 60}min estimated
                        </span>
                        <span>{task.progress}% complete</span>
                      </div>

                      {/* File Upload/Display */}
                      {task.file ? (
                        <div className="flex items-center gap-2 text-sm text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          File: {task.file.name}
                        </div>
                      ) : (
                        <label className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-600 rounded-lg cursor-pointer hover:bg-purple-200 transition-colors text-sm">
                          <Upload className="w-4 h-4" />
                          Upload File
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => handleFileUpload(task.id, e)}
                          />
                        </label>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <Button
                        onClick={() => toggleComplete(task.id)}
                        size="sm"
                      >
                        Mark Complete
                      </Button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}

            {upcomingDeadlines.length === 0 && (
              <div className="text-center py-12 bg-white/50 rounded-2xl">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">All caught up!</h3>
                <p className="text-gray-500">No pending deadlines</p>
              </div>
            )}
          </div>
        </div>

        {/* Completed Deadlines */}
        {completedDeadlines.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Recently Completed</h2>
            <div className="space-y-4">
              {completedDeadlines.map((task) => (
                <div key={task.id} className="bg-green-50/80 backdrop-blur-lg rounded-2xl p-6 border border-green-200 opacity-75">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                        <h3 className="text-lg font-semibold line-through text-gray-600">{task.title}</h3>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Completed: {task.dueDate}
                        </span>
                        {task.file && (
                          <span className="flex items-center gap-1">
                            📎 {task.file.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}