'use client';

import { type FormEvent, useEffect, useState } from 'react';
import { FiBriefcase, FiSearch, FiUser, FiX } from 'react-icons/fi';

import {
  type CrmTask,
  TASK_KINDS,
  TASK_PRIORITIES,
  type TaskAssignee,
  type TaskInput,
  type TaskKind,
  type TaskPriority,
  createTask,
  getLocalToday,
  getTaskAssignees,
  updateTask,
} from './tasks-api';

import { type Deal, getDeals } from '../deals/deals-api';

// Note: we're inside /admin/crm/tasks.
// The deals API is at /admin/deals.
// Therefore it is two levels above "tasks".

function emptyTask(): TaskInput {
  return {
    title: '',
    description: '',
    kind: 'FOLLOW_UP',
    priority: 'NORMAL',
    dueDate: getLocalToday(),
    assigneeId: undefined,
    relatedDealId: null,
  };
}

function fromTask(task: CrmTask): TaskInput {
  return {
    title: task.title,
    description: task.description,
    kind: task.kind,
    priority: task.priority,
    dueDate: task.dueDate,
    assigneeId: task.assigneeId,
    relatedDealId: task.relatedDealId,
  };
}

interface Props {
  task: CrmTask | null;
  onClose: () => void;
  onSaved: (task: CrmTask) => void;
}

