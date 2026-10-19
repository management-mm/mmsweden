'use client';

import { useEffect, useState } from 'react';
import {
  FiAlertCircle,
  FiCalendar,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
  FiCircle,
  FiClock,
  FiEdit2,
  FiPlus,
  FiRefreshCw,
  FiRotateCcw,
  FiSearch,
  FiUsers,
} from 'react-icons/fi';

import { useLocale } from 'next-intl';
import Link from 'next/link';

import TaskEditor from './TaskEditor';
import {
  type CrmTask,
  TASK_KINDS,
  TASK_PRIORITIES,
  type TaskPriority,
  type TaskScope,
  type TaskStatus,
  type TaskView,
  type TasksResponse,
  changeTaskStatus,
  getLocalToday,
  getTasks,
} from './tasks-api';

const PAGE_SIZE = 12;

const VIEWS: {
  value: TaskView;
  label: string;
}[] = [
  { value: 'ALL', label: 'All tasks' },
  { value: 'TODAY', label: 'Today' },
  { value: 'OVERDUE', label: 'Overdue' },
  { value: 'UPCOMING', label: 'Upcoming' },
  { value: 'DONE', label: 'Completed' },
];

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  LOW: 'bg-slate-100 text-slate-600',
  NORMAL: 'bg-blue-50 text-blue-700',
  HIGH: 'bg-orange-50 text-orange-700',
  URGENT: 'bg-red-50 text-red-700',
};

const GROUP_ORDER = [
  'Overdue',
  'Today',
  'Upcoming',
  'Completed',
  'Cancelled',
] as const;

type TaskGroup = (typeof GROUP_ORDER)[number];

