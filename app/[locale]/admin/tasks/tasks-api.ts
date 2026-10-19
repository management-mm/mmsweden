export type TaskStatus = 'OPEN' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';

export type TaskPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

export type TaskKind = 'CALL' | 'EMAIL' | 'QUOTATION' | 'FOLLOW_UP' | 'OTHER';

export type TaskScope = 'MINE' | 'TEAM';

export type TaskView = 'ALL' | 'TODAY' | 'OVERDUE' | 'UPCOMING' | 'DONE';

export interface CrmTask {
  _id: string;
  title: string;
  description: string;
  kind: TaskKind;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;

  assigneeId: string;
  assigneeName: string;

  relatedDealId: string | null;
  relatedDealTitle: string | null;

  version: number;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export interface TaskInput {
  title: string;
  description: string;
  kind: TaskKind;
  priority: TaskPriority;
  dueDate: string;
  assigneeId?: string;
  relatedDealId?: string | null;
}

export interface TaskAssignee {
  id: string;
  name: string;
  email: string;
}

export interface TasksResponse {
  items: CrmTask[];
  total: number;
  page: number;
  limit: number;
  summary: {
    open: number;
    today: number;
    overdue: number;
    completed: number;
  };
}

export interface TaskFilters {
  scope: TaskScope;
  view: TaskView;
  priority: TaskPriority | 'ALL';
  search: string;
  today: string;
  page: number;
  limit: number;
}

export const TASK_KINDS: Record<TaskKind, string> = {
  CALL: 'Phone call',
  EMAIL: 'Send email',
  QUOTATION: 'Prepare quotation',
  FOLLOW_UP: 'Follow-up',
  OTHER: 'Other',
};

export const TASK_PRIORITIES: Record<TaskPriority, string> = {
  LOW: 'Low',
  NORMAL: 'Normal',
  HIGH: 'High',
  URGENT: 'Urgent',
};

export function getLocalToday(): string {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');

  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function apiBase() {
  const url = process.env.NEXT_PUBLIC_API_URL;

  if (!url) {
    throw new Error('NEXT_PUBLIC_API_URL is not configured');
  }

  return url.replace(/\/+$/, '');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${apiBase()}${path}`, {
    ...options,
    credentials: 'include',
    cache: 'no-store',
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      message?: string | string[];
    } | null;

    const message = Array.isArray(body?.message)
      ? body.message.join(', ')
      : body?.message;

    const fallback =
      response.status === 401
        ? 'Please sign in again.'
        : response.status === 403
          ? 'You do not have CRM access.'
          : response.status === 409
            ? 'This task was changed by another manager. Refresh and try again.'
            : `Request failed (${response.status}).`;

    throw new Error(message || fallback);
  }

  return (await response.json()) as T;
}

export function getTasks(filters: TaskFilters, signal?: AbortSignal) {
  const params = new URLSearchParams({
    scope: filters.scope,
    view: filters.view,
    page: String(filters.page),
    limit: String(filters.limit),
    today: filters.today,
  });

  if (filters.priority !== 'ALL') {
    params.set('priority', filters.priority);
  }

  if (filters.search.trim()) {
    params.set('search', filters.search.trim());
  }

  return request<TasksResponse>(`/crm/tasks?${params.toString()}`, { signal });
}

export function getTaskAssignees(search = '', signal?: AbortSignal) {
  const params = new URLSearchParams();

  if (search.trim()) {
    params.set('search', search.trim());
  }

  return request<TaskAssignee[]>(`/crm/tasks/assignees?${params.toString()}`, {
    signal,
  });
}

export function createTask(input: TaskInput) {
  return request<CrmTask>('/crm/tasks', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateTask(id: string, input: TaskInput, version: number) {
  return request<CrmTask>(`/crm/tasks/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify({
      ...input,
      version,
    }),
  });
}

export function changeTaskStatus(
  id: string,
  status: TaskStatus,
  version: number
) {
  return request<CrmTask>(`/crm/tasks/${encodeURIComponent(id)}/status`, {
    method: 'PATCH',
    body: JSON.stringify({
      status,
      version,
    }),
  });
}
