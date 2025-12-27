// Type Definitions
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'member' | 'viewer';
  avatar?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'critical';
  progress: number;
  members: string[];
  createdAt: string;
  updatedAt: string;
  dueDate: string;
  tags: string[];
}

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  teamMembers: number;
  tasksCompleted: number;
  tasksTotal: number;
  revenue: number;
  revenueGrowth: number;
}

export interface Activity {
  id: string;
  type: 'project_created' | 'task_completed' | 'member_joined' | 'comment_added';
  message: string;
  timestamp: string;
  user: string;
}

// Mock Data
const mockUsers: User[] = [
  { id: '1', email: 'alex@company.io', name: 'Alex Morgan', role: 'admin', createdAt: '2024-01-15' },
  { id: '2', email: 'sarah@company.io', name: 'Sarah Chen', role: 'member', createdAt: '2024-02-20' },
  { id: '3', email: 'james@company.io', name: 'James Wilson', role: 'member', createdAt: '2024-03-10' },
  { id: '4', email: 'emma@company.io', name: 'Emma Davis', role: 'viewer', createdAt: '2024-04-05' },
];

const mockProjects: Project[] = [
  {
    id: 'proj-001',
    name: 'Website Redesign',
    description: 'Complete overhaul of the company website with modern design principles and improved UX.',
    status: 'active',
    priority: 'high',
    progress: 68,
    members: ['1', '2', '3'],
    createdAt: '2024-10-01',
    updatedAt: '2024-12-20',
    dueDate: '2025-01-31',
    tags: ['design', 'frontend', 'priority'],
  },
  {
    id: 'proj-002',
    name: 'Mobile App Development',
    description: 'Native iOS and Android applications for customer engagement and loyalty program.',
    status: 'active',
    priority: 'critical',
    progress: 42,
    members: ['1', '3', '4'],
    createdAt: '2024-11-15',
    updatedAt: '2024-12-22',
    dueDate: '2025-03-15',
    tags: ['mobile', 'development', 'ios', 'android'],
  },
  {
    id: 'proj-003',
    name: 'API Integration Suite',
    description: 'Building a comprehensive API layer for third-party integrations and partner services.',
    status: 'on-hold',
    priority: 'medium',
    progress: 25,
    members: ['2', '3'],
    createdAt: '2024-09-20',
    updatedAt: '2024-12-10',
    dueDate: '2025-02-28',
    tags: ['backend', 'api', 'integration'],
  },
  {
    id: 'proj-004',
    name: 'Analytics Dashboard',
    description: 'Real-time analytics and reporting dashboard for business intelligence.',
    status: 'completed',
    priority: 'high',
    progress: 100,
    members: ['1', '2', '4'],
    createdAt: '2024-08-01',
    updatedAt: '2024-11-30',
    dueDate: '2024-11-30',
    tags: ['analytics', 'dashboard', 'data'],
  },
  {
    id: 'proj-005',
    name: 'Security Audit',
    description: 'Comprehensive security review and implementation of enhanced protocols.',
    status: 'active',
    priority: 'critical',
    progress: 85,
    members: ['1', '3'],
    createdAt: '2024-12-01',
    updatedAt: '2024-12-26',
    dueDate: '2025-01-15',
    tags: ['security', 'audit', 'compliance'],
  },
  {
    id: 'proj-006',
    name: 'Customer Portal',
    description: 'Self-service portal for customers to manage accounts and support tickets.',
    status: 'active',
    priority: 'medium',
    progress: 55,
    members: ['2', '4'],
    createdAt: '2024-10-20',
    updatedAt: '2024-12-24',
    dueDate: '2025-02-15',
    tags: ['portal', 'customer', 'support'],
  },
];

const mockDashboardStats: DashboardStats = {
  totalProjects: 12,
  activeProjects: 8,
  completedProjects: 4,
  teamMembers: 24,
  tasksCompleted: 156,
  tasksTotal: 203,
  revenue: 284500,
  revenueGrowth: 12.5,
};

const mockActivities: Activity[] = [
  { id: 'act-1', type: 'project_created', message: 'Created new project "Customer Portal"', timestamp: '2024-12-26T10:30:00Z', user: 'Alex Morgan' },
  { id: 'act-2', type: 'task_completed', message: 'Completed "Design System Documentation"', timestamp: '2024-12-26T09:15:00Z', user: 'Sarah Chen' },
  { id: 'act-3', type: 'member_joined', message: 'Emma Davis joined the team', timestamp: '2024-12-25T16:45:00Z', user: 'System' },
  { id: 'act-4', type: 'comment_added', message: 'Added comment on "API Integration Suite"', timestamp: '2024-12-25T14:20:00Z', user: 'James Wilson' },
  { id: 'act-5', type: 'task_completed', message: 'Completed "Security Protocol Review"', timestamp: '2024-12-25T11:00:00Z', user: 'Alex Morgan' },
];

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate random API failure (10% chance)
const maybeThrowError = () => {
  if (Math.random() < 0.1) {
    throw new Error('API request failed. Please try again.');
  }
};

// API Functions
export const api = {
  // Auth
  login: async (email: string, password: string): Promise<{ token: string; user: User }> => {
    await delay(800);
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    return {
      token: 'mock-token-' + Date.now(),
      user: mockUsers[0],
    };
  },

  // Dashboard
  getDashboardStats: async (): Promise<DashboardStats> => {
    await delay(800);
    return mockDashboardStats;
  },

  getRecentActivities: async (): Promise<Activity[]> => {
    await delay(600);
    return mockActivities;
  },

  // Projects
  getProjects: async (): Promise<Project[]> => {
    await delay(800);
    return mockProjects;
  },

  getProjectById: async (id: string): Promise<Project | null> => {
    await delay(600);
    maybeThrowError();
    return mockProjects.find(p => p.id === id) || null;
  },

  updateProject: async (id: string, data: Partial<Project>): Promise<Project> => {
    await delay(1000);
    maybeThrowError();
    const project = mockProjects.find(p => p.id === id);
    if (!project) throw new Error('Project not found');
    
    // Log the payload that would be sent to backend
    console.log('📤 API Payload (PUT /api/projects/' + id + '):', JSON.stringify({ ...project, ...data }, null, 2));
    
    return { ...project, ...data, updatedAt: new Date().toISOString() };
  },

  deleteProject: async (id: string): Promise<void> => {
    await delay(800);
    maybeThrowError();
    console.log('🗑️ API Payload (DELETE /api/projects/' + id + ')');
  },

  // Users
  getUsers: async (): Promise<User[]> => {
    await delay(500);
    return mockUsers;
  },

  getCurrentUser: async (): Promise<User> => {
    await delay(300);
    return mockUsers[0];
  },
};
