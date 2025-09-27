// src/components/pages/DeadlinesPage.tsx
import React, { useState } from 'react';
import { Calendar, AlertCircle, Clock, CheckCircle, Flag } from 'lucide-react';
import Button from '../Button';

export default function DeadlinesPage() {
  const [deadlines] = useState([
    { 
      id: 1, 
      title: "React Project Final Submission", 
      dueDate: "2025-01-15", 
      dueTime: "11:59 PM",
      priority: "high", 
      status: "pending",
      timeLeft: "3 days"
    },
    { 
      id: 2, 
      title: "Marketing Campaign Review", 
      dueDate: "2025-01-18", 
      dueTime: "2:00 PM",
      priority: "medium", 
      status: "in-progress",
      timeLeft: "6 days"
    },
    { 
      id: 3, 
      title: "Client Presentation Prep", 
      dueDate: "2025-01-12", 
      dueTime: "9:00 AM",
      priority: "high", 
      status: "completed",
      timeLeft: "Completed"
    },
    { 
      id: 4, 
      title: "Blog Post Draft", 
      dueDate: "2025-01-25", 
      dueTime: "5:00 PM",
      priority: "low", 
      status: "pending",
      timeLeft: "13 days"
    },
  ]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-600 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-600 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-600 border-green-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-600';
      case 'in-progress': return 'bg-blue-100 text-blue-600';
      case 'pending': return 'bg-orange-100 text-orange-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'in-progress': return <Clock className="w-4 h-4" />;
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const upcomingDeadlines = deadlines.filter(d => d.status !== 'completed');
  const completedDeadlines = deadlines.filter(d => d.status === 'completed');

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
                <p className="text-3xl font-bold text-red-600">2</p>
              </div>
              <AlertCircle className="w-10 h-10 text-red-500" />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/50 hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">This Week</p>
                <p className="text-3xl font-bold text-orange-600">3</p>
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
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Upcoming Deadlines</h2>
            <Button>Add New Deadline</Button>
          </div>

          <div className="space-y-4">
            {upcomingDeadlines.map((deadline) => (
              <div key={deadline.id} className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border border-white/50 hover:shadow-lg transition-all">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold">{deadline.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(deadline.priority)}`}>
                        {deadline.priority}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(deadline.status)}`}>
                        {getStatusIcon(deadline.status)}
                        {deadline.status}
                      </span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {deadline.dueDate} at {deadline.dueTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {deadline.timeLeft} remaining
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button variant="secondary" size="sm">Edit</Button>
                    <Button size="sm">Mark Complete</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Completed Deadlines */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Recently Completed</h2>
          <div className="space-y-4">
            {completedDeadlines.map((deadline) => (
              <div key={deadline.id} className="bg-white/60 backdrop-blur-lg rounded-2xl p-6 border border-white/50 opacity-75">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold line-through text-gray-600">{deadline.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(deadline.status)}`}>
                        {getStatusIcon(deadline.status)}
                        Completed
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Completed on {deadline.dueDate}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button variant="secondary" size="sm">View Details</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}