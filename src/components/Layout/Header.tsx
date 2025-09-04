import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, Plus, Menu, Moon, Sun, LogOut, User, Settings } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  onMenuToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { profile, signOut } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setIsProfileMenuOpen(false);
  };

  return (
    <header className="bg-white dark:bg-dark-800 border-b border-sand-200 dark:border-dark-600 px-6 py-4 shadow-soft dark:shadow-dark-soft transition-colors duration-300 z-10 relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="p-2 hover:bg-sand-100 dark:hover:bg-dark-700 rounded-lg transition-colors lg:hidden"
          >
            <Menu size={20} className="text-charcoal-600 dark:text-gray-400" />
          </button>
          
          <div className="relative hidden md:block">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-charcoal-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search projects, tasks..."
              className="pl-10 pr-4 py-2 w-96 bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-teal dark:focus:ring-accent-teal-dark focus:border-transparent transition-all text-charcoal-900 dark:text-white placeholder-charcoal-500 dark:placeholder-gray-400"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-accent-teal dark:bg-accent-teal-dark text-white px-4 py-2 rounded-xl font-medium hover:bg-opacity-90 transition-all shadow-soft dark:shadow-dark-soft flex items-center space-x-2"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">New Project</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleDarkMode}
            className="p-2 hover:bg-sand-100 dark:hover:bg-dark-700 rounded-xl transition-colors"
          >
            {isDarkMode ? (
              <Sun size={20} className="text-yellow-500" />
            ) : (
              <Moon size={20} className="text-charcoal-600" />
            )}
          </motion.button>

          <div className="relative">
            <button className="p-2 hover:bg-sand-100 dark:hover:bg-dark-700 rounded-xl transition-colors relative">
              <Bell size={20} className="text-charcoal-600 dark:text-gray-400" />
              <span className="absolute -top-1 -right-1 bg-accent-orange text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </button>
          </div>

          <div className="relative" ref={profileMenuRef}>
            <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-charcoal-900 dark:text-white">{profile?.full_name}</p>
                <p className="text-xs text-charcoal-500 dark:text-gray-400 capitalize">{profile?.role}</p>
              </div>
              <img
                src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || '')}&background=random`}
                alt={profile?.full_name || 'User avatar'}
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-transparent hover:ring-accent-teal dark:hover:ring-accent-teal-dark transition-all"
              />
            </button>
            <AnimatePresence>
              {isProfileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-800 rounded-xl shadow-hover dark:shadow-dark-hover border border-sand-200 dark:border-dark-600 overflow-hidden"
                >
                  <div className="p-4 border-b border-sand-200 dark:border-dark-600">
                    <p className="font-semibold text-charcoal-900 dark:text-white">{profile?.full_name}</p>
                    <p className="text-sm text-charcoal-500 dark:text-gray-400 truncate">{profile?.email}</p>
                  </div>
                  <div className="p-2">
                    <button className="w-full text-left flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-sand-100 dark:hover:bg-dark-700 text-charcoal-700 dark:text-gray-300 transition-colors">
                      <User size={16} />
                      <span>My Profile</span>
                    </button>
                    <button className="w-full text-left flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-sand-100 dark:hover:bg-dark-700 text-charcoal-700 dark:text-gray-300 transition-colors">
                      <Settings size={16} />
                      <span>Settings</span>
                    </button>
                  </div>
                  <div className="p-2 border-t border-sand-200 dark:border-dark-600">
                    <button onClick={handleSignOut} className="w-full text-left flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors">
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};
