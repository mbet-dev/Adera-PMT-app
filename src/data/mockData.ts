import { Project, TeamMember, Task, CalendarEvent } from '../types';

export const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    role: 'Creative Director',
    avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=150&h=150&fit=crop&crop=face',
    email: 'sarah@studio.com',
    status: 'online',
    department: 'Design'
  },
  {
    id: '2',
    name: 'Marcus Rodriguez',
    role: 'Lead Developer',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
    email: 'marcus@studio.com',
    status: 'online',
    department: 'Development'
  },
  {
    id: '3',
    name: 'Emma Thompson',
    role: 'UX Designer',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
    email: 'emma@studio.com',
    status: 'away',
    department: 'Design'
  },
  {
    id: '4',
    name: 'James Wilson',
    role: 'Project Manager',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
    email: 'james@studio.com',
    status: 'online',
    department: 'Management'
  },
  {
    id: '5',
    name: 'Olivia Martinez',
    role: 'Senior Designer',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
    email: 'olivia@studio.com',
    status: 'online',
    department: 'Design'
  },
  {
    id: '6',
    name: 'David Kim',
    role: 'Frontend Developer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    email: 'david@studio.com',
    status: 'away',
    department: 'Development'
  },
  {
    id: '7',
    name: 'Lisa Zhang',
    role: 'Product Designer',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9f72136?w=150&h=150&fit=crop&crop=face',
    email: 'lisa@studio.com',
    status: 'online',
    department: 'Design'
  },
  {
    id: '8',
    name: 'Alex Johnson',
    role: 'Backend Developer',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    email: 'alex@studio.com',
    status: 'offline',
    department: 'Development'
  }
];

export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Luxury Resort Rebrand',
    description: 'Complete brand identity redesign for premium resort chain',
    status: 'active',
    client: 'Ocean Vista Resorts',
    team: [mockTeamMembers[0], mockTeamMembers[2]],
    progress: 65,
    deadline: '2025-03-15',
    budget: 85000,
    tags: ['Branding', 'Luxury', 'Hospitality'],
    createdAt: '2025-01-10'
  },
  {
    id: '2',
    name: 'FinTech Mobile App',
    description: 'User-friendly mobile banking application for modern users',
    status: 'active',
    client: 'NextGen Financial',
    team: [mockTeamMembers[1], mockTeamMembers[3]],
    progress: 45,
    deadline: '2025-04-20',
    budget: 120000,
    tags: ['Mobile', 'FinTech', 'UX'],
    createdAt: '2025-01-05'
  },
  {
    id: '3',
    name: 'E-commerce Platform',
    description: 'Custom e-commerce solution for fashion retailer',
    status: 'completed',
    client: 'Style Collective',
    team: [mockTeamMembers[1], mockTeamMembers[2]],
    progress: 100,
    deadline: '2025-01-30',
    budget: 95000,
    tags: ['E-commerce', 'Fashion', 'Web'],
    createdAt: '2024-11-15'
  },
  {
    id: '4',
    name: 'Corporate Website Redesign',
    description: 'Modern website redesign for technology company',
    status: 'active',
    client: 'TechCorp Solutions',
    team: [mockTeamMembers[4], mockTeamMembers[5]],
    progress: 30,
    deadline: '2025-05-10',
    budget: 75000,
    tags: ['Web', 'Corporate', 'Responsive'],
    createdAt: '2025-01-20'
  }
];

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Design logo concepts',
    description: 'Create 3 initial logo concepts for the resort rebrand',
    status: 'completed',
    assignee: mockTeamMembers[0],
    priority: 'high',
    dueDate: '2025-02-01',
    projectId: '1',
    comments: [],
    attachments: []
  },
  {
    id: '2',
    title: 'Develop color palette',
    description: 'Establish brand color system and guidelines',
    status: 'in-progress',
    assignee: mockTeamMembers[2],
    priority: 'medium',
    dueDate: '2025-02-10',
    projectId: '1',
    comments: [],
    attachments: []
  },
  {
    id: '3',
    title: 'Mobile app wireframes',
    description: 'Create wireframes for key app screens',
    status: 'todo',
    assignee: mockTeamMembers[2],
    priority: 'high',
    dueDate: '2025-02-15',
    projectId: '2',
    comments: [],
    attachments: []
  },
  {
    id: '4',
    title: 'User research analysis',
    description: 'Analyze user feedback and create insights report',
    status: 'review',
    assignee: mockTeamMembers[4],
    priority: 'medium',
    dueDate: '2025-02-12',
    projectId: '2',
    comments: [],
    attachments: []
  },
  {
    id: '5',
    title: 'Database schema design',
    description: 'Design database structure for the new platform',
    status: 'in-progress',
    assignee: mockTeamMembers[1],
    priority: 'high',
    dueDate: '2025-02-08',
    projectId: '3',
    comments: [],
    attachments: []
  },
  {
    id: '6',
    title: 'API documentation',
    description: 'Create comprehensive API documentation',
    status: 'todo',
    assignee: mockTeamMembers[7],
    priority: 'low',
    dueDate: '2025-02-20',
    projectId: '4',
    comments: [],
    attachments: []
  }
];

export const mockCalendarEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Client Review Meeting',
    description: 'Present logo concepts to Ocean Vista team',
    start: '2025-02-05T10:00:00',
    end: '2025-02-05T11:30:00',
    type: 'meeting',
    attendees: [mockTeamMembers[0], mockTeamMembers[3]],
    projectId: '1'
  },
  {
    id: '2',
    title: 'Design System Deadline',
    description: 'Complete design system documentation',
    start: '2025-02-10T17:00:00',
    end: '2025-02-10T17:00:00',
    type: 'deadline',
    attendees: [mockTeamMembers[2]],
    projectId: '1'
  },
  {
    id: '3',
    title: 'Team Standup',
    description: 'Weekly team sync meeting',
    start: '2025-02-07T09:00:00',
    end: '2025-02-07T10:00:00',
    type: 'meeting',
    attendees: [mockTeamMembers[0], mockTeamMembers[1], mockTeamMembers[2], mockTeamMembers[3]]
  }
];
