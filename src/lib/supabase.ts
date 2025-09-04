import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Auth helper functions
export const auth = {
  signUp: async (email: string, password: string, userData?: any) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
        emailRedirectTo: `${window.location.origin}/`
      }
    });
  },

  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password });
  },

  signOut: async () => {
    return await supabase.auth.signOut();
  },

  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// Database helper functions
export const db = {
  // Profile operations
  getProfile: async (userId: string) => {
    return await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
  },
  
  getProfiles: async () => {
    return await supabase
      .from('profiles')
      .select('*')
      .order('full_name', { ascending: true });
  },

  updateProfile: async (userId: string, updates: any) => {
    return await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);
  },

  // Project operations
  getProjects: async () => {
    return await supabase
      .from('projects')
      .select(`
        *,
        created_by_profile:profiles!created_by(full_name, avatar_url),
        project_members(
          profiles(id, full_name, avatar_url, role)
        )
      `)
      .order('created_at', { ascending: false });
  },

  createProject: async (project: any) => {
    return await supabase
      .from('projects')
      .insert(project)
      .select()
      .single();
  },

  // Task operations
  getTasks: async (projectId?: string) => {
    let query = supabase
      .from('tasks')
      .select(`
        *,
        assigned_to_profile:profiles!assigned_to(full_name, avatar_url),
        created_by_profile:profiles!created_by(full_name, avatar_url),
        project:projects(name)
      `)
      .order('created_at', { ascending: false });

    if (projectId) {
      query = query.eq('project_id', projectId);
    }

    return await query;
  },

  createTask: async (task: any) => {
    return await supabase
      .from('tasks')
      .insert(task)
      .select()
      .single();
  },

  updateTask: async (taskId: string, updates: any) => {
    return await supabase
      .from('tasks')
      .update(updates)
      .eq('id', taskId);
  },

  // Chat operations
  getChannels: async () => {
    return await supabase
      .from('chat_channels')
      .select(`
        *,
        created_by_profile:profiles!created_by(full_name, avatar_url),
        channel_members(
          profiles(id, full_name, avatar_url)
        )
      `)
      .order('created_at', { ascending: false });
  },

  createChannel: async (channel: any) => {
    return await supabase
      .from('chat_channels')
      .insert(channel)
      .select()
      .single();
  },

  getMessages: async (channelId: string, limit = 50) => {
    return await supabase
      .from('messages')
      .select(`
        *,
        sender:profiles!sender_id(full_name, avatar_url),
        reply_to_message:messages!reply_to(content, sender:profiles!sender_id(full_name)),
        message_reactions(emoji, user_id, profiles(full_name))
      `)
      .eq('channel_id', channelId)
      .order('created_at', { ascending: false })
      .limit(limit);
  },

  sendMessage: async (message: any) => {
    return await supabase
      .from('messages')
      .insert(message)
      .select(`
        *,
        sender:profiles!sender_id(full_name, avatar_url)
      `)
      .single();
  },

  // Real-time subscriptions
  subscribeToMessages: (channelId: string, callback: (payload: any) => void) => {
    return supabase
      .channel(`messages:${channelId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'messages',
        filter: `channel_id=eq.${channelId}`
      }, callback)
      .subscribe();
  },

  subscribeToTasks: (callback: (payload: any) => void) => {
    return supabase
      .channel('tasks')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'tasks'
      }, callback)
      .subscribe();
  }
};
