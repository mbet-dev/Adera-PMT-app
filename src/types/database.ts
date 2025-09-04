export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          avatar_url: string | null;
          role: 'admin' | 'manager' | 'designer' | 'developer' | 'client';
          department: string | null;
          bio: string | null;
          timezone: string;
          status: string;
          last_seen: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          avatar_url?: string | null;
          role?: 'admin' | 'manager' | 'designer' | 'developer' | 'client';
          department?: string | null;
          bio?: string | null;
          timezone?: string;
          status?: string;
          last_seen?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          avatar_url?: string | null;
          role?: 'admin' | 'manager' | 'designer' | 'developer' | 'client';
          department?: string | null;
          bio?: string | null;
          timezone?: string;
          status?: string;
          last_seen?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          status: 'draft' | 'active' | 'on-hold' | 'completed' | 'cancelled';
          client_name: string | null;
          budget: number | null;
          deadline: string | null;
          progress: number;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          status?: 'draft' | 'active' | 'on-hold' | 'completed' | 'cancelled';
          client_name?: string | null;
          budget?: number | null;
          deadline?: string | null;
          progress?: number;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          status?: 'draft' | 'active' | 'on-hold' | 'completed' | 'cancelled';
          client_name?: string | null;
          budget?: number | null;
          deadline?: string | null;
          progress?: number;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          project_id: string;
          title: string;
          description: string | null;
          status: 'todo' | 'in-progress' | 'review' | 'completed';
          priority: 'low' | 'medium' | 'high' | 'urgent';
          assigned_to: string | null;
          created_by: string;
          due_date: string | null;
          estimated_hours: number | null;
          actual_hours: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          title: string;
          description?: string | null;
          status?: 'todo' | 'in-progress' | 'review' | 'completed';
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          assigned_to?: string | null;
          created_by: string;
          due_date?: string | null;
          estimated_hours?: number | null;
          actual_hours?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          title?: string;
          description?: string | null;
          status?: 'todo' | 'in-progress' | 'review' | 'completed';
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          assigned_to?: string | null;
          created_by?: string;
          due_date?: string | null;
          estimated_hours?: number | null;
          actual_hours?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      chat_channels: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          type: string;
          project_id: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          type?: string;
          project_id?: string | null;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          type?: string;
          project_id?: string | null;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          channel_id: string;
          sender_id: string;
          content: string | null;
          message_type: 'text' | 'file' | 'image' | 'system';
          file_url: string | null;
          file_name: string | null;
          file_size: number | null;
          reply_to: string | null;
          edited_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          channel_id: string;
          sender_id: string;
          content?: string | null;
          message_type?: 'text' | 'file' | 'image' | 'system';
          file_url?: string | null;
          file_name?: string | null;
          file_size?: number | null;
          reply_to?: string | null;
          edited_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          channel_id?: string;
          sender_id?: string;
          content?: string | null;
          message_type?: 'text' | 'file' | 'image' | 'system';
          file_url?: string | null;
          file_name?: string | null;
          file_size?: number | null;
          reply_to?: string | null;
          edited_at?: string | null;
          created_at?: string;
        };
      };
      message_reactions: {
        Row: {
          id: string;
          message_id: string;
          user_id: string;
          emoji: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          message_id: string;
          user_id: string;
          emoji: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          message_id?: string;
          user_id?: string;
          emoji?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: 'admin' | 'manager' | 'designer' | 'developer' | 'client';
      project_status: 'draft' | 'active' | 'on-hold' | 'completed' | 'cancelled';
      task_status: 'todo' | 'in-progress' | 'review' | 'completed';
      task_priority: 'low' | 'medium' | 'high' | 'urgent';
      message_type: 'text' | 'file' | 'image' | 'system';
      notification_type: 'task_assigned' | 'project_update' | 'mention' | 'message' | 'deadline';
    };
  };
}
