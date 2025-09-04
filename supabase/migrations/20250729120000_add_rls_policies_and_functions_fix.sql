/*
          # [SECURITY] Add RLS Policies and Fix Function Search Paths
          This migration script addresses security advisories by implementing Row Level Security (RLS) policies for all data tables and fixing mutable search paths in PostgreSQL functions.

          ## Query Description: [This operation secures your database by ensuring users can only access data they are permitted to see. It is a critical step for multi-user applications. No data will be lost, but access rules will be strictly enforced.
          Example: "Users will only be able to see projects they are members of."]
          
          ## Metadata:
          - Schema-Category: "Security"
          - Impact-Level: "High"
          - Requires-Backup: false
          - Reversible: true
          
          ## Structure Details:
          - Tables affected: profiles, projects, tasks, chat_channels, messages, message_reactions
          - Functions affected: handle_new_user, update_updated_at_column
          
          ## Security Implications:
          - RLS Status: Enabled on all user-data tables
          - Policy Changes: Yes, policies for SELECT, INSERT, UPDATE, DELETE are added.
          - Auth Requirements: Policies are based on `auth.uid()` and user roles.
          
          ## Performance Impact:
          - Indexes: None
          - Triggers: None
          - Estimated Impact: RLS adds a small overhead to queries, which is negligible for indexed lookups.
          */

-- Fix function search paths
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role, department)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    (new.raw_user_meta_data->>'role')::user_role,
    new.raw_user_meta_data->>'department'
  );
  RETURN new;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql'
SET search_path = public;

-- RLS Policies for 'profiles'
CREATE POLICY "Users can view all profiles"
ON public.profiles FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- RLS Policies for 'projects'
CREATE POLICY "Users can view projects they are members of"
ON public.projects FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM project_members
    WHERE project_members.project_id = projects.id
      AND project_members.user_id = auth.uid()
  )
);

CREATE POLICY "Authenticated users can create projects"
ON public.projects FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Project managers or admins can update projects"
ON public.projects FOR UPDATE
USING (
  (
    SELECT role FROM profiles WHERE id = auth.uid()
  ) IN ('admin', 'manager')
  AND EXISTS (
    SELECT 1
    FROM project_members
    WHERE project_members.project_id = projects.id
      AND project_members.user_id = auth.uid()
  )
);

CREATE POLICY "Project managers or admins can delete projects"
ON public.projects FOR DELETE
USING (
  (
    SELECT role FROM profiles WHERE id = auth.uid()
  ) IN ('admin', 'manager')
);

-- RLS Policies for 'tasks'
CREATE POLICY "Users can view tasks in their projects"
ON public.tasks FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM project_members
    WHERE project_members.project_id = tasks.project_id
      AND project_members.user_id = auth.uid()
  )
);

CREATE POLICY "Project members can create tasks"
ON public.tasks FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM project_members
    WHERE project_members.project_id = tasks.project_id
      AND project_members.user_id = auth.uid()
  )
);

CREATE POLICY "Task assignees or project managers/admins can update tasks"
ON public.tasks FOR UPDATE
USING (
  (
    auth.uid() = assigned_to OR
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'manager')
  )
  AND EXISTS (
    SELECT 1
    FROM project_members
    WHERE project_members.project_id = tasks.project_id
      AND project_members.user_id = auth.uid()
  )
);

CREATE POLICY "Project managers or admins can delete tasks"
ON public.tasks FOR DELETE
USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) IN ('admin', 'manager')
  AND EXISTS (
    SELECT 1
    FROM project_members
    WHERE project_members.project_id = tasks.project_id
      AND project_members.user_id = auth.uid()
  )
);

-- RLS Policies for 'chat_channels'
CREATE POLICY "Users can view public channels or private channels they are members of"
ON public.chat_channels FOR SELECT
USING (
  type = 'public' OR
  EXISTS (
    SELECT 1
    FROM channel_members
    WHERE channel_members.channel_id = chat_channels.id
      AND channel_members.user_id = auth.uid()
  )
);

CREATE POLICY "Authenticated users can create channels"
ON public.chat_channels FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- RLS Policies for 'messages'
CREATE POLICY "Users can view messages in channels they are members of"
ON public.messages FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM chat_channels
    WHERE chat_channels.id = messages.channel_id
    AND (
      chat_channels.type = 'public' OR
      EXISTS (
        SELECT 1 FROM channel_members
        WHERE channel_members.channel_id = chat_channels.id AND channel_members.user_id = auth.uid()
      )
    )
  )
);

CREATE POLICY "Channel members can send messages"
ON public.messages FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM chat_channels
    WHERE chat_channels.id = messages.channel_id
    AND (
      chat_channels.type = 'public' OR
      EXISTS (
        SELECT 1 FROM channel_members
        WHERE channel_members.channel_id = chat_channels.id AND channel_members.user_id = auth.uid()
      )
    )
  )
);

CREATE POLICY "Users can update their own messages"
ON public.messages FOR UPDATE
USING (auth.uid() = sender_id);

CREATE POLICY "Users can delete their own messages"
ON public.messages FOR DELETE
USING (auth.uid() = sender_id);

-- RLS Policies for 'message_reactions'
CREATE POLICY "Users can view reactions in channels they are members of"
ON public.message_reactions FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM messages
    WHERE messages.id = message_reactions.message_id
      AND (
        EXISTS (
          SELECT 1
          FROM chat_channels
          WHERE chat_channels.id = messages.channel_id
          AND (
            chat_channels.type = 'public' OR
            EXISTS (
              SELECT 1 FROM channel_members
              WHERE channel_members.channel_id = chat_channels.id AND channel_members.user_id = auth.uid()
            )
          )
        )
      )
  )
);

CREATE POLICY "Channel members can add reactions"
ON public.message_reactions FOR INSERT
WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1
    FROM messages
    WHERE messages.id = message_reactions.message_id
      AND (
        EXISTS (
          SELECT 1
          FROM chat_channels
          WHERE chat_channels.id = messages.channel_id
          AND (
            chat_channels.type = 'public' OR
            EXISTS (
              SELECT 1 FROM channel_members
              WHERE channel_members.channel_id = chat_channels.id AND channel_members.user_id = auth.uid()
            )
          )
        )
      )
  )
);

CREATE POLICY "Users can delete their own reactions"
ON public.message_reactions FOR DELETE
USING (auth.uid() = user_id);
