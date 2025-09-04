import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, MoreHorizontal, Calendar, Flag } from 'lucide-react';
import { db } from '../../lib/supabase';
import { TaskWithDetails } from '../../types';

const columns = [
  { id: 'todo', title: 'To Do', dotColor: 'bg-gray-500' },
  { id: 'in-progress', title: 'In Progress', dotColor: 'bg-yellow-500' },
  { id: 'review', title: 'Review', dotColor: 'bg-blue-500' },
  { id: 'completed', title: 'Completed', dotColor: 'bg-green-500' },
];

export const TaskBoard: React.FC = () => {
  const [tasks, setTasks] = useState<TaskWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedTask, setDraggedTask] = useState<string | null>(null);

  const fetchTasks = async () => {
    const { data, error } = await db.getTasks();
    if (data) setTasks(data as TaskWithDetails[]);
    if (error) console.error("Error fetching tasks:", error);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchTasks();

    const subscription = db.subscribeToTasks((payload) => {
      console.log('Task change received!', payload);
      fetchTasks();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': case 'urgent': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
      case 'low': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  const getTasksByStatus = (status: string) => tasks.filter(task => task.status === status);

  const handleDragStart = (taskId: string) => setDraggedTask(taskId);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    if (!draggedTask) return;

    const originalTasks = [...tasks];
    const taskToMove = tasks.find(t => t.id === draggedTask);
    if (!taskToMove || taskToMove.status === newStatus) return;

    // Optimistic update
    setTasks(prev => prev.map(t => t.id === draggedTask ? { ...t, status: newStatus as TaskWithDetails['status'] } : t));

    const { error } = await db.updateTask(draggedTask, { status: newStatus });
    if (error) {
      console.error("Failed to update task:", error);
      setTasks(originalTasks); // Revert on failure
    }
    setDraggedTask(null);
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-header font-semibold text-charcoal-900 dark:text-white mb-2">Task Board</h1>
          <p className="text-charcoal-600 dark:text-gray-400">Manage your team's workflow with drag-and-drop simplicity</p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-gradient-to-r from-accent-teal to-accent-teal-dark text-white px-6 py-3 rounded-xl font-medium hover:shadow-hover dark:hover:shadow-dark-hover transition-all shadow-soft dark:shadow-dark-soft flex items-center space-x-2">
          <Plus size={20} />
          <span>New Task</span>
        </motion.button>
      </div>

      {loading ? (
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-teal"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 flex-1">
          {columns.map((column) => (
            <div key={column.id} className="bg-white dark:bg-dark-800 rounded-2xl shadow-soft dark:shadow-dark-soft p-4 flex flex-col border border-transparent dark:border-dark-600" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, column.id)}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${column.dotColor}`} />
                  <h2 className="font-semibold text-charcoal-900 dark:text-white capitalize">{column.title}</h2>
                  <span className="bg-sand-100 dark:bg-dark-700 text-charcoal-600 dark:text-gray-400 text-xs px-2 py-1 rounded-lg">{getTasksByStatus(column.id).length}</span>
                </div>
                <button className="p-1 hover:bg-sand-100 dark:hover:bg-dark-700 rounded-lg transition-colors"><MoreHorizontal size={16} className="text-charcoal-500 dark:text-gray-500" /></button>
              </div>
              <div className="space-y-3 flex-1 overflow-y-auto">
                {getTasksByStatus(column.id).map((task, index) => (
                  <motion.div key={task.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} draggable onDragStart={() => handleDragStart(task.id)} className="bg-sand-50 dark:bg-dark-700 rounded-xl p-4 cursor-move hover:shadow-soft dark:hover:shadow-dark-soft transition-shadow border border-sand-200 dark:border-dark-600 hover:border-accent-teal dark:hover:border-accent-teal-dark">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-medium text-charcoal-900 dark:text-white text-sm">{task.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded-lg capitalize ${getPriorityColor(task.priority)}`}><Flag size={10} className="inline mr-1" />{task.priority}</span>
                    </div>
                    <p className="text-charcoal-600 dark:text-gray-400 text-xs mb-3 line-clamp-2">{task.description}</p>
                    <div className="flex items-center justify-between text-xs text-charcoal-500 dark:text-gray-500">
                      <div className="flex items-center space-x-1"><Calendar size={12} /><span>{task.due_date ? new Date(task.due_date).toLocaleDateString() : 'N/A'}</span></div>
                      {task.assigned_to_profile && (
                        <div className="flex items-center space-x-1">
                          <img src={task.assigned_to_profile.avatar_url || ''} alt={task.assigned_to_profile.full_name} className="w-5 h-5 rounded-full border border-white dark:border-dark-700" />
                          <span className="text-xs">{task.assigned_to_profile.full_name.split(' ')[0]}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full border-2 border-dashed border-sand-200 dark:border-dark-600 rounded-xl p-4 text-charcoal-500 dark:text-gray-500 hover:border-accent-teal dark:hover:border-accent-teal-dark hover:text-accent-teal dark:hover:text-accent-teal-dark transition-colors flex items-center justify-center space-x-2">
                  <Plus size={16} />
                  <span className="text-sm">Add Task</span>
                </motion.button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
