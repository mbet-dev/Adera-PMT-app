import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Clock, CheckCircle } from 'lucide-react';
import { db } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { ProjectWithDetails, TaskWithDetails, Profile } from '../../types';

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center h-full">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-teal"></div>
  </div>
);

export const Dashboard: React.FC = () => {
  const { profile } = useAuth();
  const [projects, setProjects] = useState<ProjectWithDetails[]>([]);
  const [tasks, setTasks] = useState<TaskWithDetails[]>([]);
  const [team, setTeam] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [projectsRes, tasksRes, teamRes] = await Promise.all([
          db.getProjects(),
          db.getTasks(),
          db.getProfiles()
        ]);

        if (projectsRes.data) setProjects(projectsRes.data as ProjectWithDetails[]);
        if (tasksRes.data) setTasks(tasksRes.data as TaskWithDetails[]);
        if (teamRes.data) setTeam(teamRes.data);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { label: 'Active Projects', value: projects.filter(p => p.status === 'active').length, icon: TrendingUp, color: 'from-accent-teal to-accent-teal-dark' },
    { label: 'Team Members', value: team.length, icon: Users, color: 'from-accent-orange to-accent-orange-dark' },
    { label: 'Tasks Due', value: tasks.filter(t => t.status !== 'completed' && t.due_date && new Date(t.due_date) > new Date()).length, icon: Clock, color: 'from-red-500 to-red-600' },
    { label: 'Completed Tasks', value: tasks.filter(t => t.status === 'completed').length, icon: CheckCircle, color: 'from-green-500 to-green-600' },
  ];

  if (loading) {
    return (
      <div className="p-6 h-full">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-header font-semibold text-charcoal-900 dark:text-white mb-2">Welcome back, {profile?.full_name.split(' ')[0]}</h1>
        <p className="text-charcoal-600 dark:text-gray-400">Here's what's happening with your projects today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-dark-800 p-6 rounded-2xl shadow-soft dark:shadow-dark-soft hover:shadow-hover dark:hover:shadow-dark-hover transition-all duration-300 border border-transparent dark:border-dark-600"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-charcoal-500 dark:text-gray-400 text-sm font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-charcoal-900 dark:text-white mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-soft`}>
                <stat.icon size={24} className="text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-white dark:bg-dark-800 rounded-2xl shadow-soft dark:shadow-dark-soft p-6 border border-transparent dark:border-dark-600"
        >
          <h2 className="text-section font-semibold text-charcoal-900 dark:text-white mb-6">Recent Projects</h2>
          <div className="space-y-4">
            {projects.slice(0, 3).map((project) => (
              <div key={project.id} className="border border-sand-200 dark:border-dark-600 rounded-xl p-4 hover:bg-sand-50 dark:hover:bg-dark-700 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-charcoal-900 dark:text-white mb-1">{project.name}</h3>
                    <p className="text-charcoal-600 dark:text-gray-400 text-sm mb-3">{project.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-charcoal-500 dark:text-gray-500">
                      <span>{project.client_name}</span>
                      <span>•</span>
                      <span>Due {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-sm font-medium text-charcoal-900 dark:text-white">{project.progress}%</p>
                      <div className="w-16 h-2 bg-sand-200 dark:bg-dark-600 rounded-full mt-1">
                        <div className="h-full bg-gradient-to-r from-accent-teal to-accent-teal-dark rounded-full" style={{ width: `${project.progress}%` }} />
                      </div>
                    </div>
                    <div className="flex -space-x-2">
                      {project.project_members.slice(0, 3).map((member) => member.profiles && (
                        <img key={member.profiles.id} src={member.profiles.avatar_url || ''} alt={member.profiles.full_name} className="w-8 h-8 rounded-full border-2 border-white dark:border-dark-800" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-dark-800 rounded-2xl shadow-soft dark:shadow-dark-soft p-6 border border-transparent dark:border-dark-600"
        >
          <h2 className="text-section font-semibold text-charcoal-900 dark:text-white mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {/* This would require an activity log table, using tasks as a placeholder */}
            {tasks.slice(0, 3).map(task => (
               <div key={task.id} className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-accent-teal to-accent-teal-dark rounded-full flex items-center justify-center shadow-soft">
                  <CheckCircle size={16} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-charcoal-900 dark:text-white">
                    <span className="font-medium">{task.created_by_profile?.full_name}</span> created task in {task.project?.name}
                  </p>
                  <p className="text-xs text-charcoal-500 dark:text-gray-500 mt-1">{new Date(task.created_at).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-dark-800 rounded-2xl shadow-soft dark:shadow-dark-soft p-6 border border-transparent dark:border-dark-600"
      >
        <h2 className="text-section font-semibold text-charcoal-900 dark:text-white mb-6">Upcoming Deadlines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.filter(t => t.status !== 'completed').slice(0, 3).map((task) => (
            <div key={task.id} className="border border-sand-200 dark:border-dark-600 rounded-xl p-4 hover:bg-sand-50 dark:hover:bg-dark-700 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                  task.priority === 'high' || task.priority === 'urgent' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400' :
                  task.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400' :
                  'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                }`}>
                  {task.priority}
                </span>
                <span className="text-xs text-charcoal-500 dark:text-gray-500">
                  Due {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <h3 className="font-medium text-charcoal-900 dark:text-white mb-1">{task.title}</h3>
              <div className="flex items-center space-x-2 mt-3">
                {task.assigned_to_profile && (
                  <>
                    <img src={task.assigned_to_profile.avatar_url || ''} alt={task.assigned_to_profile.full_name} className="w-6 h-6 rounded-full" />
                    <span className="text-sm text-charcoal-600 dark:text-gray-400">{task.assigned_to_profile.full_name}</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
