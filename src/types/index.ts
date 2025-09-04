import { Database } from './database';

export type Profile = Database['public']['Tables']['profiles']['Row'];

export type Project = Database['public']['Tables']['projects']['Row'];
export type ProjectWithDetails = Project & {
  created_by_profile: Pick<Profile, 'full_name' | 'avatar_url'> | null;
  project_members: {
    profiles: Pick<Profile, 'id' | 'full_name' | 'avatar_url' | 'role'> | null;
  }[];
};

export type Task = Database['public']['Tables']['tasks']['Row'];
export type TaskWithDetails = Task & {
  assigned_to_profile: Pick<Profile, 'full_name' | 'avatar_url'> | null;
  created_by_profile: Pick<Profile, 'full_name' | 'avatar_url'> | null;
  project: { name: string } | null;
};

export type Channel = Database['public']['Tables']['chat_channels']['Row'];
export type Message = Database['public']['Tables']['messages']['Row'];