export default function TaskEditor({ task, onClose, onSaved }: Props) {
  const [form, setForm] = useState<TaskInput>(() =>
    task ? fromTask(task) : emptyTask()
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Employee selector
  const [assigneeSearch, setAssigneeSearch] = useState('');

  const [assigneeOptions, setAssigneeOptions] = useState<TaskAssignee[]>([]);

  const [assigneeOpen, setAssigneeOpen] = useState(false);

  const [assigneeLoading, setAssigneeLoading] = useState(false);

  const [selectedAssigneeName, setSelectedAssigneeName] = useState(
    task?.assigneeName ?? 'Me (default)'
  );

  // Deal selector
  const [dealSearch, setDealSearch] = useState('');

  const [dealOptions, setDealOptions] = useState<Deal[]>([]);

  const [dealOpen, setDealOpen] = useState(false);

  const [dealLoading, setDealLoading] = useState(false);

  const [selectedDealTitle, setSelectedDealTitle] = useState(
    task?.relatedDealTitle ?? ''
  );

  function setField<K extends keyof TaskInput>(key: K, value: TaskInput[K]) {
    setForm(previous => ({
      ...previous,
      [key]: value,
    }));
  }

  // Load employee search results.
  useEffect(() => {
    if (!assigneeOpen) return;

    const controller = new AbortController();

    const timer = window.setTimeout(() => {
      setAssigneeLoading(true);

      getTaskAssignees(assigneeSearch, controller.signal)
        .then(result => {
          if (!controller.signal.aborted) {
            setAssigneeOptions(result);
          }
        })
        .catch(err => {
          if (!controller.signal.aborted) {
            setAssigneeOptions([]);

            setError(
              err instanceof Error ? err.message : 'Could not load employees.'
            );
          }
        })
        .finally(() => {
          if (!controller.signal.aborted) {
            setAssigneeLoading(false);
          }
        });
    }, 250);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [assigneeOpen, assigneeSearch]);

  // Search existing Equipment Deals.
  useEffect(() => {
    if (!dealOpen) return;

    const controller = new AbortController();

    const timer = window.setTimeout(() => {
      setDealLoading(true);

      getDeals(
        {
          page: 1,
          limit: 10,
          direction: 'ALL',
          stage: 'ALL',
          search: dealSearch.trim(),
        },
        controller.signal
      )
        .then(result => {
          if (!controller.signal.aborted) {
            setDealOptions(result.items);
          }
        })
        .catch(err => {
          if (!controller.signal.aborted) {
            setDealOptions([]);

            setError(
              err instanceof Error ? err.message : 'Could not load deals.'
            );
          }
        })
        .finally(() => {
          if (!controller.signal.aborted) {
            setDealLoading(false);
          }
        });
    }, 250);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [dealOpen, dealSearch]);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.title.trim()) {
      setError('Enter the task title.');
      return;
    }

    if (!form.dueDate) {
      setError('Select a due date.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const payload: TaskInput = {
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        assigneeId: form.assigneeId || undefined,
      };

      const result = task
        ? await updateTask(task._id, payload, task.version)
        : await createTask(payload);

      onSaved(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save task.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6">
      <button
        type="button"
        aria-label="Close task editor"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/50"
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-editor-title"
        className="relative flex max-h-[95vh] w-full max-w-[680px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <header className="flex items-center justify-between gap-3 border-b p-5 sm:px-7">
          <div>
            <p className="text-xs text-slate-500">CRM / Tasks</p>

            <h2
              id="task-editor-title"
              className="mt-1 text-xl font-bold text-[#002b49]"
            >
              {task ? 'Edit task' : 'Create new task'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg border p-2"
          >
            <FiX size={20} />
          </button>
        </header>

        <form
          onSubmit={event => void save(event)}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="space-y-6 overflow-y-auto p-5 sm:p-7">
            {error && (
              <div
                role="alert"
                className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            {/* Title */}
            <label className="block text-sm">
              <span className="mb-2 block font-semibold">
                What needs to be done? *
              </span>

              <input
                autoFocus
                required
                maxLength={200}
                value={form.title}
                onChange={event => setField('title', event.target.value)}
                placeholder="Call customer about industrial mixer"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#00528b]"
              />
            </label>

            {/* Main task settings */}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm">
                <span className="mb-2 block font-medium">Activity type</span>

                <select
                  value={form.kind}
                  onChange={event =>
                    setField('kind', event.target.value as TaskKind)
                  }
                  className="w-full rounded-xl border bg-white px-4 py-3"
                >
                  {(Object.entries(TASK_KINDS) as [TaskKind, string][]).map(
                    ([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    )
                  )}
                </select>
              </label>

              <label className="text-sm">
                <span className="mb-2 block font-medium">Priority</span>

                <select
                  value={form.priority}
                  onChange={event =>
                    setField('priority', event.target.value as TaskPriority)
                  }
                  className="w-full rounded-xl border bg-white px-4 py-3"
                >
                  {(
                    Object.entries(TASK_PRIORITIES) as [TaskPriority, string][]
                  ).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-sm sm:col-span-2">
                <span className="mb-2 block font-medium">Due date *</span>

                <input
                  required
                  type="date"
                  value={form.dueDate}
                  onChange={event => setField('dueDate', event.target.value)}
                  className="w-full rounded-xl border bg-white px-4 py-3"
                />
              </label>
            </div>

            {/* Assignee selector */}
            <section className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 font-semibold">
                <FiUser />
                Assigned to
              </div>

              <p className="mt-2 text-sm text-[#00528b]">
                {selectedAssigneeName}
              </p>

              <div className="relative mt-3">
                <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />

                <input
                  type="search"
                  aria-label="Search CRM employees"
                  value={assigneeSearch}
                  onFocus={() => setAssigneeOpen(true)}
                  onChange={event => {
                    setAssigneeSearch(event.target.value);
                    setAssigneeOpen(true);
                  }}
                  placeholder="Find an employee by name or email..."
                  className="w-full rounded-lg border py-2.5 pr-3 pl-10 text-sm"
                />
              </div>

              {assigneeOpen && (
                <div className="mt-2 max-h-44 overflow-y-auto rounded-lg border bg-white">
                  {assigneeLoading ? (
                    <p className="p-3 text-sm text-slate-500">
                      Searching employees...
                    </p>
                  ) : assigneeOptions.length === 0 ? (
                    <p className="p-3 text-sm text-slate-500">
                      No employees found.
                    </p>
                  ) : (
                    assigneeOptions.map(user => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => {
                          setField('assigneeId', user.id);

                          setSelectedAssigneeName(user.name);

                          setAssigneeOpen(false);
                          setAssigneeSearch('');
                        }}
                        className="w-full border-b px-3 py-2.5 text-left last:border-b-0 hover:bg-blue-50"
                      >
                        <p className="text-sm font-medium">{user.name}</p>

                        <p className="mt-1 text-xs text-slate-500">
                          {user.email}
                        </p>
                      </button>
                    ))
                  )}
                </div>
              )}

              {!task && form.assigneeId && (
                <button
                  type="button"
                  onClick={() => {
                    setField('assigneeId', undefined);
                    setSelectedAssigneeName('Me (default)');
                  }}
                  className="mt-3 text-xs font-medium text-[#00528b] hover:underline"
                >
                  Assign to myself instead
                </button>
              )}
            </section>

            {/* Related deal selector */}
            <section className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 font-semibold">
                <FiBriefcase />
                Related Equipment Deal
              </div>

              <p className="mt-1 text-xs text-slate-500">
                Optional. Select an existing deal to connect this task to a
                customer or sale.
              </p>

              {form.relatedDealId && (
                <div className="mt-3 flex items-center justify-between gap-3 rounded-lg bg-blue-50 p-3">
                  <p className="text-sm font-medium">
                    {selectedDealTitle || 'Selected deal'}
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setField('relatedDealId', null);
                      setSelectedDealTitle('');
                    }}
                    aria-label="Remove related deal"
                    className="text-slate-500"
                  >
                    <FiX />
                  </button>
                </div>
              )}

              <div className="relative mt-3">
                <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400" />

                <input
                  type="search"
                  aria-label="Search equipment deals"
                  value={dealSearch}
                  onFocus={() => setDealOpen(true)}
                  onChange={event => {
                    setDealSearch(event.target.value);
                    setDealOpen(true);
                  }}
                  placeholder="Search by deal title or customer..."
                  className="w-full rounded-lg border py-2.5 pr-3 pl-10 text-sm"
                />
              </div>

              {dealOpen && (
                <div className="mt-2 max-h-48 overflow-y-auto rounded-lg border bg-white">
                  {dealLoading ? (
                    <p className="p-3 text-sm text-slate-500">
                      Searching deals...
                    </p>
                  ) : dealOptions.length === 0 ? (
                    <p className="p-3 text-sm text-slate-500">
                      No deals found.
                    </p>
                  ) : (
                    dealOptions.map(deal => (
                      <button
                        key={deal._id}
                        type="button"
                        onClick={() => {
                          setField('relatedDealId', deal._id);
                          setSelectedDealTitle(deal.title);
                          setDealOpen(false);
                          setDealSearch('');
                        }}
                        className="w-full border-b px-3 py-2.5 text-left last:border-b-0 hover:bg-blue-50"
                      >
                        <p className="text-sm font-medium">{deal.title}</p>

                        <p className="mt-1 text-xs text-slate-500">
                          {deal.companyName || deal.customerName}
                        </p>
                      </button>
                    ))
                  )}
                </div>
              )}
            </section>

            {/* Description */}
            <label className="block text-sm">
              <span className="mb-2 block font-semibold">
                Details / instructions
              </span>

              <textarea
                rows={5}
                maxLength={5000}
                value={form.description}
                onChange={event => setField('description', event.target.value)}
                placeholder="What should the manager do? Include customer requirements or follow-up details."
                className="w-full resize-y rounded-xl border px-4 py-3 outline-none focus:border-[#00528b]"
              />
            </label>
          </div>

          <footer className="flex justify-end gap-3 border-t bg-white p-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border px-5 py-2.5 text-sm font-semibold"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-[#002b49] px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            >
              {saving ? 'Saving...' : task ? 'Save changes' : 'Create task'}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}