function formatDate(value: string) {
  if (!value) return '—';

  // Date-only values should be formatted
  // without shifting the calendar day.
  const date = new Date(`${value}T12:00:00`);

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function getGroup(task: CrmTask, today: string): TaskGroup {
  if (task.status === 'DONE') {
    return 'Completed';
  }

  if (task.status === 'CANCELLED') {
    return 'Cancelled';
  }

  if (task.dueDate < today) {
    return 'Overdue';
  }

  if (task.dueDate === today) {
    return 'Today';
  }

  return 'Upcoming';
}

function groupedTasks(tasks: CrmTask[], today: string) {
  const groups = new Map<TaskGroup, CrmTask[]>();

  for (const task of tasks) {
    const name = getGroup(task, today);

    groups.set(name, [...(groups.get(name) ?? []), task]);
  }

  return GROUP_ORDER.filter(name => groups.has(name)).map(name => ({
    name,
    items: groups.get(name) ?? [],
  }));
}

interface TaskCardProps {
  task: CrmTask;
  locale: string;
  today: string;
  busy: boolean;
  onEdit: (task: CrmTask) => void;
  onStatus: (task: CrmTask, status: TaskStatus) => void;
}

function TaskCard({
  task,
  locale,
  today,
  busy,
  onEdit,
  onStatus,
}: TaskCardProps) {
  const isDone = task.status === 'DONE';
  const isCancelled = task.status === 'CANCELLED';

  const isOverdue = !isDone && !isCancelled && task.dueDate < today;

  const isToday = !isDone && !isCancelled && task.dueDate === today;

  const active = !isDone && !isCancelled;

  return (
    <article
      className={`rounded-xl border bg-white p-4 transition-shadow hover:shadow-sm sm:p-5 ${
        isOverdue ? 'border-red-200' : 'border-slate-200'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Complete / reopen */}
        <button
          type="button"
          disabled={busy}
          onClick={() => onStatus(task, isDone ? 'OPEN' : 'DONE')}
          aria-label={
            isDone ? `Reopen ${task.title}` : `Complete ${task.title}`
          }
          title={isDone ? 'Reopen task' : 'Mark completed'}
          className="mt-0.5 shrink-0 rounded-full p-1 text-[#00528b] disabled:opacity-40"
        >
          {isDone ? <FiCheckCircle size={23} /> : <FiCircle size={23} />}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h3
                className={`text-sm font-bold break-words sm:text-base ${
                  isDone ? 'text-slate-500 line-through' : 'text-[#002b49]'
                }`}
              >
                {task.title}
              </h3>

              <div className="mt-2 flex flex-wrap gap-2">
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                  {TASK_KINDS[task.kind]}
                </span>

                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    PRIORITY_COLORS[task.priority]
                  }`}
                >
                  {TASK_PRIORITIES[task.priority]}
                </span>

                {task.status === 'IN_PROGRESS' && (
                  <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700">
                    In progress
                  </span>
                )}

                {isCancelled && (
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-500">
                    Cancelled
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => onEdit(task)}
              disabled={busy}
              aria-label={`Edit ${task.title}`}
              className="shrink-0 rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 disabled:opacity-40"
            >
              <FiEdit2 size={15} />
            </button>
          </div>

          {task.description && (
            <p className="mt-3 text-sm leading-6 break-words whitespace-pre-wrap text-slate-600">
              {task.description}
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500">
            <span
              className={`inline-flex items-center gap-1.5 ${
                isOverdue
                  ? 'font-semibold text-red-700'
                  : isToday
                    ? 'font-semibold text-amber-700'
                    : ''
              }`}
            >
              <FiCalendar />
              {formatDate(task.dueDate)}
              {isOverdue && ' · Overdue'}
              {isToday && ' · Today'}
            </span>

            <span className="inline-flex items-center gap-1.5">
              <FiUsers />
              {task.assigneeName}
            </span>

            {task.relatedDealId && (
              <Link
                href={`/${locale}/admin/deals`}
                title={task.relatedDealTitle ?? ''}
                className="inline-flex items-center gap-1.5 font-medium text-[#00528b] hover:underline"
              >
                {task.relatedDealTitle ?? 'Related deal'}
              </Link>
            )}
          </div>

          {/* Quick actions */}
          <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
            {task.status === 'OPEN' && (
              <button
                type="button"
                disabled={busy}
                onClick={() => onStatus(task, 'IN_PROGRESS')}
                className="rounded-full border border-[#00528b] px-4 py-2 text-xs font-semibold text-[#00528b] hover:bg-blue-50 disabled:opacity-40"
              >
                Start task
              </button>
            )}

            {active && (
              <button
                type="button"
                disabled={busy}
                onClick={() => onStatus(task, 'DONE')}
                className="rounded-full bg-[#002b49] px-4 py-2 text-xs font-semibold text-white disabled:opacity-40"
              >
                Mark completed
              </button>
            )}

            {(isDone || isCancelled) && (
              <button
                type="button"
                disabled={busy}
                onClick={() => onStatus(task, 'OPEN')}
                className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold disabled:opacity-40"
              >
                <FiRotateCcw />
                Reopen
              </button>
            )}

            {active && (
              <button
                type="button"
                disabled={busy}
                onClick={() => onStatus(task, 'CANCELLED')}
                className="rounded-full border px-4 py-2 text-xs font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-40"
              >
                Cancel task
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function TasksPage() {
  const locale = useLocale();

  const [scope, setScope] = useState<TaskScope>('MINE');

  const [view, setView] = useState<TaskView>('ALL');

  const [priority, setPriority] = useState<TaskPriority | 'ALL'>('ALL');

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [today, setToday] = useState(getLocalToday);

  const [page, setPage] = useState(1);

  const [data, setData] = useState<TasksResponse | null>(null);

  const [loading, setLoading] = useState(true);

  const [busyId, setBusyId] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);

  const [notice, setNotice] = useState<string | null>(null);

  const [revision, setRevision] = useState(0);

  const [editorOpen, setEditorOpen] = useState(false);

  const [editingTask, setEditingTask] = useState<CrmTask | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search), 350);

    return () => {
      window.clearTimeout(timer);
    };
  }, [search]);

  // Load tasks from NestJS.
  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError(null);

    getTasks(
      {
        scope,
        view,
        priority,
        search: debouncedSearch,
        today,
        page,
        limit: PAGE_SIZE,
      },
      controller.signal
    )
      .then(result => {
        if (!controller.signal.aborted) {
          setData(result);
        }
      })
      .catch(err => {
        if (!controller.signal.aborted) {
          setData(null);

          setError(
            err instanceof Error ? err.message : 'Could not load tasks.'
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [scope, view, priority, debouncedSearch, today, page, revision]);

  const refresh = () => {
    setToday(getLocalToday());
    setRevision(value => value + 1);
  };

  const changeView = (next: TaskView) => {
    setView(next);
    setPage(1);
  };

  const changeScope = (next: TaskScope) => {
    setScope(next);
    setPage(1);
  };

  const onSaved = (_task: CrmTask) => {
    setEditorOpen(false);
    setEditingTask(null);

    setNotice(
      'Task saved successfully. If it was assigned to a colleague, find it under Team Tasks.'
    );

    setPage(1);
    refresh();
  };

  async function setTaskStatus(task: CrmTask, status: TaskStatus) {
    if (busyId !== null) return;

    setBusyId(task._id);
    setError(null);
    setNotice(null);

    try {
      await changeTaskStatus(task._id, status, task.version);

      setNotice(
        status === 'DONE'
          ? 'Task completed.'
          : status === 'IN_PROGRESS'
            ? 'Task started.'
            : status === 'CANCELLED'
              ? 'Task cancelled.'
              : 'Task reopened.'
      );

      refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update task.');

      // Refresh after version conflicts too.
      refresh();
    } finally {
      setBusyId(null);
    }
  }

  const summary = data?.summary;

  const stats = [
    {
      label: 'Open Tasks',
      value: summary?.open ?? '—',
      icon: <FiCircle size={20} />,
      color: 'text-[#00528b]',
    },
    {
      label: 'Due Today',
      value: summary?.today ?? '—',
      icon: <FiCalendar size={20} />,
      color: 'text-amber-600',
    },
    {
      label: 'Overdue',
      value: summary?.overdue ?? '—',
      icon: <FiAlertCircle size={20} />,
      color: 'text-red-600',
    },
    {
      label: 'Completed',
      value: summary?.completed ?? '—',
      icon: <FiCheckCircle size={20} />,
      color: 'text-green-600',
    },
  ];

  const groups = groupedTasks(data?.items ?? [], today);

  const pageCount = Math.max(1, Math.ceil((data?.total ?? 0) / PAGE_SIZE));

  return (
    <main className="min-h-full bg-[#fcfcfd] text-[#002b49]">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white px-5 py-7 sm:px-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Tasks & Follow-ups</h1>

            <p className="mt-1 text-sm text-slate-500">
              Organize customer calls, quotations and sales follow-ups
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={refresh}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-full border border-[#002b49] px-4 py-2.5 text-sm font-semibold disabled:opacity-40"
            >
              <FiRefreshCw className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>

            <button
              type="button"
              onClick={() => {
                setEditingTask(null);
                setEditorOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-full bg-[#002b49] px-5 py-2.5 text-sm font-semibold text-white"
            >
              <FiPlus />
              New Task
            </button>
          </div>
        </div>
      </header>

      <div className="space-y-6 p-4 sm:p-7">
        {/* My tasks / team tasks */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex rounded-full border border-slate-200 bg-white p-1">
            {(
              [
                ['MINE', 'My Tasks'],
                ['TEAM', 'Team Tasks'],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={scope === value}
                onClick={() => changeScope(value)}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold ${
                  scope === value
                    ? 'bg-[#002b49] text-white'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <p className="text-xs text-slate-500">
            {scope === 'MINE'
              ? 'Tasks assigned to you'
              : 'Tasks across your CRM team'}
          </p>
        </div>

        {/* Statistics */}
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(stat => (
            <div
              key={stat.label}
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-slate-500">{stat.label}</p>

                <span className={stat.color}>{stat.icon}</span>
              </div>

              <p className="mt-3 text-3xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <section className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="flex flex-wrap gap-2">
            {VIEWS.map(option => (
              <button
                key={option.value}
                type="button"
                aria-pressed={view === option.value}
                onClick={() => changeView(option.value)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold ${
                  view === option.value
                    ? 'border-[#002b49] bg-[#002b49] text-white'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-[minmax(0,1fr)_190px]">
            <label className="relative">
              <FiSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" />

              <input
                aria-label="Search tasks"
                maxLength={100}
                value={search}
                onChange={event => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search tasks, managers or deals..."
                className="w-full rounded-full border border-slate-200 py-3 pr-4 pl-11 text-sm outline-none focus:border-[#00528b]"
              />
            </label>

            <select
              aria-label="Filter priority"
              value={priority}
              onChange={event => {
                setPriority(event.target.value as TaskPriority | 'ALL');
                setPage(1);
              }}
              className="rounded-full border border-slate-200 bg-white px-4 py-3 text-sm"
            >
              <option value="ALL">All priorities</option>

              {(
                Object.entries(TASK_PRIORITIES) as [TaskPriority, string][]
              ).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </section>

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {notice && (
          <div
            role="status"
            className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-[#00528b]"
          >
            {notice}
          </div>
        )}

        {/* Task groups */}
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Task List</h2>

            <span className="text-xs text-slate-500">
              {data?.total ?? 0} matching tasks
            </span>
          </div>

          {loading ? (
            <div className="rounded-xl border bg-white p-10 text-center text-sm text-slate-500">
              Loading tasks...
            </div>
          ) : !data ? (
            <div className="rounded-xl border bg-white p-10 text-center text-sm text-slate-500">
              Could not load task list.
            </div>
          ) : data.items.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-white p-12 text-center">
              <FiCheckCircle size={30} className="mx-auto text-slate-400" />

              <p className="mt-4 font-semibold">No tasks found</p>

              <p className="mt-2 text-sm text-slate-500">
                Create your first task or change the selected filters.
              </p>
            </div>
          ) : (
            groups.map(group => (
              <div key={group.name} className="space-y-3">
                <div className="flex items-center gap-3">
                  {group.name === 'Overdue' ? (
                    <FiAlertCircle className="text-red-600" />
                  ) : group.name === 'Today' ? (
                    <FiClock className="text-amber-600" />
                  ) : group.name === 'Completed' ? (
                    <FiCheckCircle className="text-green-600" />
                  ) : (
                    <FiCalendar className="text-slate-500" />
                  )}

                  <h3 className="font-bold">{group.name}</h3>

                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-500">
                    {group.items.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {group.items.map(task => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      locale={locale}
                      today={today}
                      busy={busyId !== null}
                      onEdit={item => {
                        setEditingTask(item);
                        setEditorOpen(true);
                      }}
                      onStatus={(item, nextStatus) =>
                        void setTaskStatus(item, nextStatus)
                      }
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </section>

        {/* Pagination */}
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">
            Page {page} of {pageCount}
            {' · '}
            {PAGE_SIZE} per page
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Previous page"
              disabled={loading || page <= 1}
              onClick={() => setPage(value => value - 1)}
              className="rounded-lg border p-2 disabled:opacity-40"
            >
              <FiChevronLeft />
            </button>

            <button
              type="button"
              aria-label="Next page"
              disabled={loading || page >= pageCount}
              onClick={() => setPage(value => value + 1)}
              className="rounded-lg border p-2 disabled:opacity-40"
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      </div>

      {editorOpen && (
        <TaskEditor
          key={editingTask?._id ?? 'new-task'}
          task={editingTask}
          onClose={() => {
            setEditorOpen(false);
            setEditingTask(null);
          }}
          onSaved={onSaved}
        />
      )}
    </main>
  );
}
