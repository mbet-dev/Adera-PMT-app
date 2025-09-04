import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  FolderOpen, 
  CheckSquare, 
  Users, 
  MessageSquare, 
  FileText, 
  Calendar, 
  Settings,
  Eye,
  ChevronLeft
} from 'lucide-react';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  isExpanded: boolean;
  onToggle: () => void;
}

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'projects', label: 'Projects', icon: FolderOpen },
  { id: 'tasks', label: 'Task Board', icon: CheckSquare },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'chat', label: 'Chat & Notes', icon: MessageSquare },
  { id: 'files', label: 'Files', icon: FileText },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'client', label: 'Client View', icon: Eye },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeView, 
  onViewChange, 
  isExpanded, 
  onToggle 
}) => {
  return (
    <motion.div 
      initial={false}
      animate={{ width: isExpanded ? 280 : 80 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-white dark:bg-dark-800 border-r border-sand-200 dark:border-dark-600 h-full flex flex-col shadow-soft dark:shadow-dark-soft transition-colors duration-300"
    >
      <div className="p-6 border-b border-sand-200 dark:border-dark-600">
        <div className="flex items-center justify-between">
          <motion.div 
            animate={{ opacity: isExpanded ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center space-x-3"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-accent-teal to-accent-teal-dark rounded-lg flex items-center justify-center shadow-soft">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-header font-semibold text-charcoal-900 dark:text-white">StudioBoard</span>
          </motion.div>
          <button
            onClick={onToggle}
            className="p-2 hover:bg-sand-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
          >
            <motion.div
              animate={{ rotate: isExpanded ? 0 : 180 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronLeft size={20} className="text-charcoal-600 dark:text-gray-400" />
            </motion.div>
          </button>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'bg-gradient-to-r from-accent-teal to-accent-teal-dark text-white shadow-soft dark:shadow-dark-soft' 
                  : 'text-charcoal-600 dark:text-gray-400 hover:bg-sand-100 dark:hover:bg-dark-700 hover:text-charcoal-900 dark:hover:text-white'
              }`}
            >
              <Icon size={20} />
              <motion.span
                animate={{ opacity: isExpanded ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                className="font-medium whitespace-nowrap"
              >
                {item.label}
              </motion.span>
            </motion.button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sand-200 dark:border-dark-600">
        <motion.div
          animate={{ opacity: isExpanded ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-center"
        >
          <p className="text-xs text-charcoal-500 dark:text-gray-500">
            StudioBoard v2.0
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};
