import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Paperclip, 
  Smile, 
  MoreHorizontal, 
  Hash, 
  Lock, 
  Users,
  Search,
  Plus,
  Reply,
  Edit,
  Trash2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { db, supabase } from '../../lib/supabase';
import { Database } from '../../types/database';

type Channel = Database['public']['Tables']['chat_channels']['Row'] & {
  created_by_profile: { full_name: string; avatar_url: string };
  channel_members: { profiles: { id: string; full_name: string; avatar_url: string } }[];
};

type Message = Database['public']['Tables']['messages']['Row'] & {
  sender: { full_name: string; avatar_url: string };
  reply_to_message?: { content: string; sender: { full_name: string } };
  message_reactions: { emoji: string; user_id: string; profiles: { full_name: string } }[];
};

export const ChatInterface: React.FC = () => {
  const { profile } = useAuth();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadChannels();
  }, []);

  useEffect(() => {
    if (activeChannel) {
      loadMessages(activeChannel.id);
      subscribeToMessages(activeChannel.id);
    }
  }, [activeChannel]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChannels = async () => {
    try {
      const { data, error } = await db.getChannels();
      if (data && !error) {
        setChannels(data);
        if (data.length > 0) {
          setActiveChannel(data[0]);
        }
      }
    } catch (error) {
      console.error('Error loading channels:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (channelId: string) => {
    try {
      const { data, error } = await db.getMessages(channelId);
      if (data && !error) {
        setMessages(data.reverse());
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const subscribeToMessages = (channelId: string) => {
    const subscription = db.subscribeToMessages(channelId, (payload) => {
      if (payload.eventType === 'INSERT') {
        loadMessages(channelId); // Reload to get full message with relations
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeChannel || !profile || sendingMessage) return;

    setSendingMessage(true);
    try {
      const messageData = {
        channel_id: activeChannel.id,
        sender_id: profile.id,
        content: newMessage.trim(),
        message_type: 'text' as const,
        reply_to: replyTo?.id || null
      };

      const { error } = await db.sendMessage(messageData);
      
      if (!error) {
        setNewMessage('');
        setReplyTo(null);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-teal"></div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-white dark:bg-dark-800 rounded-2xl shadow-soft dark:shadow-dark-soft overflow-hidden border border-transparent dark:border-dark-600">
      {/* Channels Sidebar */}
      <div className="w-80 bg-sand-50 dark:bg-dark-700 border-r border-sand-200 dark:border-dark-600 flex flex-col">
        <div className="p-4 border-b border-sand-200 dark:border-dark-600">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-charcoal-900 dark:text-white">Channels</h2>
            <button className="p-2 hover:bg-sand-200 dark:hover:bg-dark-600 rounded-lg transition-colors">
              <Plus size={16} className="text-charcoal-600 dark:text-gray-400" />
            </button>
          </div>
          
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-charcoal-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search channels..."
              className="w-full pl-9 pr-3 py-2 bg-white dark:bg-dark-800 border border-sand-200 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-teal dark:focus:ring-accent-teal-dark focus:border-transparent transition-all text-sm text-charcoal-900 dark:text-white placeholder-charcoal-500 dark:placeholder-gray-400"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {channels.map((channel) => (
            <motion.button
              key={channel.id}
              onClick={() => setActiveChannel(channel)}
              whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
              className={`w-full p-3 text-left border-b border-sand-200 dark:border-dark-600 transition-colors ${
                activeChannel?.id === channel.id 
                  ? 'bg-accent-teal bg-opacity-10 dark:bg-accent-teal-dark dark:bg-opacity-20' 
                  : 'hover:bg-sand-100 dark:hover:bg-dark-600'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {channel.type === 'private' ? (
                    <Lock size={16} className="text-charcoal-500 dark:text-gray-400" />
                  ) : (
                    <Hash size={16} className="text-charcoal-500 dark:text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-charcoal-900 dark:text-white truncate">
                    {channel.name}
                  </p>
                  {channel.description && (
                    <p className="text-xs text-charcoal-500 dark:text-gray-400 truncate">
                      {channel.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center text-xs text-charcoal-500 dark:text-gray-400">
                  <Users size={12} className="mr-1" />
                  {channel.channel_members?.length || 0}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {activeChannel ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-sand-200 dark:border-dark-600 bg-white dark:bg-dark-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {activeChannel.type === 'private' ? (
                    <Lock size={20} className="text-charcoal-500 dark:text-gray-400" />
                  ) : (
                    <Hash size={20} className="text-charcoal-500 dark:text-gray-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal-900 dark:text-white">
                    {activeChannel.name}
                  </h3>
                  {activeChannel.description && (
                    <p className="text-sm text-charcoal-500 dark:text-gray-400">
                      {activeChannel.description}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-sand-100 dark:hover:bg-dark-700 rounded-lg transition-colors">
                  <Users size={18} className="text-charcoal-600 dark:text-gray-400" />
                </button>
                <button className="p-2 hover:bg-sand-100 dark:hover:bg-dark-700 rounded-lg transition-colors">
                  <MoreHorizontal size={18} className="text-charcoal-600 dark:text-gray-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => {
              const showAvatar = index === 0 || messages[index - 1]?.sender_id !== message.sender_id;
              const isOwn = message.sender_id === profile?.id;
              
              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'} ${showAvatar ? 'mt-4' : 'mt-1'}`}
                >
                  <div className={`flex space-x-3 max-w-2xl ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    {showAvatar && !isOwn && (
                      <img
                        src={message.sender.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(message.sender.full_name)}&background=4A9B8E&color=fff`}
                        alt={message.sender.full_name}
                        className="w-8 h-8 rounded-full flex-shrink-0"
                      />
                    )}
                    
                    <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                      {showAvatar && (
                        <div className={`flex items-center space-x-2 mb-1 ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
                          <span className="font-medium text-sm text-charcoal-900 dark:text-white">
                            {message.sender.full_name}
                          </span>
                          <span className="text-xs text-charcoal-500 dark:text-gray-400">
                            {formatTime(message.created_at)}
                          </span>
                        </div>
                      )}
                      
                      {message.reply_to_message && (
                        <div className={`mb-2 p-2 bg-sand-100 dark:bg-dark-600 rounded-lg border-l-2 border-accent-teal dark:border-accent-teal-dark text-sm ${isOwn ? 'self-end' : 'self-start'}`}>
                          <p className="text-charcoal-600 dark:text-gray-300 font-medium">
                            {message.reply_to_message.sender.full_name}
                          </p>
                          <p className="text-charcoal-500 dark:text-gray-400">
                            {message.reply_to_message.content}
                          </p>
                        </div>
                      )}
                      
                      <div className={`relative group ${isOwn ? 'bg-gradient-to-r from-accent-teal to-accent-teal-dark text-white' : 'bg-sand-100 dark:bg-dark-700 text-charcoal-900 dark:text-white'} px-4 py-2 rounded-2xl`}>
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        
                        {/* Message Actions */}
                        <div className={`absolute ${isOwn ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'} top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1`}>
                          <button
                            onClick={() => setReplyTo(message)}
                            className="p-1 bg-white dark:bg-dark-800 rounded-full shadow-soft dark:shadow-dark-soft hover:bg-sand-50 dark:hover:bg-dark-700 transition-colors"
                          >
                            <Reply size={14} className="text-charcoal-600 dark:text-gray-400" />
                          </button>
                          <button className="p-1 bg-white dark:bg-dark-800 rounded-full shadow-soft dark:shadow-dark-soft hover:bg-sand-50 dark:hover:bg-dark-700 transition-colors">
                            <Smile size={14} className="text-charcoal-600 dark:text-gray-400" />
                          </button>
                          {isOwn && (
                            <>
                              <button className="p-1 bg-white dark:bg-dark-800 rounded-full shadow-soft dark:shadow-dark-soft hover:bg-sand-50 dark:hover:bg-dark-700 transition-colors">
                                <Edit size={14} className="text-charcoal-600 dark:text-gray-400" />
                              </button>
                              <button className="p-1 bg-white dark:bg-dark-800 rounded-full shadow-soft dark:shadow-dark-soft hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                <Trash2 size={14} className="text-red-500" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Reactions */}
                      {message.message_reactions && message.message_reactions.length > 0 && (
                        <div className="flex space-x-1 mt-1">
                          {/* Group reactions by emoji */}
                          {Object.entries(
                            message.message_reactions.reduce((acc, reaction) => {
                              if (!acc[reaction.emoji]) {
                                acc[reaction.emoji] = [];
                              }
                              acc[reaction.emoji].push(reaction);
                              return acc;
                            }, {} as Record<string, typeof message.message_reactions>)
                          ).map(([emoji, reactions]) => (
                            <button
                              key={emoji}
                              className="px-2 py-1 bg-sand-100 dark:bg-dark-700 rounded-full text-xs hover:bg-sand-200 dark:hover:bg-dark-600 transition-colors"
                            >
                              {emoji} {reactions.length}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Reply Preview */}
          <AnimatePresence>
            {replyTo && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3 bg-sand-50 dark:bg-dark-700 border-t border-sand-200 dark:border-dark-600"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Reply size={16} className="text-accent-teal dark:text-accent-teal-dark" />
                    <span className="text-sm text-charcoal-600 dark:text-gray-400">
                      Replying to <strong>{replyTo.sender.full_name}</strong>
                    </span>
                  </div>
                  <button
                    onClick={() => setReplyTo(null)}
                    className="p-1 hover:bg-sand-200 dark:hover:bg-dark-600 rounded transition-colors"
                  >
                    <X size={16} className="text-charcoal-500 dark:text-gray-400" />
                  </button>
                </div>
                <p className="text-sm text-charcoal-700 dark:text-gray-300 mt-1 pl-6 truncate">
                  {replyTo.content}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Message Input */}
          <div className="p-4 border-t border-sand-200 dark:border-dark-600 bg-white dark:bg-dark-800">
            <div className="flex items-end space-x-3">
              <div className="flex-1">
                <div className="relative">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={`Message #${activeChannel.name}`}
                    rows={1}
                    className="w-full p-3 pr-12 bg-sand-50 dark:bg-dark-700 border border-sand-200 dark:border-dark-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-teal dark:focus:ring-accent-teal-dark focus:border-transparent transition-all resize-none text-charcoal-900 dark:text-white placeholder-charcoal-500 dark:placeholder-gray-400"
                    style={{ minHeight: '44px', maxHeight: '120px' }}
                  />
                  <div className="absolute right-2 bottom-2 flex space-x-1">
                    <button className="p-1 hover:bg-sand-200 dark:hover:bg-dark-600 rounded transition-colors">
                      <Paperclip size={16} className="text-charcoal-500 dark:text-gray-400" />
                    </button>
                    <button className="p-1 hover:bg-sand-200 dark:hover:bg-dark-600 rounded transition-colors">
                      <Smile size={16} className="text-charcoal-500 dark:text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={sendMessage}
                disabled={!newMessage.trim() || sendingMessage}
                className="p-3 bg-gradient-to-r from-accent-teal to-accent-teal-dark text-white rounded-xl hover:shadow-soft dark:hover:shadow-dark-soft transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} />
              </motion.button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-sand-100 dark:bg-dark-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Hash size={32} className="text-charcoal-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-charcoal-900 dark:text-white mb-2">
              No Channel Selected
            </h3>
            <p className="text-charcoal-600 dark:text-gray-400">
              Choose a channel from the sidebar to start chatting
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
